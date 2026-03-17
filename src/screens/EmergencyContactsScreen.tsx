import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { ScreenContainer, Card, PrimaryButton } from '../components';
import { useContactsStore } from '../store/useContactsStore';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../theme';

export function EmergencyContactsScreen({ navigation }: any) {
  const { s, sVertical, font, horizontalPadding } = useResponsive();
  const contacts = useContactsStore((s2) => s2.contacts);
  const hydrate = useContactsStore((s2) => s2.hydrate);
  const add = useContactsStore((s2) => s2.add);
  const remove = useContactsStore((s2) => s2.remove);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Please enter a name and phone');
      return;
    }
    await add({ name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
  };

  const handleRemove = (id: string) => {
    Alert.alert('Remove contact', 'Remove this contact?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  const styles = StyleSheet.create({
    content: { padding: horizontalPadding, paddingBottom: s(48) },
    title: { fontSize: font(typography.sizes.xxl), fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: s(12) },
    row: { flexDirection: 'row', gap: s(8), marginBottom: sVertical(12) },
    input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: sVertical(10), backgroundColor: colors.surface },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: colors.backgroundSecondary },
    listText: { fontSize: font(typography.sizes.base), color: colors.textPrimary },
    emptyText: { color: colors.textSecondary },
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Card>
          <View style={styles.row}>
            <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
          </View>
          <PrimaryButton title="Add Contact" onPress={handleAdd} />
        </Card>

        <Text style={{ marginTop: 16, marginBottom: 8, color: colors.textSecondary }}>Saved contacts</Text>
        {contacts.length === 0 ? (
          <Text style={styles.emptyText}>No emergency contacts yet.</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => handleRemove(item.id)}>
                <Text style={styles.listText}>{item.name} — {item.phone}</Text>
                <Text style={{ color: colors.error }}>Remove</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <PrimaryButton title="Done" onPress={() => navigation.navigate('Main')} style={{ marginTop: 20 }} />
      </View>
    </ScreenContainer>
  );
}
