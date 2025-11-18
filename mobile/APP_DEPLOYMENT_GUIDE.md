# MYFI Mobile App - Complete Deployment Guide

## 📱 Overview

Your MYFI app is built with **Flutter**, which means you can build for both **Android** and **iOS** from the same codebase!

## ✅ What's Already Set Up

- ✅ Flutter app structure
- ✅ All screens and navigation
- ✅ API integration
- ✅ State management
- ✅ Android configuration files
- ✅ iOS configuration files
- ✅ Build scripts

## 🚀 Quick Build Commands

### Android (Works on Windows/Mac/Linux)

```bash
cd Codebase/mobile

# Install dependencies
flutter pub get

# Build APK (for direct installation)
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release
```

**Output files:**
- APK: `build/app/outputs/flutter-apk/app-release.apk`
- AAB: `build/app/outputs/bundle/release/app-release.aab`

### iOS (Mac Only - Requires Xcode)

```bash
cd Codebase/mobile

# Install dependencies
flutter pub get

# Build iOS
flutter build ios --release

# Then open in Xcode to archive
open ios/Runner.xcworkspace
```

## 📋 Pre-Build Checklist

### 1. Update API URL
Edit `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'https://your-backend-url.com/api/v1';
```

### 2. Update App Version
Edit `pubspec.yaml`:
```yaml
version: 1.0.0+1  # Format: version+buildNumber
```

### 3. Configure App Name & Package

**Android:**
- Edit `android/app/build.gradle`
- Change `applicationId "com.myfi.app"` to your package name

**iOS:**
- Open `ios/Runner.xcworkspace` in Xcode
- Set Bundle Identifier (e.g., `com.myfi.app`)

### 4. Add App Icons

**Android:**
- Use Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/
- Place icons in `android/app/src/main/res/mipmap-*/`

**iOS:**
- Use Xcode Asset Catalog
- Or place in `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

## 🎯 Publishing to Stores

### Google Play Store

1. **Create Developer Account**
   - Go to: https://play.google.com/console
   - Pay $25 one-time fee
   - Complete account setup

2. **Create App**
   - Click "Create app"
   - Fill app details
   - Set up store listing

3. **Upload App Bundle**
   - Go to Production → Create release
   - Upload `app-release.aab` file
   - Fill release notes
   - Submit for review

4. **Store Listing Requirements:**
   - App icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (at least 2)
   - Short description (80 chars)
   - Full description (4000 chars)
   - Privacy policy URL

### Apple App Store

1. **Create Developer Account**
   - Go to: https://developer.apple.com
   - Pay $99/year
   - Complete enrollment

2. **Create App in App Store Connect**
   - Go to: https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Fill app information

3. **Archive & Upload**
   - Open `ios/Runner.xcworkspace` in Xcode
   - Select "Any iOS Device"
   - Product → Archive
   - Click "Distribute App"
   - Upload to App Store Connect

4. **Submit for Review**
   - Fill app information
   - Upload screenshots
   - Set pricing
   - Submit for review

## 🧪 Testing Before Release

### Android Testing

1. **Install APK on device:**
   ```bash
   flutter install
   # Or manually: adb install build/app/outputs/flutter-apk/app-release.apk
   ```

2. **Test on multiple devices:**
   - Different screen sizes
   - Different Android versions
   - Test all features

### iOS Testing

1. **TestFlight (Recommended):**
   - Upload build to App Store Connect
   - Add internal/external testers
   - Testers install via TestFlight app

2. **Direct Installation:**
   - Connect iPhone via USB
   - Build and run from Xcode

## 🔐 Signing & Security

### Android Signing

1. **Generate Keystore:**
   ```bash
   keytool -genkey -v -keystore myfi-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias myfi
   ```

2. **Create `android/key.properties`:**
   ```properties
   storePassword=your_password
   keyPassword=your_password
   keyAlias=myfi
   storeFile=../myfi-key.jks
   ```

3. **Update `android/app/build.gradle`** to use keystore

### iOS Signing

- Configure in Xcode:
  - Runner → Signing & Capabilities
  - Select your Team
  - Xcode handles certificates automatically

## 📊 App Store Optimization (ASO)

### Keywords
- Personal finance
- UPI payments
- Mutual funds
- Net worth tracker
- Credit score
- Gold investment

### Screenshots
- Show key features
- Use real device screenshots
- Highlight unique value

### Description
- Start with value proposition
- List key features
- Include call-to-action

## 🐛 Common Issues & Solutions

### Build Fails
- Run `flutter clean`
- Run `flutter pub get`
- Check Flutter version: `flutter --version`
- Ensure Android SDK / Xcode is installed

### API Connection Issues
- Check API URL in `api_service.dart`
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, use `localhost`
- For real devices, use your computer's IP address

### Signing Issues
- Android: Check keystore path and passwords
- iOS: Check Apple Developer account and certificates

## 📞 Need Help?

- Flutter Docs: https://flutter.dev/docs
- Android Docs: https://developer.android.com
- iOS Docs: https://developer.apple.com/documentation
- Play Console Help: https://support.google.com/googleplay/android-developer
- App Store Connect Help: https://help.apple.com/app-store-connect

---

**Your app is ready to build! Follow the steps above to generate APK/AAB for Android or IPA for iOS.**

