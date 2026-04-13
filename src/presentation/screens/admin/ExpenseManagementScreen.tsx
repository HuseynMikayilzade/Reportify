// Admin Expense Management Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { Button } from '../../components/Button';
import { Expense } from '../../../domain/entities/Expense';
import { generateId } from '../../../utils/uuid';
import { ExpenseRepository } from '../../../data/repositories/ExpenseRepository';
import { Toast } from '../../components/Toast';

export default function ExpenseManagementScreen() {
  const insets = useSafeAreaInsets();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [descriptionRequired, setDescriptionRequired] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [toast, setToast] = useState({ visible: false, title: '', type: 'success' as any });

  const expenseRepo = new ExpenseRepository();

  const loadExpenses = async () => {
    const list = await expenseRepo.getExpenses();
    setExpenses(list);
  };

  useEffect(() => { loadExpenses(); }, []);

  const handleCreate = async () => {
    if (!name) return;
    const newExpense: Expense = {
      id: generateId(),
      name,
      descriptionRequired,
      isActive,
    };
    try {
      await expenseRepo.createExpense(newExpense);
      setName('');
      setDescriptionRequired(false);
      setIsActive(true);
      setToast({ visible: true, title: 'Expense added successfully', type: 'success' });
      loadExpenses();
    } catch (err) {
      setToast({ visible: true, title: 'Failed to add expense', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await expenseRepo.deleteExpense(id);
      loadExpenses();
    } catch (err) {
      setToast({ visible: true, title: 'Failed to delete expense', type: 'error' });
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Add New Expense</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Expense Name (e.g. Gas)" 
          value={name} 
          onChangeText={setName} 
          placeholderTextColor={Colors.textMuted} 
        />
        
        <View style={styles.row}>
          <Text style={styles.label}>Require Description:</Text>
          <Switch 
            value={descriptionRequired} 
            onValueChange={setDescriptionRequired}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(124,111,255,0.5)' }}
            thumbColor={descriptionRequired ? Colors.primary : '#ccc'}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Active:</Text>
          <Switch 
            value={isActive} 
            onValueChange={setIsActive}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(124,111,255,0.5)' }}
            thumbColor={isActive ? Colors.primary : '#ccc'}
          />
        </View>

        <Button label="Add Expense" onPress={handleCreate} />
      </View>

      <Text style={styles.sectionLabel}>Catalog</Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {expenses.map(e => (
          <View key={e.id} style={styles.card}>
            <View style={styles.details}>
              <Text style={styles.eName}>{e.name}</Text>
              <Text style={styles.eSub}>
                {e.descriptionRequired ? 'Description Mandatory' : 'Description Optional'} 
                {!e.isActive && ' | Inactive'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(e.id)}>
              <Text style={styles.deleteBtn}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        {expenses.length === 0 && (
          <Text style={styles.emptyText}>No expenses defined yet.</Text>
        )}
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
  root: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: Spacing.screenH },
  form: { padding: Spacing.s4, backgroundColor: Colors.card, borderRadius: BorderRadius.lg, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderSubtle },
  formTitle: { color: Colors.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5 },
  input: { borderBottomWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, marginBottom: 16, paddingVertical: 10, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  label: { color: Colors.textSecondary, fontSize: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  list: { flex: 1 },
  card: { padding: 14, backgroundColor: Colors.card, borderRadius: BorderRadius.md, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderSubtle },
  details: { flex: 1 },
  eName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '500' },
  eSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  deleteBtn: { color: '#FF4D4D', fontSize: 12, fontWeight: '500', padding: 4 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, marginTop: 40, fontSize: 14 },
});
