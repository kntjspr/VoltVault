import { Hono } from 'hono';
import { store } from '../data/store';

const auth = new Hono();

auth.post('/login', async (c) => {
    const body = await c.req.json();
    const { email, master_password_hash } = body;

    if (!email) {
        return c.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Email is required' }
        }, 400);
    }

    const user = store.getUserByEmail(email);

    // demo mode: accept any password for demo user, or check hash
    if (!user || (user.passwordHash !== master_password_hash && user.passwordHash !== 'demo123')) {
        return c.json({
            success: false,
            error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
        }, 401);
    }

    const session = store.createSession(user.id);
    const keys = store.getUserKeys(user.id);

    return c.json({
        success: true,
        data: {
            access_token: session.token,
            refresh_token: session.token, // same for simplicity
            expires_in: 604800,
            token_type: 'Bearer',
            user: {
                id: user.id,
                email: user.email,
                two_factor_enabled: user.twoFactorEnabled,
                email_verified: user.emailVerified
            },
            keys: keys ? {
                encrypted_symmetric_key: keys.encryptedSymmetricKey,
                encrypted_private_key: keys.encryptedPrivateKey,
                kdf_iterations: keys.kdfIterations
            } : null
        }
    });
});

auth.post('/register', async (c) => {
    const body = await c.req.json();
    const { email, master_password_hash, keys } = body;

    if (!email || !master_password_hash) {
        return c.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' }
        }, 400);
    }

    const existing = store.getUserByEmail(email);
    if (existing) {
        return c.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Email already registered', details: { field: 'email' } }
        }, 400);
    }

    const userId = crypto.randomUUID();
    store.users.push({
        id: userId,
        email,
        passwordHash: master_password_hash,
        twoFactorEnabled: false,
        emailVerified: false,
        createdAt: new Date().toISOString()
    });

    if (keys) {
        store.userKeys.push({
            userId,
            encryptedSymmetricKey: keys.encrypted_symmetric_key || '',
            encryptedPrivateKey: keys.encrypted_private_key || '',
            publicKey: keys.public_key || '',
            kdfIterations: body.kdf_iterations || 100000
        });
    }

    return c.json({
        success: true,
        data: {
            user_id: userId,
            email,
            email_verified: false,
            created_at: new Date().toISOString()
        },
        message: 'Registration successful. Please verify your email.'
    }, 201);
});

auth.post('/logout', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        store.deleteSession(token);
    }

    return c.json({
        success: true,
        message: 'Logged out successfully'
    });
});

auth.post('/refresh', async (c) => {
    const body = await c.req.json();
    const { refresh_token } = body;

    const session = store.getSessionByToken(refresh_token);
    if (!session) {
        return c.json({
            success: false,
            error: { code: 'TOKEN_EXPIRED', message: 'Invalid or expired token' }
        }, 401);
    }

    return c.json({
        success: true,
        data: {
            access_token: session.token,
            expires_in: 604800,
            token_type: 'Bearer'
        }
    });
});

export default auth;
