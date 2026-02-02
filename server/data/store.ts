export interface VaultItem {
    id: string;
    type: 'login' | 'card' | 'note';
    name: string;
    username?: string;
    password?: string;
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

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    twoFactorEnabled: boolean;
    emailVerified: boolean;
    createdAt: string;
}

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
}

export interface UserKeys {
    userId: string;
    encryptedSymmetricKey: string;
    encryptedPrivateKey: string;
    publicKey: string;
    kdfIterations: number;
}

class Store {
    users: User[] = [];
    sessions: Session[] = [];
    userKeys: UserKeys[] = [];
    vaultItems: Map<string, VaultItem[]> = new Map();
    folders: Map<string, Folder[]> = new Map();

    constructor() {
        this.seed();
    }

    private seed() {
        const demoUserId = 'demo-user-001';
        this.users.push({
            id: demoUserId,
            email: 'demo@eveready.com',
            passwordHash: 'demo123',
            twoFactorEnabled: false,
            emailVerified: true,
            createdAt: new Date().toISOString()
        });

        this.userKeys.push({
            userId: demoUserId,
            encryptedSymmetricKey: '2.nQxVo8hJIz...',
            encryptedPrivateKey: '2.7yXGkZ9Pp...',
            publicKey: 'MIIBIjANBgkqhk...',
            kdfIterations: 100000
        });

        this.folders.set(demoUserId, [
            { id: '1', name: 'Work' },
            { id: '2', name: 'Personal' },
            { id: '3', name: 'Finance' },
        ]);

        this.vaultItems.set(demoUserId, [
            {
                id: '1',
                type: 'login',
                name: 'Google',
                username: 'user@gmail.com',
                password: 'password123',
                url: 'https://google.com',
                folderId: '2',
                favorite: true,
                totpSecret: 'JBSWY3DPEHPK3PXP',
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
        ]);
    }

    getUserByEmail(email: string): User | undefined {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    getUserById(id: string): User | undefined {
        return this.users.find(u => u.id === id);
    }

    createSession(userId: string): Session {
        const session: Session = {
            id: crypto.randomUUID(),
            userId,
            token: crypto.randomUUID(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
        };
        this.sessions.push(session);
        return session;
    }

    getSessionByToken(token: string): Session | undefined {
        return this.sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
    }

    deleteSession(token: string): boolean {
        const idx = this.sessions.findIndex(s => s.token === token);
        if (idx !== -1) {
            this.sessions.splice(idx, 1);
            return true;
        }
        return false;
    }

    getUserKeys(userId: string): UserKeys | undefined {
        return this.userKeys.find(k => k.userId === userId);
    }

    getVaultItems(userId: string): VaultItem[] {
        return this.vaultItems.get(userId) || [];
    }

    getFolders(userId: string): Folder[] {
        return this.folders.get(userId) || [];
    }

    addVaultItem(userId: string, item: VaultItem): VaultItem {
        const items = this.vaultItems.get(userId) || [];
        item.id = crypto.randomUUID();
        item.lastModified = new Date().toISOString();
        items.push(item);
        this.vaultItems.set(userId, items);
        return item;
    }

    updateVaultItem(userId: string, itemId: string, updates: Partial<VaultItem>): VaultItem | null {
        const items = this.vaultItems.get(userId) || [];
        const idx = items.findIndex(i => i.id === itemId);
        if (idx === -1) return null;
        items[idx] = { ...items[idx], ...updates, lastModified: new Date().toISOString() };
        return items[idx];
    }

    deleteVaultItem(userId: string, itemId: string): boolean {
        const items = this.vaultItems.get(userId) || [];
        const idx = items.findIndex(i => i.id === itemId);
        if (idx === -1) return false;
        items.splice(idx, 1);
        return true;
    }

    addFolder(userId: string, folder: Folder): Folder {
        const folders = this.folders.get(userId) || [];
        folder.id = crypto.randomUUID();
        folders.push(folder);
        this.folders.set(userId, folders);
        return folder;
    }

    updateFolder(userId: string, folderId: string, name: string): Folder | null {
        const folders = this.folders.get(userId) || [];
        const idx = folders.findIndex(f => f.id === folderId);
        if (idx === -1) return null;
        folders[idx].name = name;
        return folders[idx];
    }

    deleteFolder(userId: string, folderId: string): boolean {
        const folders = this.folders.get(userId) || [];
        const idx = folders.findIndex(f => f.id === folderId);
        if (idx === -1) return false;
        folders.splice(idx, 1);
        const items = this.vaultItems.get(userId) || [];
        items.forEach(item => {
            if (item.folderId === folderId) {
                item.folderId = undefined;
            }
        });
        return true;
    }
}

export const store = new Store();
