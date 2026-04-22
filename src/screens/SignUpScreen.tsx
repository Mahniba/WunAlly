import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer, PrimaryButton } from '../components';
import { useAuthStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function SignUpScreen({ navigation }: any) {
  const { s, sVertical, font } = useResponsive();
  const { signUp, loading } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      setError('');
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await signUp(email, password, fullName);
      // Navigate to ProfileCreate now that screen is registered
      navigation.navigate('ProfileCreate');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    content: {
      paddingHorizontal: s(24),
      paddingVertical: sVertical(24),
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
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: sVertical(24),
      gap: s(8),
    },
    checkbox: {
      width: s(20),
      height: s(20),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: s(4),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: acceptTerms ? colors.lavenderDark : colors.surface,
      marginTop: sVertical(4),
    },
    checkmark: {
      color: colors.surface,
      fontSize: font(16),
      fontWeight: 'bold',
    },
    termsText: {
      flex: 1,
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
    },
    termsLink: {
      color: colors.lavenderDark,
      fontWeight: typography.weights.semibold,
    },
    buttonContainer: {
      marginBottom: sVertical(16),
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(4),
    },
    loginText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
    },
    loginLink: {
      fontSize: font(typography.sizes.sm),
      color: colors.lavenderDark,
      fontWeight: typography.weights.semibold,
    },
  });

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Create Account
        </Text>
        <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          Join WunAlly to start your pregnancy journey
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jane Doe"
            placeholderTextColor={colors.textSecondary}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
          activeOpacity={0.7}
        >
          <View style={styles.checkbox}>{acceptTerms && <Text style={styles.checkmark}>✓</Text>}</View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>

        {error ? (
          <View style={{ backgroundColor: colors.softPink, borderRadius: s(8), padding: s(12), marginBottom: sVertical(16) }}>
            <Text style={{ color: colors.error, fontSize: font(typography.sizes.sm) }}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Create Account" onPress={handleSignUp} disabled={!acceptTerms || loading || !fullName || !email || !password} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
