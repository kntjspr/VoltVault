import React from 'react';
import { Lightning, SquaresFour, Key, CreditCard, ShieldCheck, Gear, MagicWand } from '@phosphor-icons/react';
import defaultProfile from '../assets/default_profile.jpg';

interface SidebarProps {
    currentView: string;
    onChangeView: (view: string) => void;
    onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout }) => {
    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--color-ev-dark)',
            borderRight: '1px solid #262626',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            zIndex: 50
        }}>
            {/* LOGO AREA */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #262626' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        backgroundColor: 'var(--color-ev-red)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: 'skewX(-10deg)',
                        boxShadow: '4px 4px 0px 0px var(--color-ev-yellow)'
                    }}>
                        <Lightning weight="bold" color="white" size={24} style={{ transform: 'skewX(10deg)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="font-tech" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.05em' }}>
                            VOLT<span className="text-red">VAULT</span>
                        </span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                            Powered by Eveready
                        </span>
                    </div>
                </div>
            </div>

            {/* NAV LINKS */}
            <nav style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="font-tech" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    Main Grid
                </div>

                <NavItem
                    active={currentView === 'dashboard'}
                    icon={<SquaresFour weight="fill" size={20} />}
                    label="Dashboard"
                    onClick={() => onChangeView('dashboard')}
                />
                <NavItem
                    active={currentView === 'vault'}
                    icon={<Key weight="bold" size={20} />}
                    label="Logins"
                    badge="142"
                    onClick={() => onChangeView('vault')}
                />
                <NavItem
                    active={currentView === 'cards'}
                    icon={<CreditCard weight="bold" size={20} />}
                    label="Payment Cards"
                    onClick={() => onChangeView('cards')}
                />
                <NavItem
                    active={currentView === 'security'}
                    icon={<ShieldCheck weight="bold" size={20} />}
                    label="Security Check"
                    hasPulse
                    onClick={() => onChangeView('security')}
                />

                <div className="font-tech" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#525252', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2rem', marginBottom: '1rem' }}>
                    Tools
                </div>
                <NavItem
                    active={currentView === 'generator'}
                    icon={<MagicWand weight="bold" size={20} />}
                    label="Pass Generator"
                    onClick={() => onChangeView('generator')}
                />
            </nav>

            {/* USER PROFILE */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #262626', backgroundColor: 'rgba(23, 23, 23, 0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                        src={defaultProfile}
                        alt="User"
                        style={{ width: '40px', height: '40px', borderRadius: '2px', border: '2px solid #404040', objectFit: 'cover', filter: 'grayscale(100%)' }}
                    />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Kent Jasper Sisi</div>
                        <div className="text-yellow" style={{ fontSize: '0.75rem' }}>User</div>
                    </div>
                    <button onClick={onLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>
                        <Gear weight="bold" size={20} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

interface NavItemProps {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    hasPulse?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ active, icon, label, badge, hasPulse, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                width: '100%',
                backgroundColor: active ? '#171717' : 'transparent',
                border: 'none',
                borderLeft: active ? '4px solid var(--color-ev-yellow)' : '4px solid transparent',
                color: active ? 'white' : '#A3A3A3',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = '#171717';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderLeft = '4px solid var(--color-ev-red)';
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#A3A3A3';
                    e.currentTarget.style.borderLeft = '4px solid transparent';
                }
            }}
        >
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: active ? 'text-yellow' : ''
            })}
            <span style={{ fontWeight: active ? 700 : 400 }}>{label}</span>

            {badge && (
                <span style={{ marginLeft: 'auto', fontSize: '0.625rem', backgroundColor: '#262626', padding: '0.125rem 0.5rem', borderRadius: '4px', color: '#a3a3a3' }}>
                    {badge}
                </span>
            )}

            {hasPulse && (
                <div className="status-pulse" style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-ev-red)' }}></div>
            )}
        </button>
    );
};
