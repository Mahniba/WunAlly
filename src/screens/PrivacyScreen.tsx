import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  Share,
  Modal,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScreenContainer, ScreenHeader, SecondaryButton } from '../components';
import { exportMyData, deleteMyAccount } from '../services/api/research';
import { getErrorMessage } from '../services/api/errors';
import { useAuthStore } from '../store';
import { resetToLogin } from '../navigation/authNavigation';
import { useNavigation } from '@react-navigation/native';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function PrivacyScreen() {
  const navigation = useNavigation();
  const logout = useAuthStore((s) => s.logout);
  const { s, font, horizontalPadding } = useResponsive();
  const [busy, setBusy] = useState<'export' | 'delete' | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: { padding: horizontalPadding, paddingBottom: s(48), flexGrow: 1 },
    body: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      lineHeight: font(24),
      marginBottom: s(24),
    },
    sectionTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: s(8),
    },
    btn: { marginTop: s(12) },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      padding: horizontalPadding,
    },
    modalBox: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: s(20),
    },
    modalTitle: {
      fontSize: font(typography.sizes.lg),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: s(8),
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: s(12),
      marginVertical: s(12),
      color: colors.textPrimary,
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: s(12) },
  });

  const handleExport = async () => {
    try {
      setBusy('export');
      const data = await exportMyData();
      await Share.share({
        message: JSON.stringify(data, null, 2),
        title: 'Wunally data export',
      });
    } catch (err: unknown) {
      Alert.alert('Export failed', getErrorMessage(err, 'Could not export your data.'));
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Password required', 'Enter your password to delete your account.');
      return;
    }
    try {
      setBusy('delete');
      await deleteMyAccount(deletePassword.trim());
      setShowDeleteModal(false);
      setDeletePassword('');
      await logout();
      resetToLogin(navigation as never);
      Alert.alert('Account deleted', 'Your account and data have been removed.');
    } catch (err: unknown) {
      Alert.alert('Could not delete', getErrorMessage(err, 'Please check your password and try again.'));
    } finally {
      setBusy(null);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Privacy & Data" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.body} allowFontScaling maxFontSizeMultiplier={1.3}>
          Your health data syncs to the research server when you are logged in. This app does not provide
          medical diagnosis—always consult your care provider.
        </Text>

        <Text style={styles.sectionTitle}>Where is Chat?</Text>
        <Text style={styles.body}>
          • Home tab → tap the “Chat with AI” card{'\n'}
          • Home → tap the 🤖 button (bottom right){'\n'}
          • Network tab → Get Support → Chat with AI
        </Text>

        <Text style={styles.sectionTitle}>Your data</Text>
        <SecondaryButton
          title={busy === 'export' ? 'Exporting…' : 'Export my data (JSON)'}
          onPress={handleExport}
          style={styles.btn}
          disabled={!!busy}
        />
        <SecondaryButton
          title="Delete my account"
          onPress={() => setShowDeleteModal(true)}
          style={styles.btn}
          disabled={!!busy}
        />
      </ScrollView>

      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Delete account</Text>
            <Text style={styles.body}>
              This permanently deletes your account and all server data. Enter your password to confirm.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => { setShowDeleteModal(false); setDeletePassword(''); }}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} disabled={busy === 'delete'}>
                <Text style={{ color: colors.sos, fontWeight: '700' }}>
                  {busy === 'delete' ? 'Deleting…' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
