#!/bin/bash

# MYFI Android Build Script
# This script builds the Android APK and App Bundle

echo "🚀 Building MYFI Android App..."

# Navigate to mobile directory
cd "$(dirname "$0")/.."

# Get Flutter dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean

# Build APK
echo "📱 Building APK..."
flutter build apk --release

if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    echo "📍 Location: build/app/outputs/flutter-apk/app-release.apk"
else
    echo "❌ APK build failed!"
    exit 1
fi

# Build App Bundle
echo "📦 Building App Bundle..."
flutter build appbundle --release

if [ $? -eq 0 ]; then
    echo "✅ App Bundle built successfully!"
    echo "📍 Location: build/app/outputs/bundle/release/app-release.aab"
else
    echo "❌ App Bundle build failed!"
    exit 1
fi

echo "🎉 Build complete! Your Android app is ready."

