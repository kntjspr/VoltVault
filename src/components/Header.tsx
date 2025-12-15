import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';

export const Header: React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2rem',
            borderBottom: '1px solid #171717',
            backdropFilter: 'blur(4px)',
            position: 'sticky',
            top: 0,
            marginTop: isMobile ? '60px' : 0, // Push down on mobile
            zIndex: 40,
            backgroundColor: 'rgba(0,0,0,0.8)',
            flexWrap: 'wrap',
            gap: '1rem'
        }}>
            <div>
                <h1 className="font-tech" style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                    Command Center
                </h1>
                <p style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    System Status: <span className="text-yellow" style={{ fontWeight: 700 }}>OPTIMAL</span>
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: isMobile ? '100%' : 'auto' }}>
                {/* SEARCH BAR */}
                <div style={{ position: 'relative', flex: isMobile ? 1 : 'initial' }}>
                    <input
                        type="text"
                        placeholder="Search Vault..."
                        className="font-tech"
                        style={{
                            backgroundColor: '#171717',
                            border: '1px solid #404040',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            width: isMobile ? '100%' : '320px',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--color-ev-red)';
                            e.target.style.backgroundColor = '#262626';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#404040';
                            e.target.style.backgroundColor = '#171717';
                        }}
                    />
                    <MagnifyingGlass weight="bold" size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#737373' }} />
                </div>

                {/* ADD NEW BUTTON */}
                <button
                    className="font-tech shadow-hard-red"
                    style={{
                        backgroundColor: 'var(--color-ev-yellow)',
                        color: 'black',
                        fontWeight: 700,
                        padding: '0.75rem 1.5rem',
                        border: '2px solid black',
                        display: isMobile ? 'none' : 'flex', // Hide text button on mobile, maybe icon only later
                        alignItems: 'center',
                        gap: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(2px, 2px)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = '4px 4px 0px 0px var(--color-ev-red)';
                    }}
                >
                    <Plus weight="bold" size={18} />
                    Add Entry
                </button>

                {/* Mobile Add Button (Icon only) */}
                {isMobile && (
                    <button style={{
                        backgroundColor: 'var(--color-ev-yellow)',
                        border: '2px solid black',
                        width: '40px', height: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '4px 4px 0px 0px var(--color-ev-red)'
                    }}>
                        <Plus weight="bold" size={24} color="black" />
                    </button>
                )}
            </div>
        </header>
    );
};
