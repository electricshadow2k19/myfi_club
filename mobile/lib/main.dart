import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'providers/auth_provider.dart';
import 'providers/user_provider.dart';
import 'providers/upi_provider.dart';
import 'providers/networth_provider.dart';
import 'routes/app_router.dart';
import 'theme/app_theme.dart';
import 'services/api_service.dart';

void main() {
  // Initialize API service
  ApiService.init();
  runApp(const MyFiApp());
}

class MyFiApp extends StatelessWidget {
  const MyFiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => UpiProvider()),
        ChangeNotifierProvider(create: (_) => NetWorthProvider()),
      ],
      child: MaterialApp.router(
        title: 'MYFI',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        routerConfig: AppRouter.router,
      ),
    );
  }
}

