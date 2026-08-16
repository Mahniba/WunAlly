# Build WunAlly release APK on Windows.
# The project path must NOT contain "!" — build runs from C:\w (short path).

$ErrorActionPreference = "Stop"
$Source = "c:\Users\nibam\OneDrive\Desktop\FINAL YEAR!\Final year Project\Project\WunAlly"
$BuildRoot = "C:\w"
$ApkOut = Join-Path $Source "WunAlly-release.apk"

$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot"
$env:NODE_ENV = "production"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "Syncing project to $BuildRoot ..."
if (-not (Test-Path $BuildRoot)) { New-Item -ItemType Directory -Path $BuildRoot | Out-Null }
robocopy $Source $BuildRoot /MIR /XD node_modules android .expo .expo-tmp-export /NFL /NDL /NJH /NJS | Out-Null
robocopy (Join-Path $Source "node_modules") (Join-Path $BuildRoot "node_modules") /E /NFL /NDL /NJH /NJS | Out-Null

if (-not (Test-Path "$BuildRoot\android\gradlew.bat")) {
  Write-Host "Running expo prebuild ..."
  Push-Location $BuildRoot
  npx expo prebuild --platform android --no-install
  Pop-Location
  Add-Content "$BuildRoot\android\gradle.properties" "`nandroid.packagingOptions.pickFirsts=**/libworklets.so"
}

Write-Host "Building release APK (arm64) ..."
Push-Location "$BuildRoot\android"
.\gradlew.bat assembleRelease --no-daemon
Pop-Location

Copy-Item "$BuildRoot\android\app\build\outputs\apk\release\app-release.apk" $ApkOut -Force
Write-Host "Done: $ApkOut"
