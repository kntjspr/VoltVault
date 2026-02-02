import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import auth from './routes/auth';
import vault from './routes/vault';
import folders from './routes/folders';
import tools from './routes/tools';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// mount routes
app.route('/api/v1/auth', auth);
app.route('/api/v1/vault', vault);
app.route('/api/v1/vault/folders', folders);
app.route('/api/v1/tools', tools);

// 404 handler
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }, 404));

const port = 3001;
console.log(`🔋 VoltVault API running on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch
};
