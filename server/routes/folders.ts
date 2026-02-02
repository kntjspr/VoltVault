import { Hono } from 'hono';
import { store } from '../data/store';

type Variables = { userId: string };

const folders = new Hono<{ Variables: Variables }>();

folders.use('/*', async (c, next) => {
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

folders.get('/', (c) => {
    const userId = c.get('userId');
    const userFolders = store.getFolders(userId);

    return c.json({
        success: true,
        data: userFolders.map(f => ({
            id: f.id,
            encrypted_name: f.name,
            parent_folder_id: null,
            revision_date: new Date().toISOString()
        }))
    });
});

folders.post('/', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json();

    const folder = store.addFolder(userId, {
        id: '',
        name: body.encrypted_name || body.name || 'New Folder'
    });

    return c.json({
        success: true,
        data: {
            id: folder.id,
            encrypted_name: folder.name,
            parent_folder_id: null,
            revision_date: new Date().toISOString()
        }
    }, 201);
});

folders.put('/:id', async (c) => {
    const userId = c.get('userId');
    const folderId = c.req.param('id');
    const body = await c.req.json();

    const folder = store.updateFolder(userId, folderId, body.encrypted_name || body.name);
    if (!folder) {
        return c.json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Folder not found' }
        }, 404);
    }

    return c.json({
        success: true,
        data: {
            id: folder.id,
            encrypted_name: folder.name,
            revision_date: new Date().toISOString()
        }
    });
});

folders.delete('/:id', (c) => {
    const userId = c.get('userId');
    const folderId = c.req.param('id');

    const deleted = store.deleteFolder(userId, folderId);
    if (!deleted) {
        return c.json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Folder not found' }
        }, 404);
    }

    return c.json({
        success: true,
        message: 'Folder deleted. Items moved to root.'
    });
});

export default folders;
