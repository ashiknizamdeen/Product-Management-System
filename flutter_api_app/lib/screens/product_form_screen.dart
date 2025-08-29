import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ProductFormScreen extends StatefulWidget {
  final Map<String, dynamic>? product;
  final VoidCallback onSave;

  const ProductFormScreen({super.key, this.product, required this.onSave});

  @override
  _ProductFormScreenState createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _quantityController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.product != null) {
      _nameController.text = widget.product!['name'];
      _priceController.text = widget.product!['price'].toString();
      _quantityController.text = widget.product!['quantity'].toString();
    }
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final name = _nameController.text;
      final price = double.parse(_priceController.text);
      final quantity = int.parse(_quantityController.text);

      if (widget.product != null) {
        await ApiService.updateProduct(
            widget.product!['id'], name, price, quantity);
        _showSnackBar('Product updated successfully', Colors.green);
      } else {
        await ApiService.createProduct(name, price, quantity);
        _showSnackBar('Product created successfully', Colors.green);
      }

      widget.onSave();
      Navigator.pop(context);
    } catch (e) {
      _showSnackBar('Failed to save product', Colors.red);
    }
    setState(() => _isLoading = false);
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.product != null ? 'Edit Product' : 'Add Product'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: 'Product Name',
                          prefixIcon: const Icon(Icons.shopping_bag),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        validator: (value) => value?.isEmpty == true
                            ? 'Please enter product name'
                            : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _priceController,
                        keyboardType: const TextInputType.numberWithOptions(
                            decimal: true),
                        decoration: InputDecoration(
                          labelText: 'Price',
                          prefixIcon: const Icon(Icons.attach_money),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        validator: (value) {
                          if (value?.isEmpty == true)
                            return 'Please enter price';
                          if (double.tryParse(value!) == null)
                            return 'Please enter valid price';
                          if (double.parse(value) < 0)
                            return 'Price must be non-negative';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _quantityController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Quantity',
                          prefixIcon: const Icon(Icons.inventory),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        validator: (value) {
                          if (value?.isEmpty == true)
                            return 'Please enter quantity';
                          if (int.tryParse(value!) == null)
                            return 'Please enter valid quantity';
                          if (int.parse(value) < 0)
                            return 'Quantity must be non-negative';
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveProduct,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          widget.product != null
                              ? 'Update Product'
                              : 'Create Product',
                          style: const TextStyle(fontSize: 16),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}