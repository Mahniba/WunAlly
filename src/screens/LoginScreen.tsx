import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer, PrimaryButton, SecondaryButton } from '../components';
import { useAuthStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function LoginScreen({ navigation }: any) {
  const { s, sVertical, font } = useResponsive();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
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
    inputGroup: {
      marginBottom: sVertical(16),
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
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: s(8),
      paddingHorizontal: s(16),
      backgroundColor: colors.surface,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: sVertical(12),
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
    },
    togglePassword: {
      padding: s(8),
    },
    toggleText: {
      fontSize: font(typography.sizes.base),
      color: colors.lavenderDark,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: sVertical(24),
    },
    forgotText: {
      fontSize: font(typography.sizes.sm),
      color: colors.lavenderDark,
      fontWeight: typography.weights.semibold,
    },
    buttonContainer: {
      marginBottom: sVertical(16),
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(4),
    },
    signupText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
    },
    signupLink: {
      fontSize: font(typography.sizes.sm),
      color: colors.lavenderDark,
      fontWeight: typography.weights.semibold,
    },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Welcome Back
        </Text>
        <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          Sign in to your WunAlly account
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.togglePassword} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? (
          <View style={{ backgroundColor: colors.softPink, borderRadius: s(8), padding: s(12), marginBottom: sVertical(16) }}>
            <Text style={{ color: colors.error, fontSize: font(typography.sizes.sm) }}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Sign In" onPress={handleLogin} disabled={loading || !email || !password} />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
