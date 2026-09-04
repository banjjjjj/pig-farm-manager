@echo off
title PigFarm Pro Local Web Server
cd /d "%~dp0"

echo ==================================================
echo         PigFarm Pro Local Host Launcher
echo ==================================================
echo.

:: Get Local IP Address
for /f "tokens=4 delims= " %%i in ('route print ^| findstr 0.0.0.0 ^| findstr /V "127.0.0.1"') do (
    set LOCAL_IP=%%i
)
if "%LOCAL_IP%"=="" (
    :: Fallback IP fetch
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
        set LOCAL_IP=%%a
        goto :ip_done
    )
)
:ip_done
:: Trim leading space if any
set LOCAL_IP=%LOCAL_IP: =%

echo Your computer's network IP Address is: %LOCAL_IP%
echo.

:: 1. Try Node.js npx
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [Status] Found Node.js! Launching http-server...
    echo Connect your phone to the same Wi-Fi, then open: http://%LOCAL_IP%:8080/
    echo.
    npx -y http-server -p 8080
    goto :end
)

:: 2. Try Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [Status] Found Python! Launching server...
    echo Connect your phone to the same Wi-Fi, then open: http://%LOCAL_IP%:8080/
    echo.
    python -m http.server 8080
    goto :end
)

:: 3. PowerShell Fallback
echo [Status] Node.js or Python not detected. Launching PowerShell server...
echo Connect your phone to the same Wi-Fi, then open: http://%LOCAL_IP%:8080/
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$listener = New-Object System.Net.HttpListener; ^
     $listener.Prefixes.Add('http://*:8080/'); ^
     try { $listener.Start() } catch { Write-Host 'Error: Admin rights needed to host on network via raw PowerShell. Please install Node.js or Python.' -ForegroundColor Red; pause; exit }; ^
     Write-Host 'Server running on port 8080...'; ^
     while ($listener.IsListening) { ^
         $context = $listener.GetContext(); ^
         $req = $context.Request; ^
         $res = $context.Response; ^
         $path = $req.Url.LocalPath; ^
         if ($path -eq '/') { $path = '/index.html' }; ^
         $file = Join-Path '.' $path.Replace('/', '\'); ^
         if (Test-Path $file -PathType Leaf) { ^
             $bytes = [System.IO.File]::ReadAllBytes($file); ^
             $res.ContentLength64 = $bytes.Length; ^
             if ($file.EndsWith('.html')) { $res.ContentType = 'text/html' } ^
             elseif ($file.EndsWith('.css')) { $res.ContentType = 'text/css' } ^
             elseif ($file.EndsWith('.js')) { $res.ContentType = 'application/javascript' } ^
             elseif ($file.EndsWith('.json')) { $res.ContentType = 'application/json' }; ^
             $res.OutputStream.Write($bytes, 0, $bytes.Length) ^
         } else { $res.StatusCode = 404 }; ^
         $res.Close() ^
     }"

:end
pause
