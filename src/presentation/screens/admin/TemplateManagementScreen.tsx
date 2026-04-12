// Admin Template Management Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../../theme';
import { Button } from '../../components/Button';
import { Template } from '../../../domain/entities/Template';
import { Product } from '../../../domain/entities/Product';
import { generateId } from '../../../utils/uuid';

export default function TemplateManagementScreen() {
  const insets = useSafeAreaInsets();
  const [branch, setBranch] = useState('');
  
  return (
    <View style={styles.root}>
      
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Branch Name" value={branch} onChangeText={setBranch} placeholderTextColor={Colors.textMuted} />
        {/* Render products selection & expenses adding UI here */}
        <Button label="Save Template" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: Spacing.screenH },
  title: { fontSize: 20, color: Colors.textPrimary, fontWeight: 'bold', marginBottom: Spacing.s4 },
  form: { padding: Spacing.s4, backgroundColor: Colors.card, borderRadius: 8, marginBottom: 16 },
  input: { borderBottomWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, marginBottom: 12, paddingVertical: 8 },
});
