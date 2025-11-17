import 'package:flutter/material.dart';

class OtpScreen extends StatelessWidget {
  final String phone;

  const OtpScreen({super.key, required this.phone});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verify OTP')),
      body: const Center(
        child: Text('OTP Screen - To be implemented'),
      ),
    );
  }
}

