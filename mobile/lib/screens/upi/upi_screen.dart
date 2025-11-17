import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/upi_provider.dart';

class UpiScreen extends StatelessWidget {
  const UpiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('UPI Payments')),
      body: const Center(
        child: Text('UPI Screen - To be implemented'),
      ),
    );
  }
}

