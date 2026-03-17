import { create } from 'zustand';
import { storage } from '../services/storage';

const CONTACTS_KEY = '@wunally/emergency_contacts';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

interface ContactsState {
  contacts: EmergencyContact[];
  hydrate: () => Promise<void>;
  add: (c: Omit<EmergencyContact, 'id'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  hydrate: async () => {
    try {
      const raw = await storage.getItem(CONTACTS_KEY);
      if (raw) set({ contacts: JSON.parse(raw) });
    } catch (e) {
      set({ contacts: [] });
    }
  },
  add: async (c) => {
    const id = Date.now().toString();
    const contact = { id, ...c } as EmergencyContact;
    const next = [...get().contacts, contact];
    set({ contacts: next });
    await storage.setItem(CONTACTS_KEY, JSON.stringify(next));
  },
  remove: async (id) => {
    const next = get().contacts.filter((c) => c.id !== id);
    set({ contacts: next });
    await storage.setItem(CONTACTS_KEY, JSON.stringify(next));
  },
}));
