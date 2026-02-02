import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { TOTPDisplay } from './TOTPDisplay';
import { Copy, Eye, EyeSlash, CaretRight, Warning, Globe, CreditCard, Note, ArrowLeft } from '@phosphor-icons/react';

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

export const VaultList: React.FC = () => {
    const [items, setItems] = useState<VaultItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const result = await api.syncVault();
                if (result.success) {
                    const vaultItems: VaultItem[] = result.data.items.map(item => {
                        const parsed = JSON.parse(item.encrypted_data);
                        return {
                            id: item.id,
                            type: item.item_type === 1 ? 'login' : item.item_type === 3 ? 'card' : 'note',
                            name: parsed.name,
                            username: parsed.username,
                            password: parsed.password,
                            url: parsed.url,
                            notes: parsed.notes,
                            folderId: item.folder_id,
                            favorite: item.favorite,
                            totpSecret: parsed.totpSecret,
                            lastModified: item.revision_date
                        };
                    });
                    setItems(vaultItems);
                }
            } catch (err) {
                console.error('failed to fetch vault:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, []);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'login': return <Globe weight="fill" size={24} />;
            case 'card': return <CreditCard weight="fill" size={24} />;
            case 'note': return <Note weight="fill" size={24} />;
            default: return <Globe weight="fill" size={24} />;
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#737373' }}>
                <div className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700 }}>LOADING VAULT...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', height: 'calc(100vh - 80px)', gap: '2rem', position: 'relative' }}>

            {/* List Column */}
            <div style={{
                width: isMobile ? '100%' : '400px',
                flexDirection: 'column',
                gap: '1rem',
                display: (isMobile && selectedItem) ? 'none' : 'flex'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', color: 'white' }}>
                        Vault Database
                    </h2>
                    <span className="text-yellow" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{filteredItems.length} ITEMS</span>
                </div>

                <input
                    type="text"
                    placeholder="Filter database..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="font-tech"
                    style={{
                        backgroundColor: '#171717',
                        border: '1px solid #404040',
                        color: 'white',
                        padding: '1rem',
                        width: '100%',
                        outline: 'none',
                        fontSize: '0.875rem'
                    }}
                />

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => { setSelectedItem(item); setShowPassword(false); }}
                            className="group"
                            style={{
                                backgroundColor: selectedItem?.id === item.id ? '#171717' : 'transparent',
                                border: '1px solid',
                                borderColor: selectedItem?.id === item.id ? 'var(--color-ev-yellow)' : '#262626',
                                padding: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedItem?.id !== item.id) e.currentTarget.style.borderColor = '#404040';
                            }}
                            onMouseLeave={(e) => {
                                if (selectedItem?.id !== item.id) e.currentTarget.style.borderColor = '#262626';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '3rem', height: '3rem',
                                    backgroundColor: selectedItem?.id === item.id ? 'var(--color-ev-yellow)' : '#262626',
                                    color: selectedItem?.id === item.id ? 'black' : 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: '2px',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {getIcon(item.type)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#737373', fontFamily: 'monospace' }}>{item.username || item.type.toUpperCase()}</div>
                                </div>
                            </div>

                            <CaretRight
                                weight="bold"
                                size={16}
                                color={selectedItem?.id === item.id ? 'var(--color-ev-yellow)' : '#404040'}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Column */}
            <div style={{
                flex: 1,
                backgroundColor: '#111',
                border: '1px solid #262626',
                display: isMobile && !selectedItem ? 'none' : 'flex',
                flexDirection: 'column',
                // Mobile Overlay styles
                position: isMobile ? 'fixed' : 'relative',
                top: isMobile ? 0 : 'auto',
                left: isMobile ? 0 : 'auto',
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? '100vh' : 'auto',
                zIndex: isMobile ? 60 : 1
            }}>
                {selectedItem ? (
                    <>
                        {/* Detail Header */}
                        <div className="diagonal-stripe" style={{ padding: '2rem', borderBottom: '1px solid #262626', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Mobile Back Button */}
                            {isMobile && (
                                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <ArrowLeft weight="bold" /> BACK TO DATABASE
                                </button>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '80px', height: '80px',
                                        backgroundColor: 'var(--color-ev-red)',
                                        color: 'black',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        fontWeight: 700,
                                        boxShadow: '4px 4px 0px 0px var(--color-ev-yellow)'
                                    }}>
                                        {getIcon(selectedItem.type)}
                                    </div>
                                    <div>
                                        <h1 className="font-tech" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.25rem' }}>{selectedItem.name}</h1>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className="text-yellow" style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{selectedItem.type}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#555' }}>|</span>
                                            <span style={{ fontSize: '0.75rem', color: '#737373', fontFamily: 'monospace' }}>ID: {selectedItem.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {!isMobile && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #404040', color: '#a3a3a3' }}>EDIT</button>
                                        <button className="btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #404040', color: 'var(--color-ev-red)' }}>DELETE</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detail Body */}
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>

                            {/* Username Field */}
                            {selectedItem.username && (
                                <DetailField label="USERNAME" value={selectedItem.username} onCopy={() => handleCopy(selectedItem.username!)} />
                            )}

                            {/* Password Field */}
                            {selectedItem.password && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label className="font-tech" style={{ color: '#737373', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>PASSWORD</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{
                                            flex: 1,
                                            backgroundColor: '#171717',
                                            border: '1px solid #404040',
                                            padding: '1rem',
                                            fontFamily: 'monospace',
                                            fontSize: '1rem',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <span>{showPassword ? selectedItem.password : '••••••••••••••••'}</span>
                                            {showPassword && <span className="text-red" style={{ fontSize: '0.75rem', fontWeight: 700 }}>EXPOSED</span>}
                                        </div>
                                        <SquareButton icon={showPassword ? <EyeSlash size={20} /> : <Eye size={20} />} onClick={() => setShowPassword(!showPassword)} />
                                        <SquareButton icon={<Copy size={20} />} onClick={() => handleCopy(selectedItem.password!)} activeColor="var(--color-ev-yellow)" />
                                    </div>
                                </div>
                            )}

                            {/* TOTP Field */}
                            {selectedItem.totpSecret && (
                                <div style={{
                                    border: '1px solid var(--color-ev-yellow)',
                                    backgroundColor: 'rgba(255, 242, 0, 0.05)',
                                    padding: '1.5rem',
                                    position: 'relative'
                                }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-ev-yellow)', color: 'black', fontSize: '0.625rem', fontWeight: 800 }}>2FA ACTIVE</div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <label className="font-tech" style={{ color: 'var(--color-ev-yellow)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>AUTHENTICATOR CODE</label>
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <TOTPDisplay secret={selectedItem.totpSecret} />
                                            </div>
                                        </div>
                                        <SquareButton icon={<Copy size={20} />} onClick={() => handleCopy('123456')} activeColor="var(--color-ev-yellow)" />
                                    </div>
                                </div>
                            )}

                            {/* URL Field */}
                            {selectedItem.url && (
                                <DetailField label="WEBSITE" value={selectedItem.url} isLink />
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#404040', gap: '1rem' }}>
                        <Warning size={64} weight="duotone" />
                        <div className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Awaiting Selection</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailField: React.FC<{ label: string, value: string, onCopy?: () => void, isLink?: boolean }> = ({ label, value, onCopy, isLink }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label className="font-tech" style={{ color: '#737373', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>{label}</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{
                flex: 1,
                backgroundColor: '#171717',
                border: '1px solid #404040',
                padding: '1rem',
                fontFamily: isLink ? 'inherit' : 'monospace',
                fontSize: '1rem',
                color: isLink ? 'var(--color-ev-red)' : 'white',
                textDecoration: isLink ? 'underline' : 'none',
                cursor: isLink ? 'pointer' : 'default'
            }}
                onClick={() => isLink && window.open(value, '_blank')}
            >
                {value}
            </div>
            {onCopy && (
                <SquareButton icon={<Copy size={20} />} onClick={onCopy} activeColor="var(--color-ev-yellow)" />
            )}
        </div>
    </div>
);

const SquareButton: React.FC<{ icon: React.ReactNode, onClick: () => void, activeColor?: string }> = ({ icon, onClick, activeColor }) => (
    <button
        onClick={onClick}
        style={{
            width: '3.5rem',
            border: '1px solid #404040',
            backgroundColor: 'transparent',
            color: '#a3a3a3',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#262626';
            e.currentTarget.style.color = activeColor || 'white';
            e.currentTarget.style.borderColor = activeColor || '#737373';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#a3a3a3';
            e.currentTarget.style.borderColor = '#404040';
        }}
    >
        {icon}
    </button>
)
