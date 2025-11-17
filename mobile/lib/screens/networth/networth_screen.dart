import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/networth_provider.dart';

class NetWorthScreen extends StatelessWidget {
  const NetWorthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Net Worth')),
      body: Consumer<NetWorthProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final netWorth = provider.netWorth;
          if (netWorth == null) {
            return const Center(child: Text('No data available'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        const Text('Total Net Worth', style: TextStyle(fontSize: 14, color: Colors.grey)),
                        const SizedBox(height: 8),
                        Text(
                          '₹${netWorth['net_worth']?.toStringAsFixed(2) ?? '0.00'}',
                          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Breakdown', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (netWorth['breakdown'] != null)
                  ...netWorth['breakdown'].entries.map((entry) => Card(
                    child: ListTile(
                      title: Text(entry.key.replaceAll('_', ' ').toUpperCase()),
                      trailing: Text('₹${entry.value.toStringAsFixed(2)}'),
                    ),
                  )),
              ],
            ),
          );
        },
      ),
    );
  }
}

