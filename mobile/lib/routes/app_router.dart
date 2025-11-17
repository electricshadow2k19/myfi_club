import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/otp_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/upi/upi_screen.dart';
import '../screens/bills/bills_screen.dart';
import '../screens/networth/networth_screen.dart';
import '../screens/credit_score/credit_score_screen.dart';
import '../screens/mutual_funds/mutual_funds_screen.dart';
import '../screens/gold/gold_screen.dart';
import '../screens/profile/profile_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final isLoggedIn = authProvider.isAuthenticated;
      final isLoginRoute = state.matchedLocation == '/login' || 
                          state.matchedLocation == '/register' ||
                          state.matchedLocation == '/otp';

      if (!isLoggedIn && !isLoginRoute) {
        return '/login';
      }
      if (isLoggedIn && isLoginRoute) {
        return '/home';
      }
      return null;
    },
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/otp',
        builder: (context, state) {
          final phone = state.uri.queryParameters['phone'] ?? '';
          return OtpScreen(phone: phone);
        },
      ),
      
      // Main App Routes
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/upi',
        builder: (context, state) => const UpiScreen(),
      ),
      GoRoute(
        path: '/bills',
        builder: (context, state) => const BillsScreen(),
      ),
      GoRoute(
        path: '/networth',
        builder: (context, state) => const NetWorthScreen(),
      ),
      GoRoute(
        path: '/credit-score',
        builder: (context, state) => const CreditScoreScreen(),
      ),
      GoRoute(
        path: '/mutual-funds',
        builder: (context, state) => const MutualFundsScreen(),
      ),
      GoRoute(
        path: '/gold',
        builder: (context, state) => const GoldScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}

