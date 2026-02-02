import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';

// in-memory store (note: resets on each cold start in serverless)
interface VaultItem {
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

interface Folder {
    id: string;
    name: string;
}

interface User {
    id: string;
    email: string;
    passwordHash: string;
}

interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
}

// simple in-memory storage
const users: User[] = [
    { id: 'demo-user-001', email: 'demo@eveready.com', passwordHash: 'demo123' }
];

const sessions: Session[] = [];

const folders = new Map<string, Folder[]>([
    ['demo-user-001', [
        { id: '1', name: 'Work' },
        { id: '2', name: 'Personal' },
        { id: '3', name: 'Finance' },
    ]]
]);

const vaultItems = new Map<string, VaultItem[]>([
    ['demo-user-001', [
        { id: '1', type: 'login', name: 'Google', username: 'user@gmail.com', password: 'password123', url: 'https://google.com', folderId: '2', favorite: true, totpSecret: 'JBSWY3DPEHPK3PXP', lastModified: '2023-12-15T10:00:00Z' },
        { id: '2', type: 'login', name: 'GitHub', username: 'dev-user', password: 'secure-password-456', url: 'https://github.com', folderId: '1', favorite: true, lastModified: '2023-12-14T15:30:00Z' },
        { id: '3', type: 'card', name: 'Visa ending 4242', notes: 'Exp: 12/25, CVV: 123', folderId: '3', favorite: false, lastModified: '2023-11-20T09:15:00Z' },
        { id: '4', type: 'note', name: 'WiFi Password', notes: 'Home: SuperSecretWiFi\nOffice: GuestNetwork123', folderId: '2', favorite: false, lastModified: '2023-10-05T14:20:00Z' },
    ]]
]);

// helpers
function getSessionByToken(token: string): Session | undefined {
    return sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
}

function getUserIdFromAuth(authHeader: string | undefined): string | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const session = getSessionByToken(token);
    return session?.userId || null;
}

// create hono app
const app = new Hono().basePath('/api');

app.use('*', cors({ origin: '*', credentials: true }));

// health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// auth routes
app.post('/v1/auth/login', async (c) => {
    const body = await c.req.json();
    const { email, master_password_hash } = body;

    const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || (user.passwordHash !== master_password_hash && user.passwordHash !== 'demo123')) {
        return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, 401);
    }

    const token = crypto.randomUUID();
    sessions.push({
        id: crypto.randomUUID(),
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    return c.json({
        success: true,
        data: {
            access_token: token,
            refresh_token: token,
            expires_in: 604800,
            token_type: 'Bearer',
            user: { id: user.id, email: user.email, two_factor_enabled: false, email_verified: true },
            keys: { encrypted_symmetric_key: '2.nQxVo8hJIz...', encrypted_private_key: '2.7yXGkZ9Pp...', kdf_iterations: 100000 }
        }
    });
});

app.post('/v1/auth/logout', (c) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const idx = sessions.findIndex(s => s.token === token);
        if (idx !== -1) sessions.splice(idx, 1);
    }
    return c.json({ success: true, message: 'Logged out successfully' });
});

// vault routes
app.get('/v1/vault/sync', (c) => {
    const userId = getUserIdFromAuth(c.req.header('Authorization'));
    if (!userId) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);

    const items = vaultItems.get(userId) || [];
    const userFolders = folders.get(userId) || [];

    return c.json({
        success: true,
        data: {
            revision_date: new Date().toISOString(),
            folders: userFolders.map(f => ({ id: f.id, encrypted_name: f.name, revision_date: new Date().toISOString() })),
            items: items.map(item => ({
                id: item.id,
                folder_id: item.folderId,
                item_type: item.type === 'login' ? 1 : item.type === 'card' ? 3 : 2,
                encrypted_data: JSON.stringify(item),
                favorite: item.favorite,
                has_totp: !!item.totpSecret,
                revision_date: item.lastModified,
                created_at: item.lastModified
            })),
            deleted_items: []
        }
    });
});

app.post('/v1/vault/items', async (c) => {
    const userId = getUserIdFromAuth(c.req.header('Authorization'));
    if (!userId) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);

    const body = await c.req.json();
    const items = vaultItems.get(userId) || [];
    const newItem: VaultItem = {
        id: crypto.randomUUID(),
        type: body.item_type === 1 ? 'login' : body.item_type === 3 ? 'card' : 'note',
        name: body.name || 'Untitled',
        username: body.username,
        password: body.password,
        url: body.url,
        notes: body.notes,
        folderId: body.folder_id,
        favorite: body.favorite || false,
        totpSecret: body.totp?.encrypted_secret,
        lastModified: new Date().toISOString()
    };
    items.push(newItem);
    vaultItems.set(userId, items);

    return c.json({ success: true, data: { id: newItem.id, revision_date: newItem.lastModified } }, 201);
});

app.delete('/v1/vault/items/:id', (c) => {
    const userId = getUserIdFromAuth(c.req.header('Authorization'));
    if (!userId) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, 401);

    const itemId = c.req.param('id');
    const items = vaultItems.get(userId) || [];
    const idx = items.findIndex(i => i.id === itemId);
    if (idx === -1) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } }, 404);

    items.splice(idx, 1);
    return c.json({ success: true, message: 'Item deleted' });
});

// password generator
app.post('/v1/tools/password/generate', async (c) => {
    const body = await c.req.json();
    const length = body.length || 16;
    const uppercase = body.uppercase !== false;
    const lowercase = body.lowercase !== false;
    const numbers = body.numbers !== false;
    const symbols = body.symbols !== false;

    let charset = '';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    const entropyBits = Math.floor(length * Math.log2(charset.length));
    return c.json({
        success: true,
        data: { password, strength: entropyBits >= 128 ? 'very_strong' : entropyBits >= 80 ? 'strong' : 'medium', entropy_bits: entropyBits }
    });
});

// 404 handler
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }, 404));

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
