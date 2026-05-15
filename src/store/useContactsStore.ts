import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { createContact, deleteContact, listContacts } from '../services/api/contacts';
import { apiContactToLocal, mergeContacts } from '../services/api/careMapper';
import { hasAccessToken } from '../services/api/session';
import { storage } from '../services/storage';

export interface EmergencyContact {
  id: string;
  serverId?: number;
  name: string;
  phone: string;
}

interface ContactsState {
  contacts: EmergencyContact[];
  hydrate: () => Promise<void>;
  syncFromApi: () => Promise<void>;
  add: (c: Omit<EmergencyContact, 'id' | 'serverId'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

async function loadLocal(): Promise<EmergencyContact[]> {
  try {
    const raw = await storage.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
    if (raw) return JSON.parse(raw) as EmergencyContact[];
  } catch {
    // ignore
  }
  return [];
}

async function saveLocal(contacts: EmergencyContact[]): Promise<void> {
  await storage.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],

  hydrate: async () => {
    if (await hasAccessToken()) {
      await get().syncFromApi();
      return;
    }
    set({ contacts: await loadLocal() });
  },

  syncFromApi: async () => {
    if (!(await hasAccessToken())) return;

    const local = await loadLocal();
    try {
      let remote = (await listContacts()).map(apiContactToLocal);
      const remoteIds = new Set(remote.map((c) => c.id));
      for (const item of local) {
        if (remoteIds.has(item.id)) continue;
        try {
          const api = await createContact({
            name: item.name,
            phone: item.phone,
            client_id: item.id,
          });
          remote.push(apiContactToLocal(api));
        } catch (e) {
          console.error('Failed to upload contact:', e);
        }
      }
      const merged = mergeContacts(local, remote);
      set({ contacts: merged });
      await saveLocal(merged);
    } catch (e) {
      console.error('Failed to sync contacts:', e);
      set({ contacts: local });
    }
  },

  add: async (c) => {
    const contact: EmergencyContact = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...c,
    };
    const next = [...get().contacts, contact];
    set({ contacts: next });
    await saveLocal(next);

    if (await hasAccessToken()) {
      try {
        const api = await createContact({
          name: contact.name,
          phone: contact.phone,
          client_id: contact.id,
        });
        const synced = apiContactToLocal(api);
        set({
          contacts: get().contacts.map((x) => (x.id === contact.id ? synced : x)),
        });
        await saveLocal(get().contacts);
      } catch (e) {
        console.error('Failed to sync new contact:', e);
      }
    }
  },

  remove: async (id) => {
    const current = get().contacts.find((c) => c.id === id);
    const next = get().contacts.filter((c) => c.id !== id);
    set({ contacts: next });
    await saveLocal(next);

    if (await hasAccessToken() && current?.serverId) {
      try {
        await deleteContact(current.serverId);
      } catch (e) {
        console.error('Failed to delete contact on server:', e);
      }
    }
  },

  clearAll: async () => {
    set({ contacts: [] });
    await storage.removeItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
  },
}));
