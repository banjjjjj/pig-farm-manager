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

    // --- QR Generation & Chunking ---
    generateSyncPayload(sinceTimestamp = null) {
        return DB.getExportDelta(sinceTimestamp);
    },

    createChunks(payload, maxChunkSize = 900) {
        const jsonStr = JSON.stringify(payload);
        const sessionId = 'sync_' + Date.now().toString(36);
        const totalChunks = Math.ceil(jsonStr.length / maxChunkSize);
        const chunkList = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * maxChunkSize;
            const end = start + maxChunkSize;
            const chunkData = jsonStr.substring(start, end);
            chunkList.push({
                type: 'PFM_SYNC',
                sid: sessionId,
                idx: i,
                total: totalChunks,
                data: chunkData
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

    renderQRToElement(containerId, text, size = 260) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (typeof QRCode === 'undefined') {
            container.innerHTML = '<p class="text-danger">QRCode library not loaded yet.</p>';
            return;
        }

        new QRCode(container, {
            text: text,
            width: size,
            height: size,
            colorDark: '#0a0e17',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    },

    startExportDisplay(containerId, progressId, sinceTimestamp = null, intervalMs = 650) {
        this.stopQRAnimation();
        const payload = this.generateSyncPayload(sinceTimestamp);
        this.chunks = this.createChunks(payload, 900);
        this.currentChunkIndex = 0;

        const container = document.getElementById(containerId);
        const progressEl = document.getElementById(progressId);

        if (!container) return;

        if (this.chunks.length === 1) {
            // Single QR Code - No animation needed
            const chunkText = JSON.stringify(this.chunks[0]);
            this.renderQRToElement(containerId, chunkText, 260);
            if (progressEl) {
                progressEl.innerHTML = `<span class="badge badge-success">Complete in 1 QR Code</span> <small class="text-muted">(${chunkText.length} bytes)</small>`;
            }
            return { totalChunks: 1, payload };
        }

        // Multi-part animated QR code sequence
        const renderCurrentChunk = () => {
            if (this.chunks.length === 0) return;
            const chunk = this.chunks[this.currentChunkIndex];
            const chunkText = JSON.stringify(chunk);
            this.renderQRToElement(containerId, chunkText, 260);

            if (progressEl) {
                progressEl.innerHTML = `
                    <div class="flex-between align-center" style="margin-bottom: 6px;">
                        <span class="badge badge-warning">Broadcasting Part ${this.currentChunkIndex + 1} of ${this.chunks.length}</span>
                        <small class="text-muted">${Math.round(((this.currentChunkIndex + 1) / this.chunks.length) * 100)}%</small>
                    </div>
                    <div style="background: var(--glass-border); height: 6px; border-radius: 3px; overflow: hidden;">
                        <div style="background: var(--accent-gradient); width: ${((this.currentChunkIndex + 1) / this.chunks.length) * 100}%; height: 100%; transition: width 0.2s ease;"></div>
                    </div>
                    <small class="text-muted" style="display: block; margin-top: 6px;">Keep Device B's camera pointed steadily at this QR code.</small>
                `;
            }

            this.currentChunkIndex = (this.currentChunkIndex + 1) % this.chunks.length;
        };

        renderCurrentChunk();
        this.animationTimer = setInterval(renderCurrentChunk, intervalMs);

        return { totalChunks: this.chunks.length, payload };
    },

    // --- QR Scanning & Reassembly ---
    async startScanner(readerElementId, onProgressCallback, onSuccessCallback, onErrorCallback) {
        this.assembledChunks = {};
        this.expectedTotalChunks = 0;
        this.activeSessionId = null;

        if (typeof Html5Qrcode === 'undefined') {
            if (onErrorCallback) onErrorCallback(new Error("Html5Qrcode scanner library is not loaded."));
            return;
        }

        // Stop any previous scanner instance
        await this.stopScanner();

        this.scanner = new Html5Qrcode(readerElementId);

        const config = {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdge * 0.75);
                return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0
        };

        const onScanSuccess = async (decodedText) => {
            try {
                let packet;
                try {
                    packet = JSON.parse(decodedText);
                } catch (e) {
                    // Not valid JSON or non-sync QR code
                    return;
                }

                // Handle direct unchunked sync payload
                if (packet.v && packet.data) {
                    await this.stopScanner();
                    if (onSuccessCallback) onSuccessCallback(packet);
                    return;
                }

                // Handle chunked packet
                if (packet.type === 'PFM_SYNC' && packet.sid) {
                    // Reset if a new session began
                    if (this.activeSessionId !== packet.sid) {
                        this.activeSessionId = packet.sid;
                        this.expectedTotalChunks = packet.total;
                        this.assembledChunks = {};
                    }

                    // Save chunk if not seen yet
                    if (!this.assembledChunks[packet.idx]) {
                        this.assembledChunks[packet.idx] = packet.data;
                        const receivedCount = Object.keys(this.assembledChunks).length;

                        if (onProgressCallback) {
                            onProgressCallback(receivedCount, this.expectedTotalChunks);
                        }

                        // Check if all chunks have been collected
                        if (receivedCount >= this.expectedTotalChunks) {
                            // Reassemble complete JSON payload
                            let fullJsonStr = '';
                            for (let i = 0; i < this.expectedTotalChunks; i++) {
                                fullJsonStr += this.assembledChunks[i] || '';
                            }

                            await this.stopScanner();

                            const fullPayload = JSON.parse(fullJsonStr);
                            if (onSuccessCallback) {
                                onSuccessCallback(fullPayload);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Error processing QR scan frame:", err);
            }
        };

        const onScanFailure = (error) => {
            // Frame did not contain QR code, ignore
        };

        try {
            await this.scanner.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                onScanFailure
            );
        } catch (err) {
            if (onErrorCallback) onErrorCallback(err);
        }
    },

    async stopScanner() {
        if (this.scanner) {
            try {
                if (this.scanner.isScanning) {
                    await this.scanner.stop();
                }
                this.scanner.clear();
            } catch (e) {
                console.warn("Scanner stop cleanup warning:", e);
            }
            this.scanner = null;
        }
    },

    // --- Direct Manual Text Sync (Fallback) ---
    applySyncPayload(payload) {
        return DB.mergeDelta(payload);
    }
};
