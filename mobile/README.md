# MYFI Mobile App

Flutter mobile application for MYFI - India's Personal Finance Super App

## Setup Instructions

### Prerequisites
- Flutter 3.0+ installed
- Android Studio / Xcode for development
- Android SDK / iOS SDK

### Installation

1. Install Flutter dependencies:
```bash
flutter pub get
```

2. Update API base URL in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'YOUR_API_URL';
```

3. Run the app:
```bash
# Android
flutter run

# iOS
flutter run -d ios

# Web
flutter run -d chrome
```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── routes/                # Navigation routes
├── screens/               # UI screens
│   ├── auth/             # Authentication screens
│   ├── home/             # Home screen
│   ├── upi/              # UPI payments
│   ├── bills/            # Bill payments
│   ├── networth/         # Net worth dashboard
│   ├── credit_score/     # Credit score
│   ├── mutual_funds/     # Mutual funds
│   ├── gold/             # Gold investments
│   └── profile/          # User profile
├── providers/            # State management
├── services/             # API services
└── theme/                # App theme
```

## Features (Phase 1)

- ✅ User Authentication (Login/Register)
- ✅ Home Dashboard
- ✅ UPI Payments
- ✅ Bill Payments
- ✅ Net Worth Dashboard
- ✅ Credit Score
- ✅ Mutual Funds (SIP/Lumpsum)
- ✅ Gold (Digital/Physical)

## Building for Production

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## Configuration

Update API endpoint in `lib/services/api_service.dart` before building for production.

