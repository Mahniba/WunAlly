import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { PrimaryButton, SecondaryButton } from './index';
import { colors } from '../theme';

export function DoctorAlert({ visible, onClose, message }: { visible: boolean; onClose: () => void; message: string }) {
  const handleCall = () => {
    Linking.openURL('tel:');
  };

  const handleMessage = () => {
    Linking.openURL('sms:');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Health suggestion</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actionsColumn}>
            <SecondaryButton title="Dismiss" onPress={onClose} style={{ width: '100%' }} />
            <PrimaryButton title="Call" onPress={handleCall} style={{ width: '100%', marginTop: 10 }} />
            <PrimaryButton title="Message" onPress={handleMessage} style={{ width: '100%', marginTop: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 20 },
  box: { backgroundColor: colors.surface, borderRadius: 12, padding: 18 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  message: { color: colors.textSecondary, marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionsColumn: { flexDirection: 'column', gap: 8 },
});
