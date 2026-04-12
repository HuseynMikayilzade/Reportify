// Admin Product Management Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../../theme';
import { Button } from '../../components/Button';
import { Product, ProductCategory, ProductType } from '../../../domain/entities/Product';
// Assuming useAdminStore or similar hook exists; using dummy state for implementation demonstration
import { generateId } from '../../../utils/uuid';
import { ProductRepository } from '../../../data/repositories/ProductRepository';

export default function ProductManagementScreen() {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('other');
  const [type, setType] = useState<ProductType>('sales');
  const [isActive, setIsActive] = useState(true);

  const productRepo = new ProductRepository(); // In practice, inject via DI or Zustand store

  const loadProducts = async () => {
    const list = await productRepo.getProducts();
    setProducts(list);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleCreate = async () => {
    if (!name) return;
    const newProduct: Product = {
      id: generateId(),
      name,
      price: parseFloat(price) || 0,
      category,
      productType: type,
      isActive,
    };
    await productRepo.createProduct(newProduct);
    setName('');
    setPrice('');
    loadProducts();
  };

  return (
    <View style={styles.root}>
      
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor={Colors.textMuted} />
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor={Colors.textMuted} />
        <View style={styles.row}>
          <Text style={{color: Colors.textSecondary}}>Active:</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>
        <Button label="Add Product" onPress={handleCreate} />
      </View>

      <ScrollView style={styles.list}>
        {products.map(p => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.pName}>{p.name}</Text>
            <Text style={styles.pSub}>{p.category} | {p.productType}</Text>
            <Text style={styles.price}>${p.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: Spacing.screenH },
  title: { fontSize: 20, color: Colors.textPrimary, fontWeight: 'bold', marginBottom: Spacing.s4 },
  form: { padding: Spacing.s4, backgroundColor: Colors.card, borderRadius: 8, marginBottom: 16 },
  input: { borderBottomWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, marginBottom: 12, paddingVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  list: { flex: 1 },
  card: { padding: 12, backgroundColor: Colors.surface, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pName: { color: Colors.textPrimary, fontSize: 16 },
  pSub: { color: Colors.textMuted, fontSize: 12 },
  price: { color: Colors.primary, fontWeight: 'bold' }
});
