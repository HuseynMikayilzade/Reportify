// Login Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import { Colors, Spacing, BorderRadius } from '../../../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const { login, isLoading } = useAuthStore();
  const insets = useSafeAreaInsets();

  const validate = () => {
    let valid = true;
    if (!email.trim()) { setEmailError('Email is required'); valid = false; } else setEmailError('');
    if (!password.trim()) { setPasswordError('Password is required'); valid = false; } else setPasswordError('');
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email.trim(), password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setToastMsg(msg);
      setShowToast(true);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoMark}>
              <Text style={styles.logoIcon}>✓</Text>
            </View>
            <Text style={styles.appName}>Reportify</Text>
            <Text style={styles.tagline}>Daily reporting for your team</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError}
              containerStyle={styles.inputSpacing}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={passwordError}
              containerStyle={styles.inputSpacing}
            />
            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              label="Sign in"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.cta}
            />
          </View>

          {/* Demo hint */}
          <View style={styles.demoBlock}>
            <Text style={styles.demoLabel}>DEMO CREDENTIALS</Text>
            {[
              { role: 'Employee', email: 'employee@reportify.app', pw: 'Employee@123' },
              { role: 'Admin', email: 'admin@reportify.app', pw: 'Admin@123' },
              { role: 'Super Admin', email: 'superadmin@reportify.app', pw: 'Super@123' },
            ].map((d) => (
              <TouchableOpacity
                key={d.role}
                style={styles.demoRow}
                onPress={() => { setEmail(d.email); setPassword(d.pw); }}
              >
                <Text style={styles.demoRole}>{d.role}</Text>
                <Text style={styles.demoEmail}>{d.email}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footer}>🔒 Secured locally on your device</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        visible={showToast}
        type="error"
        title="Login failed"
        subtitle={toastMsg}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  kav: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenH,
    paddingBottom: 32,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: Spacing.s10,
    marginBottom: Spacing.s8,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
  },
  appName: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  form: { gap: 0 },
  inputSpacing: { marginBottom: Spacing.s4 },
  forgotRow: { alignItems: 'flex-end', marginBottom: Spacing.s5 },
  forgotText: { fontSize: 11, color: Colors.primary },
  cta: { marginTop: Spacing.s2 },
  demoBlock: {
    marginTop: Spacing.s8,
    padding: 14,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: Spacing.s2,
  },
  demoLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    fontWeight: '500',
    marginBottom: 4,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderSubtle,
  },
  demoRole: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  demoEmail: { fontSize: 11, color: Colors.textMuted },
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: Spacing.s6,
  },
});
