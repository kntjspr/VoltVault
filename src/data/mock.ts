export interface VaultItem {
    id: string;
    type: 'login' | 'card' | 'note';
    name: string;
    username?: string;
    password?: string; // Encrypted in real app
    url?: string;
    notes?: string;
    folderId?: string;
    favorite: boolean;
    totpSecret?: string;
    lastModified: string;
}

export interface Folder {
    id: string;
    name: string;
}

export const MOCK_FOLDERS: Folder[] = [
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' },
    { id: '3', name: 'Finance' },
];

export const MOCK_ITEMS: VaultItem[] = [
    {
        id: '1',
        type: 'login',
        name: 'Google',
        username: 'user@gmail.com',
        password: 'password123',
        url: 'https://google.com',
        folderId: '2',
        favorite: true,
        totpSecret: 'JBSWY3DPEHPK3PXP', // Example base32
        lastModified: '2023-12-15T10:00:00Z',
    },
    {
        id: '2',
        type: 'login',
        name: 'GitHub',
        username: 'dev-user',
        password: 'secure-password-456',
        url: 'https://github.com',
        folderId: '1',
        favorite: true,
        lastModified: '2023-12-14T15:30:00Z',
    },
    {
        id: '3',
        type: 'card',
        name: 'Visa ending 4242',
        notes: 'Exp: 12/25, CVV: 123',
        folderId: '3',
        favorite: false,
        lastModified: '2023-11-20T09:15:00Z',
    },
    {
        id: '4',
        type: 'note',
        name: 'WiFi Password',
        notes: 'Home: SuperSecretWiFi\nOffice: GuestNetwork123',
        folderId: '2',
        favorite: false,
        lastModified: '2023-10-05T14:20:00Z',
    },
];
