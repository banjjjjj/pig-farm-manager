// =========================================================
// QR SYNC CONTROLLER (Offline P2P Delta Synchronization)
// =========================================================
window.QRSync = {
    scanner: null,
    animationTimer: null,
    currentChunkIndex: 0,
    chunks: [],
    assembledChunks: {},
    expectedTotalChunks: 0,
    activeSessionId: null,

    generateSyncPayload(sinceTimestamp = null) {
        return DB.getExportDelta(sinceTimestamp);
    },

    // 1800 bytes per chunk (was 900) = ~half as many QR frames
    // QR Level L has highest capacity, 1800 bytes fits safely
    createChunks(payload, maxChunkSize = 1800) {
        const jsonStr = JSON.stringify(payload);
        const sessionId = 'sync_' + Date.now().toString(36);
        const totalChunks = Math.ceil(jsonStr.length / maxChunkSize);
        const chunkList = [];
        for (let i = 0; i < totalChunks; i++) {
            const start = i * maxChunkSize;
            const end = start + maxChunkSize;
            chunkList.push({
                type: 'PFM_SYNC',
                sid: sessionId,
                idx: i,
                total: totalChunks,
                data: jsonStr.substring(start, end)
            });
        }
        return chunkList;
    },

    stopQRAnimation() {
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
            this.animationTimer = null;
        }
    },

    renderQRToElement(containerId, text, size) {
        size = size || 260;
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        if (typeof QRCode === 'undefined') {
            container.innerHTML = '<p style="color:#ef4444;padding:10px;">QR library not loaded. Reload the page.</p>';
            return;
        }
        try {
            new QRCode(container, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (e) {
            container.innerHTML = '<p style="color:#ef4444;padding:10px;">Chunk too large. Try "Recent changes" scope.</p>';
            console.error('QR render error:', e);
        }
    },

    // intervalMs = 1200ms (was 650ms) — gives scanner camera enough time to read each frame
    startExportDisplay(containerId, progressId, sinceTimestamp, intervalMs) {
        sinceTimestamp = sinceTimestamp || null;
        intervalMs = intervalMs || 1200;
        this.stopQRAnimation();
        const payload = this.generateSyncPayload(sinceTimestamp);
        this.chunks = this.createChunks(payload, 1800);
        this.currentChunkIndex = 0;

        const container = document.getElementById(containerId);
        const progressEl = document.getElementById(progressId);
        if (!container) return { totalChunks: 0, payload: payload };

        if (this.chunks.length === 1) {
            const chunkText = JSON.stringify(this.chunks[0]);
            this.renderQRToElement(containerId, chunkText, 260);
            if (progressEl) {
                progressEl.innerHTML = '<span class="badge badge-success">Single QR Code — hold camera steady</span>';
            }
            return { totalChunks: 1, payload: payload };
        }

        const self = this;
        const renderCurrentChunk = function() {
            if (self.chunks.length === 0) return;
            const chunk = self.chunks[self.currentChunkIndex];
            const chunkText = JSON.stringify(chunk);
            self.renderQRToElement(containerId, chunkText, 260);
            if (progressEl) {
                const pct = Math.round(((self.currentChunkIndex + 1) / self.chunks.length) * 100);
                progressEl.innerHTML =
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
                    '<span class="badge badge-warning">Part ' + (self.currentChunkIndex + 1) + ' of ' + self.chunks.length + '</span>' +
                    '<small class="text-muted">' + pct + '%</small></div>' +
                    '<div style="background:var(--glass-border);height:6px;border-radius:3px;overflow:hidden;">' +
                    '<div style="background:var(--accent-gradient);width:' + pct + '%;height:100%;transition:width 0.2s ease;"></div></div>' +
                    '<small class="text-muted" style="display:block;margin-top:8px;">Each frame shows for 1.2 seconds — keep camera steady</small>';
            }
            self.currentChunkIndex = (self.currentChunkIndex + 1) % self.chunks.length;
        };

        renderCurrentChunk();
        this.animationTimer = setInterval(renderCurrentChunk, intervalMs);
        return { totalChunks: this.chunks.length, payload: payload };
    },

    // --- QR Scanning & Reassembly ---
    startScanner: async function(readerElementId, onProgressCallback, onSuccessCallback, onErrorCallback) {
        this.assembledChunks = {};
        this.expectedTotalChunks = 0;
        this.activeSessionId = null;

        if (typeof Html5Qrcode === 'undefined') {
            if (onErrorCallback) onErrorCallback(new Error('QR scanner library not loaded. Connect to internet, reload, then try again.'));
            return;
        }

        await this.stopScanner();

        try {
            this.scanner = new Html5Qrcode(readerElementId);
        } catch (e) {
            if (onErrorCallback) onErrorCallback(new Error('Scanner init failed: ' + e.message));
            return;
        }

        const self = this;
        const config = {
            fps: 10,
            qrbox: function(w, h) {
                const minEdge = Math.min(w, h);
                const sz = Math.floor(minEdge * 0.80);
                return { width: sz, height: sz };
            },
            aspectRatio: 1.0,
            experimentalFeatures: { useBarCodeDetectorIfSupported: false }
        };

        const onScanSuccess = async function(decodedText) {
            try {
                let packet;
                try { packet = JSON.parse(decodedText); } catch(e) { return; }

                // Direct full payload (very small dataset)
                if (packet.v && packet.data) {
                    await self.stopScanner();
                    if (onSuccessCallback) onSuccessCallback(packet);
                    return;
                }

                // Chunked packet
                if (packet.type === 'PFM_SYNC' && packet.sid) {
                    if (self.activeSessionId !== packet.sid) {
                        self.activeSessionId = packet.sid;
                        self.expectedTotalChunks = packet.total;
                        self.assembledChunks = {};
                    }
                    if (self.assembledChunks[packet.idx] === undefined) {
                        self.assembledChunks[packet.idx] = packet.data;
                        const receivedCount = Object.keys(self.assembledChunks).length;
                        if (onProgressCallback) onProgressCallback(receivedCount, self.expectedTotalChunks);

                        if (receivedCount >= self.expectedTotalChunks) {
                            let fullJsonStr = '';
                            for (let i = 0; i < self.expectedTotalChunks; i++) {
                                fullJsonStr += (self.assembledChunks[i] || '');
                            }
                            await self.stopScanner();
                            try {
                                const fullPayload = JSON.parse(fullJsonStr);
                                if (onSuccessCallback) onSuccessCallback(fullPayload);
                            } catch(parseErr) {
                                if (onErrorCallback) onErrorCallback(new Error('Data reassembly failed — scan again from Part 1.'));
                            }
                        }
                    }
                }
            } catch(err) {
                console.error('QR scan error:', err);
            }
        };

        try {
            await this.scanner.start(
                { facingMode: 'environment' },
                config,
                onScanSuccess,
                function() {}  // onScanFailure — empty frames are normal
            );
        } catch(err) {
            let msg = err.message || 'Camera failed to start.';
            if (err.name === 'NotAllowedError' || msg.indexOf('NotAllowedError') >= 0) {
                msg = 'Camera permission denied. Allow camera in browser settings, then try again.';
            } else if (err.name === 'NotFoundError' || msg.indexOf('NotFoundError') >= 0) {
                msg = 'No camera found on this device. Use the Manual Paste option instead.';
            }
            if (onErrorCallback) onErrorCallback(new Error(msg));
        }
    },

    stopScanner: async function() {
        if (this.scanner) {
            try {
                if (this.scanner.isScanning) await this.scanner.stop();
                this.scanner.clear();
            } catch(e) {
                console.warn('Scanner cleanup (safe to ignore):', e.message);
            }
            this.scanner = null;
        }
    },

    applySyncPayload(payload) {
        return DB.mergeDelta(payload);
    }
};
