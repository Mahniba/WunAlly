import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  type ModalProps,
} from 'react-native';

interface KeyboardModalProps extends ModalProps {
  children: React.ReactNode;
  justify?: 'center' | 'flex-end';
}

export function KeyboardModal({
  children,
  justify = 'center',
  ...modalProps
}: KeyboardModalProps) {
  return (
    <Modal {...modalProps}>
      <KeyboardAvoidingView
        style={[styles.wrap, { justifyContent: justify }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {children}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
});
