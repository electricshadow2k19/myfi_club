@echo off
REM MYFI Android Build Script for Windows

echo 🚀 Building MYFI Android App...

REM Navigate to mobile directory
cd /d "%~dp0\.."

REM Get Flutter dependencies
echo 📦 Getting Flutter dependencies...
flutter pub get

REM Clean previous builds
echo 🧹 Cleaning previous builds...
flutter clean

REM Build APK
echo 📱 Building APK...
flutter build apk --release

if %ERRORLEVEL% EQU 0 (
    echo ✅ APK built successfully!
    echo 📍 Location: build\app\outputs\flutter-apk\app-release.apk
) else (
    echo ❌ APK build failed!
    exit /b 1
)

REM Build App Bundle
echo 📦 Building App Bundle...
flutter build appbundle --release

if %ERRORLEVEL% EQU 0 (
    echo ✅ App Bundle built successfully!
    echo 📍 Location: build\app\outputs\bundle\release\app-release.aab
) else (
    echo ❌ App Bundle build failed!
    exit /b 1
)

echo 🎉 Build complete! Your Android app is ready.
pause

