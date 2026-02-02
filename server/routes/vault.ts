import { Hono } from 'hono';
import { store } from '../data/store';
import type { VaultItem } from '../data/store';

type Variables = { userId: string };

const vault = new Hono<{ Variables: Variables }>();

vault.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
        }, 401);
    }

    const token = authHeader.slice(7);
    const session = store.getSessionByToken(token);
    if (!session) {
        return c.json({
            success: false,
            error: { code: 'TOKEN_EXPIRED', message: 'Invalid or expired token' }
        }, 401);
    }

    c.set('userId', session.userId);
    await next();
});

vault.get('/sync', (c) => {
    const userId = c.get('userId');
    const items = store.getVaultItems(userId);
    const folders = store.getFolders(userId);

    return c.json({
        success: true,
        data: {
            revision_date: new Date().toISOString(),
            folders: folders.map(f => ({
                id: f.id,
                encrypted_name: f.name,
                revision_date: new Date().toISOString()
            })),
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

vault.post('/items', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json();

    const item = store.addVaultItem(userId, {
        id: '',
        type: body.item_type === 1 ? 'login' : body.item_type === 3 ? 'card' : 'note',
        name: body.name || 'Untitled',
        username: body.username,
        password: body.password,
        url: body.url,
        notes: body.notes,
        folderId: body.folder_id,
        favorite: body.favorite || false,
        totpSecret: body.totp?.encrypted_secret,
        lastModified: ''
    });

    return c.json({
        success: true,
        data: {
            id: item.id,
            folder_id: item.folderId,
            item_type: item.type === 'login' ? 1 : item.type === 'card' ? 3 : 2,
            encrypted_data: JSON.stringify(item),
            favorite: item.favorite,
            has_totp: !!item.totpSecret,
            revision_date: item.lastModified,
            created_at: item.lastModified
        }
    }, 201);
});

vault.put('/items/:id', async (c) => {
    const userId = c.get('userId');
    const itemId = c.req.param('id');
    const body = await c.req.json();

    const updates: Partial<VaultItem> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.username !== undefined) updates.username = body.username;
    if (body.password !== undefined) updates.password = body.password;
    if (body.url !== undefined) updates.url = body.url;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.folder_id !== undefined) updates.folderId = body.folder_id;
    if (body.favorite !== undefined) updates.favorite = body.favorite;

    const item = store.updateVaultItem(userId, itemId, updates);

    if (!item) {
        return c.json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Item not found' }
        }, 404);
    }

    return c.json({
        success: true,
        data: {
            id: item.id,
            folder_id: item.folderId,
            item_type: item.type === 'login' ? 1 : item.type === 'card' ? 3 : 2,
            encrypted_data: JSON.stringify(item),
            favorite: item.favorite,
            has_totp: !!item.totpSecret,
            revision_date: item.lastModified
        }
    });
});

vault.delete('/items/:id', (c) => {
    const userId = c.get('userId');
    const itemId = c.req.param('id');

    const deleted = store.deleteVaultItem(userId, itemId);
    if (!deleted) {
        return c.json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Item not found' }
        }, 404);
    }

    return c.json({
        success: true,
        message: 'Item moved to trash',
        data: {
            id: itemId,
            deleted_at: new Date().toISOString()
        }
    });
});

export default vault;
