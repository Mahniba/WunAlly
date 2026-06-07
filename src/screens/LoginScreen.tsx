import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ScreenContainer,
  PrimaryButton,
  SecondaryButton,
  InputField,
  AppIcon,
  KeyboardAwareScrollView,
} from '../components';
import { useAuthStore, useProfileStore } from '../store';
import { getErrorMessage } from '../services/api/errors';
import { resetAfterAuth } from '../navigation/authNavigation';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, spacing } from '../theme';

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
      const currentProfile = useProfileStore.getState().profile;
      resetAfterAuth(navigation, Boolean(currentProfile?.name?.trim()));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    }
  };

  const styles = StyleSheet.create({
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: s(24),
      paddingVertical: sVertical(24),
    },
    brandMark: {
      alignSelf: 'center',
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sVertical(24),
    },
    title: {
      fontSize: font(typography.sizes.title),
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      marginBottom: sVertical(8),
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: font(typography.sizes.base),
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: sVertical(32),
      lineHeight: 22,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: sVertical(24),
      marginTop: -spacing.xs,
    },
    forgotText: {
      fontSize: font(typography.sizes.sm),
      color: colors.coralDark,
      fontWeight: typography.weights.medium,
    },
    errorBox: {
      backgroundColor: '#FDF0F0',
      borderRadius: 12,
      padding: s(12),
      marginBottom: sVertical(16),
      borderWidth: 1,
      borderColor: '#F5D5D5',
    },
    errorText: {
      color: colors.error,
      fontSize: font(typography.sizes.sm),
      lineHeight: 20,
    },
    buttonContainer: {
      marginBottom: sVertical(16),
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(4),
      marginTop: sVertical(8),
    },
    signupText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
    },
    signupLink: {
      fontSize: font(typography.sizes.sm),
      color: colors.coralDark,
      fontWeight: typography.weights.semibold,
    },
  });

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandMark}>
          <AppIcon name="heart" size={28} color={colors.coralDark} />
        </View>

        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Welcome back
        </Text>
        <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          Sign in to continue your pregnancy journey
        </Text>

        <InputField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppIcon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Sign in"
            onPress={handleLogin}
            disabled={loading || !email || !password}
            loading={loading}
          />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
}
