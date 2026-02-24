$files = Get-ChildItem -Recurse -Filter "*.html"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Update Tailwind primary colors
    $content = $content -replace "primary: \{[\s\S]*?\}", "primary: {
                            50: '#FFF1F2',
                            100: '#FFE4E6',
                            500: '#E11D48',
                            600: '#BE123C',
                            700: '#9F1239',
                        }"
    
    # Update Chart JS colors in HTML files if they exist
    $content = $content -replace "#0ea5e9", "#E11D48"
    $content = $content -replace "rgba\(14, 165, 233, 0.1\)", "rgba(225, 29, 72, 0.1)"
    $content = $content -replace "#8b5cf6", "#9F1239"

    $content | Set-Content $file.FullName
}

# Update dashboard.js chart colors if any
$dashJs = "assets/js/dashboard.js"
if (Test-Path $dashJs) {
    $content = Get-Content $dashJs -Raw
    $content = $content -replace "#0ea5e9", "#E11D48"
    $content = $content -replace "#8b5cf6", "#9F1239"
    $content | Set-Content $dashJs
}

Write-Host "Refined color update complete."
