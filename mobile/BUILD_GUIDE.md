# MYFI Mobile App - Build & Deployment Guide

## 📱 Current Status

You have a **Flutter app** that can build for both **Android** and **iOS**. Here's what you need to do to generate the actual app files (.apk/.aab for Android, .ipa for iOS).

## 🚀 Quick Start

### Prerequisites

1. **Flutter SDK** (3.0+)
   ```bash
   flutter --version
   ```

2. **Android Studio** (for Android builds)
   - Download: https://developer.android.com/studio
   - Install Android SDK

3. **Xcode** (for iOS builds - Mac only)
   - Download from App Store
   - Requires Mac computer

4. **Java JDK** (for Android)
   - Install JDK 17 or higher

## 📦 Step-by-Step Build Process

### For Android APK (Installable File)

1. **Navigate to mobile folder:**
   ```bash
   cd Codebase/mobile
   ```

2. **Get dependencies:**
   ```bash
   flutter pub get
   ```

3. **Update API URL:**
   - Edit `lib/services/api_service.dart`
   - Change `baseUrl` to your backend URL:
   ```dart
   static const String baseUrl = 'https://your-backend-url.com/api/v1';
   ```

4. **Build APK:**
   ```bash
   flutter build apk --release
   ```
   - Output: `build/app/outputs/flutter-apk/app-release.apk`

5. **Build App Bundle (for Play Store):**
   ```bash
   flutter build appbundle --release
   ```
   - Output: `build/app/outputs/bundle/release/app-release.aab`

### For iOS (Mac Required)

1. **Open iOS folder in Xcode:**
   ```bash
   cd Codebase/mobile/ios
   open Runner.xcworkspace
   ```

2. **Configure signing:**
   - Select your Apple Developer account
   - Set Bundle Identifier (e.g., `com.myfi.app`)
   - Configure certificates

3. **Build iOS:**
   ```bash
   cd Codebase/mobile
   flutter build ios --release
   ```

4. **Archive for App Store:**
   - Open Xcode
   - Product → Archive
   - Upload to App Store Connect

## 🔧 Configuration Needed

### Android Configuration

1. **App Name & Package:**
   - File: `android/app/build.gradle`
   - Set `applicationId` (e.g., `com.myfi.app`)
   - Set `versionCode` and `versionName`

2. **App Icon:**
   - Place icon files in `android/app/src/main/res/mipmap-*/`
   - Use Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/

3. **Permissions:**
   - File: `android/app/src/main/AndroidManifest.xml`
   - Add required permissions (Internet, etc.)

### iOS Configuration

1. **Bundle Identifier:**
   - File: `ios/Runner.xcodeproj/project.pbxproj`
   - Or set in Xcode: Runner → Signing & Capabilities

2. **App Icon:**
   - Place in `ios/Runner/Assets.xcassets/AppIcon.appiconset/`
   - Use Xcode Asset Catalog

3. **Info.plist:**
   - Configure app name, permissions, etc.

## 📋 What I'll Create For You

I'll generate:
1. ✅ Android configuration files
2. ✅ iOS configuration files  
3. ✅ App icons placeholders
4. ✅ Build scripts
5. ✅ Signing configuration templates

## 🎯 Next Steps After Build

### Android Play Store
1. Create Google Play Developer account ($25 one-time)
2. Upload `.aab` file
3. Fill store listing
4. Submit for review

### iOS App Store
1. Create Apple Developer account ($99/year)
2. Upload via Xcode or App Store Connect
3. Fill store listing
4. Submit for review

## 💡 Alternative: TestFlight / Internal Testing

- **Android:** Share APK directly or use Google Play Internal Testing
- **iOS:** Use TestFlight for beta testing (free with Apple Developer account)

---

**Let me know if you want me to:**
1. Create all the config files now
2. Set up app icons
3. Create build scripts
4. Help with specific platform setup

