import React, { useState } from 'react';
import { X, Check } from '@phosphor-icons/react';
import { api } from '../api';

interface AddEntryModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ onClose, onSuccess }) => {
    const [type, setType] = useState('login');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createEntry({
                type: type as any,
                name,
                username,
                password,
                url,
                notes,
                favorite: false
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100
        }}>
            <div style={{
                width: '500px', backgroundColor: '#111', border: '1px solid #333',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>Add New Entry</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#737373', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none' }}
                        >
                            <option value="login">Login</option>
                            <option value="card">Card</option>
                            <option value="note">Note</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Google"
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Identity / Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="username@email.com"
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Password / Secret</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://..."
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            style={{ backgroundColor: '#171717', border: '1px solid #333', color: 'white', padding: '0.75rem', outline: 'none', fontFamily: 'monospace' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="font-tech"
                        style={{
                            backgroundColor: 'var(--color-ev-yellow)', color: 'black', border: 'none', padding: '1rem',
                            fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            marginTop: '1rem'
                        }}
                    >
                        {loading ? 'SAVING...' : <><Check weight="bold" /> SAVE ENTRY</>}
                    </button>
                </form>
            </div>
        </div>
    );
};
