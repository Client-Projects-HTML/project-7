$ErrorActionPreference = "SilentlyContinue"

# Define the colors
$primaryHex = "#E11D48"
$hoverHex = "#9F1239"
$lightBgHex = "#FFF1F2"

# Get all HTML files
$files = Get-ChildItem -Recurse -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # 1. Update Tailwind Config colors
    $content = $content -replace "primary: \{[\s\S]*?50: '#[a-fA-F0-0]{6}',[\s\S]*?100: '#[a-fA-F0-0]{6}',[\s\S]*?500: '#[a-fA-F0-0]{6}',[\s\S]*?600: '#[a-fA-F0-0]{6}',[\s\S]*?700: '#[a-fA-F0-0]{6}',", "primary: {
                            50: '#FFF1F2',
                            100: '#FFE4E6',
                            500: '#E11D48',
                            600: '#BE123C',
                            700: '#9F1239',
                        },"
                        
    # 2. Update Background Gradients in Config
    $content = $content -replace "'gradient-blue-white': 'linear-gradient\(to bottom right, #2563eb, #ffffff\)'", "'gradient-rose-white': 'linear-gradient(to bottom right, #E11D48, #FFFFFF)'"
    $content = $content -replace "'gradient-blue-dark': 'linear-gradient\(to bottom right, #1e3a8a, #000000\)'", "'gradient-rose-dark': 'linear-gradient(to bottom right, #9F1239, #000000)'"

    # 3. Replace blue classes with rose classes
    $content = $content -replace "(from|to|via|bg|text|border|ring|shadow|decoration|outline)-blue-", "`$1-rose-"
    
    # 4. Replace indigo classes with rose classes (used for brand mix)
    $content = $content -replace "(from|to|via|bg|text|border|ring|shadow|decoration|outline)-indigo-", "`$1-rose-"
    
    # 5. Replace gradient-blue with gradient-rose
    $content = $content -replace "gradient-blue-", "gradient-rose-"

    # 6. Specific fix for hover:bg-blue-700 -> hover:bg-rose-800 per user request (hover = #9F1239)
    $content = $content -replace "hover:bg-rose-700", "hover:bg-rose-800"

    # Save content back
    $content | Set-Content $file.FullName
}

Write-Host "Color update complete."
