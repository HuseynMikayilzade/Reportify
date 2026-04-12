// Create Report Screen
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../store/authStore';
import { useReportsStore } from '../../../store/reportsStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Toast } from '../../components/Toast';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import { Shift } from '../../../domain/entities/Report';

const SHIFTS: Shift[] = ['Morning', 'Afternoon', 'Evening'];
const MAX_DESC = 500;

export default function CreateReportScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { createReport, isSubmitting } = useReportsStore();

  const [shift, setShift] = useState<Shift>('Morning');
  const [stockInputs, setStockInputs] = useState<{productId: string, received: string, delivered: string}[]>([]);
  const [salesInputs, setSalesInputs] = useState<{productId: string, qty: string}[]>([]);
  const [notes, setNotes] = useState('');
  
  const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; msg: string }>({
    visible: false, type: 'success', msg: '',
  });

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await createReport({
        userId: user.id,
        userFullName: user.fullName,
        branch: user.branch,
        shift,
        stock: stockInputs.map(s => ({
          productId: s.productId,
          receivedQty: parseFloat(s.received) || 0,
          deliveredQty: parseFloat(s.delivered) || 0
        })),
        sales: salesInputs.map(s => ({
          productId: s.productId,
          quantity: parseFloat(s.qty) || 0
        })),
        expenses: [], // Replace with dynamic expense data from template
        notes: notes.trim() || undefined,
      });
      setToast({ visible: true, type: 'success', msg: 'Report saved · will sync when online' });
      setTimeout(() => navigation.goBack(), 1800);
    } catch (err) {
      setToast({ visible: true, type: 'error', msg: err instanceof Error ? err.message : 'Submit failed' });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Report</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Shift Selector */}
          <Text style={styles.fieldLabel}>SHIFT</Text>
          <SegmentedControl options={SHIFTS} selected={shift} onSelect={setShift} />

          {/* Products logic can be inserted here via map on loaded template products */}
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>PRODUCTS (STOCK)</Text>
          <Text style={{color: Colors.textMuted, fontSize: 11}}>Load products from branch template here...</Text>
          
          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>SALES</Text>
          <Text style={{color: Colors.textMuted, fontSize: 11}}>Load sales products from branch template here...</Text>

          <Text style={[styles.fieldLabel, { marginTop: 20 }]}>EXPENSES</Text>
          <Text style={{color: Colors.textMuted, fontSize: 11}}>Load template expenses and custom ones...</Text>

          {/* Optional Notes */}
          <View style={styles.field}>
            <Input
              label="NOTES (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Anything to flag for the admin?"
              multiline
              style={{ minHeight: 72 }}
            />
          </View>

          {/* Submit */}
          <Button
            label="Submit report"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            style={styles.submitBtn}
          />
          <Text style={styles.offlineNote}>
            💾 Saved locally · will sync when online
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.type === 'success' ? 'Report submitted' : 'Error'}
        subtitle={toast.msg}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.s3,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: Colors.textSecondary, marginTop: -2 },
  title: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  scroll: { paddingHorizontal: Spacing.screenH, paddingTop: Spacing.s5, paddingBottom: 80 },
  fieldLabel: {
    fontSize: 11, fontWeight: '500', color: Colors.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: Spacing.s2,
  },
  field: { marginTop: Spacing.s5 },
  textAreaWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: BorderRadius.input,
    padding: 14,
    minHeight: 140,
  },
  textAreaError: { borderColor: Colors.error, backgroundColor: 'rgba(255,90,110,0.08)' },
  textArea: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  charRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  charCount: { fontSize: 10, color: Colors.textMuted },
  errorText: { fontSize: 11, color: Colors.error },
  submitBtn: { marginTop: Spacing.s8 },
  offlineNote: {
    textAlign: 'center', fontSize: 11,
    color: Colors.textMuted, marginTop: Spacing.s3,
  },
});
