// Admin Template Management Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { Button } from '../../components/Button';
import { Template, TemplateExpense } from '../../../domain/entities/Template';
import { Product } from '../../../domain/entities/Product';
import { generateId } from '../../../utils/uuid';
import { ProductRepository } from '../../../data/repositories/ProductRepository';
import { TemplateRepository } from '../../../data/repositories/TemplateRepository';
import { Toast } from '../../components/Toast';

// Mock list of available expenses that could be managed elsewhere
const AVAILABLE_EXPENSES = [
  { id: 'exp_1', name: 'Gas' },
  { id: 'exp_2', name: 'Electricity' },
  { id: 'exp_3', name: 'Water' },
  { id: 'exp_4', name: 'Rent' },
  { id: 'exp_5', name: 'Maintenance' },
  { id: 'exp_6', name: 'Supplies' },
];

interface Props {
  branch: string;
}

export default function TemplateManagementScreen({ branch }: Props) {
  // Repositories
  const productRepo = new ProductRepository();
  const templateRepo = new TemplateRepository(productRepo);

  // Form State
  const [templateName, setTemplateName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<TemplateExpense[]>([]);

  // Tracks the existing template id so Save knows to update vs create
  const [existingTemplateId, setExistingTemplateId] = useState<string | null>(null);

  // Selection UI State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showExpensePicker, setShowExpensePicker] = useState(false);
  const [isRequireDesc, setIsRequireDesc] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: '', type: 'success' as any });

  useEffect(() => {
    loadInitialData();
  }, [branch]);

  const loadInitialData = async () => {
    const products = await productRepo.getProducts();
    setAllProducts(products);

    const existing = await templateRepo.getTemplateByBranch(branch);
    if (existing) {
      setExistingTemplateId(existing.id);
      setTemplateName(existing.name);
      setSelectedProducts(existing.products);
      setSelectedExpenses(existing.expenses);
    } else {
      setExistingTemplateId(null);
      setTemplateName('');
      setSelectedProducts([]);
      setSelectedExpenses([]);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) return;
    setSelectedProducts([...selectedProducts, product]);
    setShowProductPicker(false);
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  const handleAddExpense = (exp: { id: string, name: string }) => {
    if (selectedExpenses.find(e => e.id === exp.id)) return;
    const newExp: TemplateExpense = {
      id: exp.id,
      name: exp.name,
      requireDescription: isRequireDesc
    };
    setSelectedExpenses([...selectedExpenses, newExp]);
    setShowExpensePicker(false);
    setIsRequireDesc(false);
  };

  const handleRemoveExpense = (id: string) => {
    setSelectedExpenses(selectedExpenses.filter(e => e.id !== id));
  };

  const handleSave = async () => {
    if (!templateName) {
      setToast({ visible: true, title: 'Template name required', type: 'error' });
      return;
    }

    const template: Template = {
      id: existingTemplateId ?? generateId(),
      branch,
      name: templateName,
      products: selectedProducts,
      expenses: selectedExpenses
    };

    try {
      if (existingTemplateId) {
        await templateRepo.updateTemplate(template);
      } else {
        await templateRepo.createTemplate(template);
        setExistingTemplateId(template.id);
      }
      setToast({ visible: true, title: 'Template saved successfully', type: 'success' });
    } catch (err) {
      setToast({ visible: true, title: 'Failed to save template', type: 'error' });
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Info</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Template Name (e.g. Daily Operations)" 
            value={templateName} 
            onChangeText={setTemplateName} 
            placeholderTextColor={Colors.textMuted} 
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity onPress={() => setShowProductPicker(!showProductPicker)}>
              <Text style={styles.addText}>{showProductPicker ? 'Close' : '+ Add Product'}</Text>
            </TouchableOpacity>
          </View>

          {showProductPicker && (
            <View style={styles.picker}>
              {allProducts.filter(ap => !selectedProducts.find(sp => sp.id === ap.id)).map(p => (
                <TouchableOpacity key={p.id} style={styles.pickerItem} onPress={() => handleAddProduct(p)}>
                  <Text style={styles.pickerText}>{p.name}</Text>
                  <Text style={styles.pickerSub}>{p.category}</Text>
                </TouchableOpacity>
              ))}
              {allProducts.length === selectedProducts.length && (
                <Text style={styles.emptyText}>No more products available</Text>
              )}
            </View>
          )}

          <View style={styles.tagContainer}>
            {selectedProducts.map(p => (
              <View key={p.id} style={styles.tag}>
                <Text style={styles.tagText}>{p.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveProduct(p.id)}>
                  <Text style={styles.removeTag}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            <TouchableOpacity onPress={() => setShowExpensePicker(!showExpensePicker)}>
              <Text style={styles.addText}>{showExpensePicker ? 'Close' : '+ Add Expense'}</Text>
            </TouchableOpacity>
          </View>

          {showExpensePicker && (
            <View style={styles.picker}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Require description for new addition</Text>
                <Switch 
                  value={isRequireDesc} 
                  onValueChange={setIsRequireDesc}
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(124,111,255,0.5)' }}
                  thumbColor={isRequireDesc ? Colors.primary : '#ccc'}
                />
              </View>
              {AVAILABLE_EXPENSES.filter(ae => !selectedExpenses.find(se => se.id === ae.id)).map(e => (
                <TouchableOpacity key={e.id} style={styles.pickerItem} onPress={() => handleAddExpense(e)}>
                  <Text style={styles.pickerText}>{e.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.expenseList}>
            {selectedExpenses.map(e => (
              <View key={e.id} style={styles.expenseCard}>
                <View>
                  <Text style={styles.expenseName}>{e.name}</Text>
                  <Text style={styles.expenseSub}>
                    {e.requireDescription ? 'Description Mandatory' : 'Description Optional'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveExpense(e.id)}>
                  <Text style={styles.removeIcon}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <Button label="Save Template Structure" onPress={handleSave} style={styles.saveBtn} />
      </ScrollView>

      <Toast 
        visible={toast.visible} 
        title={toast.title} 
        type={toast.type} 
        onDismiss={() => setToast({ ...toast, visible: false })} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.screenH, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  addText: { color: Colors.primary, fontSize: 13, fontWeight: '500' },
  input: { 
    backgroundColor: Colors.card, 
    borderRadius: BorderRadius.md, 
    padding: 14, 
    color: Colors.textPrimary, 
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 12
  },
  picker: { 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.md, 
    padding: 8, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primaryGhost
  },
  pickerItem: { 
    padding: 12, 
    borderBottomWidth: 0.5, 
    borderBottomColor: Colors.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pickerText: { color: Colors.textPrimary, fontSize: 14 },
  pickerSub: { color: Colors.textMuted, fontSize: 11 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 4, marginBottom: 8 },
  switchLabel: { color: Colors.textSecondary, fontSize: 12 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.primaryGhost, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.primary
  },
  tagText: { color: Colors.primary, fontSize: 13, marginRight: 6 },
  removeTag: { color: Colors.primary, fontSize: 18, fontWeight: 'bold' },
  expenseList: { gap: 10 },
  expenseCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    padding: 14, 
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle
  },
  expenseName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '500' },
  expenseSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  removeIcon: { color: '#FF4D4D', fontSize: 12, fontWeight: '500' },
  saveBtn: { marginTop: 12 },
  emptyText: { textAlign: 'center', padding: 20, color: Colors.textMuted, fontSize: 12 },
});

