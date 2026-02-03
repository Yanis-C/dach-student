import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

// Storage interface matching Zustand's StateStorage
let storage: StateStorage;
let usingMMKV = false;

// Try MMKV first, fall back to AsyncStorage on error
try {
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({
        id: 'app-storage',
        encryptionKey: 'demo-setup',
    });

    storage = {
        setItem: (name: string, value: string) => {
            mmkv.set(name, value);
        },
        getItem: (name: string) => {
            const value = mmkv.getString(name);
            return value ?? null;
        },
        removeItem: (name: string) => {
            mmkv.delete(name);
        },
    };
    usingMMKV = true;
    console.log('[Storage] Using MMKV');
} catch {
    // MMKV not available (e.g., Expo Go), use AsyncStorage
    console.log('[Storage] MMKV unavailable, using AsyncStorage');
    storage = {
        setItem: async (name: string, value: string) => {
            await AsyncStorage.setItem(name, value);
        },
        getItem: async (name: string) => {
            return await AsyncStorage.getItem(name);
        },
        removeItem: async (name: string) => {
            await AsyncStorage.removeItem(name);
        },
    };
}

export const AppStorage = storage;

// Export a flag for components that need to know which storage is in use
export const isUsingMMKV = usingMMKV;
