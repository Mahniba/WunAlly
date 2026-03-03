import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer, PrimaryButton } from '../components';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function VerificationScreen({ navigation, route }: any) {
  const { s, sVertical, font } = useResponsive();
  const email = route?.params?.email || 'user@example.com';
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    // TODO: Implement verification logic
    console.log('Verifying code:', code);
  };

  const handleResend = () => {
    setTimeLeft(600);
    setResendDisabled(true);
    console.log('Resending verification code');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: s(24),
    },
    iconBox: {
      width: s(80),
      height: s(80),
      borderRadius: s(40),
      backgroundColor: colors.softPurple,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: sVertical(24),
    },
    icon: {
      fontSize: font(40),
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
      marginBottom: sVertical(12),
    },
    email: {
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
    },
    codeContainer: {
      marginVertical: sVertical(32),
    },
    codeLabel: {
      fontSize: font(typography.sizes.sm),
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginBottom: s(8),
    },
    codeInput: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: s(8),
      paddingHorizontal: s(16),
      paddingVertical: sVertical(16),
      fontSize: font(typography.sizes.lg),
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      letterSpacing: s(8),
      textAlign: 'center',
      fontWeight: 'bold',
    },
    timer: {
      textAlign: 'center',
      marginTop: sVertical(12),
      fontSize: font(typography.sizes.sm),
      color: timeLeft > 60 ? colors.textSecondary : colors.error,
      fontWeight: typography.weights.semibold,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: s(4),
      marginBottom: sVertical(24),
    },
    resendText: {
      fontSize: font(typography.sizes.sm),
      color: colors.textSecondary,
    },
    resendLink: {
      fontSize: font(typography.sizes.sm),
      color: resendDisabled ? colors.border : colors.lavenderDark,
      fontWeight: typography.weights.semibold,
    },
    buttonContainer: {
      marginBottom: sVertical(16),
    },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📧</Text>
        </View>

        <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
          Verify Your Email
        </Text>
        <Text style={styles.subtitle} allowFontScaling maxFontSizeMultiplier={1.3}>
          We sent a code to{' '}
          <Text style={styles.email} allowFontScaling maxFontSizeMultiplier={1.3}>
            {email}
          </Text>
        </Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Verification Code</Text>
          <TextInput
            style={styles.codeInput}
            placeholder="000000"
            placeholderTextColor={colors.border}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Text style={styles.timer}>
            {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : 'Code expired'}
          </Text>
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a code?</Text>
          <TouchableOpacity onPress={handleResend} disabled={resendDisabled} activeOpacity={0.7}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Verify" onPress={handleVerify} disabled={code.length !== 6} />
        </View>
      </View>
    </ScreenContainer>
  );
}
