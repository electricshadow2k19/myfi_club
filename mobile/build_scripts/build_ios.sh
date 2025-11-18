#!/bin/bash

# MYFI iOS Build Script
# This script builds the iOS app (requires Mac and Xcode)

echo "🚀 Building MYFI iOS App..."

# Navigate to mobile directory
cd "$(dirname "$0")/.."

# Get Flutter dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean

# Build iOS
echo "📱 Building iOS app..."
flutter build ios --release

if [ $? -eq 0 ]; then
    echo "✅ iOS build successful!"
    echo "📍 Open ios/Runner.xcworkspace in Xcode to archive and upload to App Store"
else
    echo "❌ iOS build failed!"
    exit 1
fi

echo "🎉 Build complete! Open Xcode to archive and submit to App Store."

