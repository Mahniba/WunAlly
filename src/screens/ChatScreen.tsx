import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer, ChatBubble, ScreenHeader } from '../components';
import { getReplyForMessage } from '../utils';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

const initialMessages = [
  { id: '1', text: 'What should I eat this week?', isUser: true },
  { id: '2', text: 'Focus on iron-rich foods like spinach, beans, and lean meat. Small, frequent meals can help. Stay hydrated.', isUser: false },
];

const VOICE_PROMPTS = [
  "I'd like some support.",
  'Can you give me a quick tip?',
  "How am I doing this week?",
];

export function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { s, font, horizontalPadding } = useResponsive();

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const send = (text?: string) => {
    const toSend = (text ?? input).trim();
    if (!toSend) return;
    const userMsg = { id: Date.now().toString(), text: toSend, isUser: true };
    const replyText = getReplyForMessage(toSend);
    const reply = { id: (Date.now() + 1).toString(), text: replyText, isUser: false };
    setMessages((m) => [...m, userMsg, reply]);
    if (!text) setInput('');
  };

  const handleVoice = () => {
    if (isVoiceListening) return;
    setIsVoiceListening(true);
    const prompt = VOICE_PROMPTS[Math.floor(Math.random() * VOICE_PROMPTS.length)];
    setTimeout(() => {
      const userMsg = { id: Date.now().toString(), text: prompt, isUser: true };
      const replyText = getReplyForMessage(prompt);
      const reply = { id: (Date.now() + 1).toString(), text: replyText, isUser: false };
      setMessages((m) => [...m, userMsg, reply]);
      setIsVoiceListening(false);
    }, 1500);
  };

  const styles = StyleSheet.create({
    list: { flex: 1 },
    listContent: { padding: horizontalPadding, paddingBottom: s(24), flexGrow: 1 },
    voiceBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: s(10),
      paddingHorizontal: s(16),
      backgroundColor: colors.softPurple,
      marginHorizontal: horizontalPadding,
      marginBottom: s(8),
      borderRadius: 12,
    },
    voiceBannerText: { fontSize: font(typography.sizes.sm), color: colors.textSecondary },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: s(12),
      paddingHorizontal: horizontalPadding,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.softPink,
      gap: s(10),
    },
    inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', position: 'relative' },
    input: {
      flex: 1,
      fontSize: font(typography.sizes.base),
      color: colors.textPrimary,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 24,
      paddingVertical: s(12),
      paddingLeft: s(18),
      paddingRight: s(48),
      minHeight: 48,
    },
    inputMic: {
      position: 'absolute',
      right: s(14),
      padding: s(4),
    },
    inputMicText: { fontSize: 22 },
    voiceFab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.lavender,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.lavenderDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    voiceFabActive: { backgroundColor: colors.coral },
    voiceFabIcon: { fontSize: 26 },
    talkLabel: {
      fontSize: 10,
      fontWeight: typography.weights.semibold,
      color: colors.textPrimary,
      marginTop: 2,
    },
  });

  return (
    <ScreenContainer>
      <ScreenHeader title="Chat & Support" />
      <ScrollView
        ref={scrollRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m.text} isUser={m.isUser} />
        ))}
      </ScrollView>
      {isVoiceListening && (
        <View style={styles.voiceBanner}>
          <Text style={styles.voiceBannerText}>🎤 Listening... Talk to AI</Text>
        </View>
      )}
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Chat with Nurse..."
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={() => send()}
            returnKeyType="send"
            editable={!isVoiceListening}
          />
          <TouchableOpacity
            style={styles.inputMic}
            onPress={handleVoice}
            accessibilityLabel="Talk to AI"
          >
            <Text style={styles.inputMicText}>🎤</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.voiceFab, isVoiceListening && styles.voiceFabActive]}
          onPress={handleVoice}
          activeOpacity={0.9}
          disabled={isVoiceListening}
          accessible
          accessibilityLabel="Talk to AI"
        >
          <Text style={styles.voiceFabIcon}>{isVoiceListening ? '...' : '🎤'}</Text>
          <Text style={styles.talkLabel}>Talk</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
