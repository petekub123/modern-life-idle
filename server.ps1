$port = 8080
$root = "$PSScriptRoot"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Start()

Write-Host "Listening on http://localhost:${port}/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        $filePath = Join-Path $root $path
        
        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath)
            switch ($extension) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css" }
                ".js"   { $contentType = "application/javascript" }
                ".json" { $contentType = "application/json" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                Default { $contentType = "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
}
