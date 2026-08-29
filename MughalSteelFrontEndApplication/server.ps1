$port = 5173
$root = "e:\MughalSteelProject\MughalSteelFrontEndApplication\dist"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
} catch {
    Write-Host "Failed to start listener on port $port, trying 8080..."
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    Write-Host "Server running at http://localhost:$port/"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".jfif" = "image/jpeg"
    ".gif"  = "image/gif"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath)) {
            $rawPath = "index.html"
        }

        # Normalize relative path
        $filePath = Join-Path $root ($rawPath -replace '/', '\')

        # If file doesn't exist, serve index.html (SPA routing fallback)
        if (-not (Test-Path $filePath -PathType Leaf)) {
            $filePath = Join-Path $root "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mimeTypes[$ext]
        if (-not $contentType) {
            $contentType = "application/octet-stream"
        }

        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = $contentType
        $response.ContentLength64 = $buffer.Length
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    } catch {
        # ignore context errors and keep loop going
    }
}
