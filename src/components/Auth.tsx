import React, { useState } from 'react';
import brandLogo from '../assets/brand_logo.png';
import { Lightning, ArrowRight } from '@phosphor-icons/react';

interface AuthProps {
    onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            onLogin();
        }, 1000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-ev-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 242, 0, 0.02) 10px, rgba(255, 242, 0, 0.02) 20px)`
        }}>
            <div style={{ width: '400px', backgroundColor: '#0F0F0F', border: '1px solid #262626', position: 'relative' }}>

                {/* TOP DECORATION */}
                <div style={{ height: '4px', background: 'var(--color-ev-yellow)', width: '100%' }}></div>

                <div style={{ padding: '3rem' }}>
                    {/* BRANDING */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <div style={{
                                position: 'absolute', inset: '-10px',
                                border: '1px solid var(--color-ev-red)',
                                transform: 'skewX(-10deg)',
                                opacity: 0.5
                            }}></div>
                            <img src={brandLogo} alt="Eveready" style={{ height: '64px', position: 'relative', zIndex: 10 }} />
                        </div>

                        <h1 className="font-tech" style={{ fontSize: '2rem', fontWeight: 700, color: 'white', letterSpacing: '-0.05em' }}>
                            VOLT<span className="text-red">VAULT</span>
                        </h1>
                        <p style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
                            Enterprise Access Control
                        </p>
                    </div>

                    {/* LOGIN FORM */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Identity
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="username@eveready.com"
                                className="font-tech"
                                style={{
                                    backgroundColor: '#171717',
                                    border: '1px solid #333',
                                    color: 'white',
                                    padding: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontSize: '1rem'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--color-ev-yellow)'; e.target.style.backgroundColor = '#262626'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#333'; e.target.style.backgroundColor = '#171717'; }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="font-tech" style={{ color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Passcode</span>
                                <a href="#" style={{ color: 'var(--color-ev-red)', textDecoration: 'none' }}>RESET</a>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="font-tech"
                                style={{
                                    backgroundColor: '#171717',
                                    border: '1px solid #333',
                                    color: 'white',
                                    padding: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontSize: '1rem'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--color-ev-yellow)'; e.target.style.backgroundColor = '#262626'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#333'; e.target.style.backgroundColor = '#171717'; }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="font-tech clip-battery"
                            disabled={isLoading}
                            style={{
                                backgroundColor: 'var(--color-ev-red)',
                                color: 'white',
                                border: 'none',
                                padding: '1rem',
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: isLoading ? 'wait' : 'pointer',
                                marginTop: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                transition: 'all 0.2s ease',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--color-ev-yellow)', e.currentTarget.style.color = 'black')}
                            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--color-ev-red)', e.currentTarget.style.color = 'white')}
                        >
                            {isLoading ? 'Authorizing...' : 'Initialize Session'}
                            {!isLoading && <ArrowRight weight="bold" />}
                        </button>
                    </form>
                </div>

                {/* BOTTOM STATUS */}
                <div style={{ borderTop: '1px solid #262626', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#32CD32', boxShadow: '0 0 10px #32CD32' }}></div>
                        <span style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', fontWeight: 700 }}>System Online</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                        <Lightning weight="fill" size={12} color="var(--color-ev-yellow)" />
                        <span style={{ fontSize: '0.65rem', color: '#666', fontFamily: 'monospace' }}>v2.4.0-RC</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
