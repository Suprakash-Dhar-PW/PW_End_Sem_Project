# PowerShell script to add common.js to all HTML files except login.html and sign-up.html

$htmlFiles = Get-ChildItem -Path "s:\PW_Pro" -Filter "*.html" -Recurse | Where-Object { $_.Name -ne "login.html" -and $_.Name -ne "sign-up.html" }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if common.js is already included
    if ($content -notmatch '<script src="common\.js"><\/script>') {
        # Find the position to insert the script tag (before the first script tag or before </body>)
        if ($content -match '<script') {
            $scriptPos = $content.IndexOf('<script')
            $newContent = $content.Substring(0, $scriptPos) + "<script src=`"common.js`"></script>`n    " + $content.Substring($scriptPos)
        } else {
            $bodyClosePos = $content.LastIndexOf('</body>')
            if ($bodyClosePos -gt 0) {
                $newContent = $content.Substring(0, $bodyClosePos) + "    <script src=`"common.js`"></script>`n" + $content.Substring($bodyClosePos)
            } else {
                # If </body> tag not found, just append to the end
                $newContent = $content + "`n<script src=`"common.js`"></script>`n"
            }
        }
        
        # Write the modified content back to the file
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Added common.js to $($file.Name)"
    } else {
        Write-Host "common.js already exists in $($file.Name)"
    }
}

Write-Host "Completed adding common.js to all HTML files except login.html and sign-up.html"