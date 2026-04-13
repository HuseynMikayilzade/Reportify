// Management Hub Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '../../../theme';
import TemplateManagementScreen from './TemplateManagementScreen';
import ProductManagementScreen from './ProductManagementScreen';
import ExpenseManagementScreen from './ExpenseManagementScreen';
import { TemplateRepository } from '../../../data/repositories/TemplateRepository';
import { ProductRepository } from '../../../data/repositories/ProductRepository';
import { Template } from '../../../domain/entities/Template';

// ---------------------------------------------------------------------------
// Branch list — static for now, ready for API integration
// ---------------------------------------------------------------------------
const BRANCHES = ['Central', 'North', 'South'];

type ManagementView =
  | 'list'
  | 'template-branches'   // entry: branch selection cards
  | 'template-editor'     // editor: edit/create template for a specific branch
  | 'products'
  | 'expenses'
  | 'team';

export default function ManagementScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ManagementView>('list');

  // Selected branch when navigating into the editor
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Shared back button
  // ---------------------------------------------------------------------------
  const renderBackBtn = (target: ManagementView) => (
    <TouchableOpacity onPress={() => setView(target)} style={styles.backBtn}>
      <Text style={styles.backIcon}>‹</Text>
    </TouchableOpacity>
  );

  // ---------------------------------------------------------------------------
  // Branch list → editor
  // ---------------------------------------------------------------------------
  const openEditor = (branch: string) => {
    setActiveBranch(branch);
    setView('template-editor');
  };

  // ---------------------------------------------------------------------------
  // VIEWS
  // ---------------------------------------------------------------------------

  // Template editor (locked — editor component is unchanged)
  if (view === 'template-editor' && activeBranch) {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn('template-branches')}
          <Text style={styles.subTitle}>{activeBranch}</Text>
          <View style={{ width: 40 }} />
        </View>
        <TemplateManagementScreen branch={activeBranch} />
      </View>
    );
  }

  // Branch selection cards (entry screen for Template Management)
  if (view === 'template-branches') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn('list')}
          <Text style={styles.subTitle}>Templates</Text>
          <View style={{ width: 40 }} />
        </View>
        <BranchListView onSelectBranch={openEditor} />
      </View>
    );
  }

  if (view === 'products') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn('list')}
          <Text style={styles.subTitle}>Products</Text>
          <View style={{ width: 40 }} />
        </View>
        <ProductManagementScreen />
      </View>
    );
  }

  if (view === 'expenses') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn('list')}
          <Text style={styles.subTitle}>Expenses</Text>
          <View style={{ width: 40 }} />
        </View>
        <ExpenseManagementScreen />
      </View>
    );
  }

  if (view === 'team') {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.subHeader, { paddingTop: insets.top }]}>
          {renderBackBtn('list')}
          <Text style={styles.subTitle}>Team</Text>
          <View style={{ width: 40 }} />
        </View>
        <PlaceholderScreen title="Team Management" description="Manage employees, roles and branch assignments." />
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Hub list (root)
  // ---------------------------------------------------------------------------
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Management</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>Operations</Text>
        <View style={styles.card}>
          <ManagementRow
            label="Template Management"
            onPress={() => setView('template-branches')}
          />
          <View style={styles.divider} />
          <ManagementRow
            label="Products"
            onPress={() => setView('products')}
          />
          <View style={styles.divider} />
          <ManagementRow
            label="Expenses"
            onPress={() => setView('expenses')}
          />
          <View style={styles.divider} />
          <ManagementRow
            label="Team"
            onPress={() => setView('team')}
          />
        </View>

        <Text style={styles.hint}>
          Manage your branches, staff and product catalog for consistent reporting.
        </Text>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Branch selection card list
// Loads template status per branch — shows name if exists, warning if not
// ---------------------------------------------------------------------------
function BranchListView({ onSelectBranch }: { onSelectBranch: (branch: string) => void }) {
  const productRepo = new ProductRepository();
  const templateRepo = new TemplateRepository(productRepo);

  const [templateMap, setTemplateMap] = useState<Record<string, Template | null>>({});
  const [loading, setLoading] = useState(true);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    const results: Record<string, Template | null> = {};
    for (const branch of BRANCHES) {
      results[branch] = await templateRepo.getTemplateByBranch(branch);
    }
    setTemplateMap(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.branchScroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>Select a branch to manage its template</Text>
      {BRANCHES.map((branch) => {
        const template = templateMap[branch];
        return (
          <TouchableOpacity
            key={branch}
            style={styles.branchCard}
            onPress={() => onSelectBranch(branch)}
            activeOpacity={0.75}
          >
            <View style={styles.branchCardContent}>
              <Text style={styles.branchName}>{branch}</Text>
              {template ? (
                <Text style={styles.templateName}>{template.name}</Text>
              ) : (
                <Text style={styles.templateMissing}>Template yoxdur</Text>
              )}
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------
function ManagementRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function PlaceholderScreen({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderIcon}>🛠️</Text>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderDesc}>{description}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: Spacing.screenH,
    paddingTop: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  title: { fontSize: 22, fontWeight: '500', color: Colors.textPrimary },
  scroll: { paddingHorizontal: Spacing.screenH, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 11, fontWeight: '500', color: Colors.textMuted,
    letterSpacing: 0.7, textTransform: 'uppercase',
    marginBottom: Spacing.s2, marginTop: Spacing.s4,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.cardPadH,
  },
  divider: { height: 0.5, backgroundColor: Colors.borderSubtle },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 15, color: Colors.textSecondary },
  chevron: { fontSize: 18, color: Colors.textMuted },
  hint: {
    textAlign: 'center', fontSize: 12, lineHeight: 18,
    color: Colors.textMuted, marginTop: Spacing.s8,
    paddingHorizontal: 40,
  },
  // Sub-nav header
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenH,
    paddingVertical: Spacing.s3,
    backgroundColor: Colors.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 24, color: Colors.textSecondary, marginTop: -2 },
  subTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  // Placeholder
  placeholder: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40,
  },
  placeholderIcon: { fontSize: 48, marginBottom: 20 },
  placeholderTitle: { fontSize: 18, fontWeight: '500', color: Colors.textPrimary, marginBottom: 8 },
  placeholderDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  // Branch cards
  branchScroll: { padding: Spacing.screenH, paddingBottom: 100 },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 10,
  },
  branchCardContent: { flex: 1 },
  branchName: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary, marginBottom: 4 },
  templateName: { fontSize: 12, color: Colors.textMuted },
  templateMissing: { fontSize: 12, color: Colors.warning },
});
