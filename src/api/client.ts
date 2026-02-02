const API_BASE = '/api/v1';

class ApiClient {
    private token: string | null = null;

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
        }
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('access_token');
        }
        return this.token;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }

        return data;
    }

    // auth
    async login(email: string, password: string) {
        const result = await this.request<{
            success: boolean;
            data: {
                access_token: string;
                user: { id: string; email: string; };
            };
        }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, master_password_hash: password })
        });

        if (result.success && result.data.access_token) {
            this.setToken(result.data.access_token);
        }

        return result;
    }

    async logout() {
        await this.request('/auth/logout', { method: 'POST' });
        this.setToken(null);
    }

    // vault
    async syncVault() {
        return this.request<{
            success: boolean;
            data: {
                folders: Array<{ id: string; encrypted_name: string; }>;
                items: Array<{
                    id: string;
                    folder_id?: string;
                    item_type: number;
                    encrypted_data: string;
                    favorite: boolean;
                    has_totp: boolean;
                    revision_date: string;
                }>;
            };
        }>('/vault/sync');
    }

    async createItem(item: {
        name: string;
        username?: string;
        password?: string;
        url?: string;
        notes?: string;
        folder_id?: string;
        item_type: number;
        favorite?: boolean;
    }) {
        return this.request('/vault/items', {
            method: 'POST',
            body: JSON.stringify(item)
        });
    }

    async updateItem(id: string, updates: Record<string, unknown>) {
        return this.request(`/vault/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async deleteItem(id: string) {
        return this.request(`/vault/items/${id}`, { method: 'DELETE' });
    }

    // password generator
    async generatePassword(options: {
        length?: number;
        uppercase?: boolean;
        lowercase?: boolean;
        numbers?: boolean;
        symbols?: boolean;
    }) {
        return this.request<{
            success: boolean;
            data: { password: string; strength: string; entropy_bits: number; };
        }>('/tools/password/generate', {
            method: 'POST',
            body: JSON.stringify(options)
        });
    }
}

export const api = new ApiClient();
