import { Hono } from 'hono';

const tools = new Hono();

tools.post('/password/generate', async (c) => {
    const body = await c.req.json();

    const length = body.length || 16;
    const uppercase = body.uppercase !== false;
    const lowercase = body.lowercase !== false;
    const numbers = body.numbers !== false;
    const symbols = body.symbols !== false;
    const excludeSimilar = body.exclude_similar || false;

    let charset = '';
    if (lowercase) charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += excludeSimilar ? '23456789' : '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
        return c.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'At least one character type must be selected' }
        }, 400);
    }

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    // calculate entropy
    const entropyBits = Math.floor(length * Math.log2(charset.length));
    let strength = 'weak';
    if (entropyBits >= 128) strength = 'very_strong';
    else if (entropyBits >= 80) strength = 'strong';
    else if (entropyBits >= 60) strength = 'medium';

    return c.json({
        success: true,
        data: {
            password,
            strength,
            entropy_bits: entropyBits
        }
    });
});

export default tools;
