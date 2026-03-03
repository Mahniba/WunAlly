import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer, PrimaryButton, SecondaryButton } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function ForgotPasswordScreen({ navigation }: any) {
  const { s, sVertical, font } = useResponsive();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: s(24),
    },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: sVertical(12),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: sVertical(32),
    },
    successBox: {
      backgroundColor: colors.softPink,
      borderRadius: s(8),
      padding: s(16),
      marginBottom: sVertical(24),
    },
    successIcon: {
      fontSize: font(32),
      textAlign: 'center',
      marginBottom: sVertical(12),
    },
    successTitle: {
      fontSize: font(typography.sizes.base),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: sVertical(8),
    },
    successText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: sVertical(24),
    },
    label: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: s(8),
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: s(8),
      paddingHorizontal: s(16),
      paddingVertical: sVertical(12),
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    helper: {
      fontSize: font(typography.sizes.xs),
      color: colors.textSecondary,
      marginTop: s(8),
    },
    buttonContainer: {
      marginBottom: sVertical(16),
    },
    secondaryButton: {
      marginBottom: sVertical(12),
    },
  });

  if (submitted) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent password reset instructions to {email}
            </Text>
          </View>

          <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
            Didn't receive the email? Check your spam folder or try again.
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton title="Back to Sign In" onPress={handleBackToLogin} />
          </View>

          <TouchableOpacity onPress={() => setSubmitted(false)}>
            <Text style={{ textAlign: 'center', color: colors.lavenderDark, fontWeight: 'bold' }}>
              Try Another Email
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Reset Password
        </Text>
        <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          Enter your email and we'll send you a link to reset your password
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable
          />
          <Text style={styles.helper}>We'll send you a password reset link</Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Send Reset Link" onPress={handleSubmit} disabled={!email} />
        </View>

        <View style={styles.secondaryButton}>
          <SecondaryButton title="Back to Sign In" onPress={handleBackToLogin} />
        </View>
      </View>
    </ScreenContainer>
  );
}
