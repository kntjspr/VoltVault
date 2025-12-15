import type { VaultItem } from './data/mock';

// Use environment variable if available, otherwise default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
    login: async (email: string, password: string): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return await response.json();
    },

    getEntries: async (): Promise<VaultItem[]> => {
        const response = await fetch(`${API_BASE_URL}/entries`);
        if (!response.ok) {
            throw new Error('Failed to fetch entries');
        }
        const data = await response.json();
        // Map snake_case to camelCase
        return data.map((item: any) => ({
            id: item.id.toString(),
            type: item.type,
            name: item.name,
            username: item.username,
            password: item.password,
            url: item.url,
            notes: item.notes,
            folderId: item.folder_id,
            favorite: item.favorite,
            totpSecret: item.totp_secret,
            lastModified: item.created_at
        }));
    },

    createEntry: async (entry: Partial<VaultItem>): Promise<VaultItem> => {
        const payload = {
            type: entry.type,
            name: entry.name,
            username: entry.username,
            password: entry.password,
            url: entry.url,
            notes: entry.notes,
            folder_id: entry.folderId,
            favorite: entry.favorite,
            totp_secret: entry.totpSecret
        };

        const response = await fetch(`${API_BASE_URL}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to create entry');
        }

        const item = await response.json();
        return {
            id: item.id.toString(),
            type: item.type,
            name: item.name,
            username: item.username,
            password: item.password,
            url: item.url,
            notes: item.notes,
            folderId: item.folder_id,
            favorite: item.favorite,
            totpSecret: item.totp_secret,
            lastModified: item.created_at
        };
    }
};
