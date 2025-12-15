import React from 'react';
import { ShieldCheck, Lightning, Copy, CaretRight, Warning } from '@phosphor-icons/react';
import { PasswordGenerator } from './PasswordGenerator';

export const Dashboard: React.FC = () => {
    return (
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

            {/* STATS ROW */}
            <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1rem' }}>

                {/* Stat 1: Total Voltage */}
                <div style={{ backgroundColor: '#171717', border: '1px solid #262626', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: 0, top: 0, width: '80px', height: '80px', backgroundColor: 'rgba(237, 28, 36, 0.1)', borderBottomLeftRadius: '100%' }}></div>
                    <div className="font-tech" style={{ color: '#737373', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        Total Voltage
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.25rem' }}>
                        142
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>Stored credentials</div>
                </div>

                {/* Stat 2: Security Health */}
                <div style={{ gridColumn: 'span 2', backgroundColor: '#171717', border: '1px solid #262626', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(38, 38, 38, 0.3), transparent)', transform: 'skewX(-12deg)' }}></div>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div className="font-tech" style={{ color: '#737373', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                            Security Health
                        </div>
                        <div className="font-tech text-yellow" style={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.25rem' }}>
                            98% CHARGED
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#a3a3a3' }}>2 Weak Passwords detected</div>
                    </div>
                    {/* Battery Visualizer */}
                    <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 10 }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ width: '8px', height: '32px', backgroundColor: 'var(--color-ev-yellow)', transform: 'skewX(-15deg)' }}></div>
                        ))}
                        <div style={{ width: '8px', height: '32px', backgroundColor: '#404040', transform: 'skewX(-15deg)' }}></div>
                    </div>
                </div>

                {/* Stat 3: Alert Level */}
                <div style={{ backgroundColor: 'var(--color-ev-red)', border: '1px solid var(--color-ev-red)', padding: '1.5rem', color: 'black', position: 'relative' }}>
                    <div className="font-tech" style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: 700 }}>
                        Alert Level
                    </div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.25rem' }}>
                        LOW
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.8)', fontWeight: 600 }}>No breaches found</div>
                    <ShieldCheck weight="fill" style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '2.5rem', opacity: 0.2 }} />
                </div>
            </div>

            {/* RECENT CELLS */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                    <h2 className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lightning weight="fill" className="text-yellow" /> Recent Access
                    </h2>
                    <button style={{ background: 'none', border: 'none', color: '#737373', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }} className="hover:text-white transition-colors">
                        View All Cells
                    </button>
                </div>

                <RecentCell name="Google Workspace" subtitle="kntjspr@eveready.com" logo="G" logoBg="white" logoColor="black" strength={3} />
                <RecentCell name="GitHub Enterprise" subtitle="dev_ops_master" logo={<i className="ph-fill ph-github-logo"></i>} logoBg="black" strength={1} isLowPower />
                <RecentCell name="Twitter / X" subtitle="@eveready_official" logo="X" logoBg="#1DA1F2" logoColor="white" strength={3} />
            </div>

            {/* SIDE WIDGETS */}
            <div style={{ gridColumn: 'span 4' }}>
                <PasswordGenerator />
            </div>

        </div>
    );
};

interface RecentCellProps {
    name: string;
    subtitle: string;
    logo: React.ReactNode;
    logoBg: string;
    logoColor?: string;
    strength: number;
    isLowPower?: boolean;
}

const RecentCell: React.FC<RecentCellProps> = ({ name, subtitle, logo, logoBg, logoColor, strength: _strength, isLowPower }) => {
    return (
        <div style={{
            backgroundColor: '#171717',
            border: '1px solid #262626',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-ev-yellow)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#262626'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '3rem', height: '3rem',
                    borderRadius: '2px',
                    backgroundColor: logoBg,
                    color: logoColor || 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.25rem'
                }}>
                    {logo}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#737373' }}>{subtitle}</div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'none', flexDirection: 'column', gap: '4px' }}>
                    {/* Hidden on mobile, implementing strength bars later if needed */}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isLowPower && (
                        <div className="blink" style={{
                            backgroundColor: 'rgba(237, 28, 36, 0.1)',
                            border: '1px solid rgba(237, 28, 36, 0.3)',
                            color: 'var(--color-ev-red)',
                            fontSize: '0.65rem', fontWeight: 700,
                            padding: '0.25rem 0.5rem',
                            letterSpacing: '0.05em'
                        }}>
                            COMPROMISED
                        </div>
                    )}
                    <ActionButton icon={<Copy weight="bold" />} hoverColor="var(--color-ev-yellow)" />
                    <ActionButton icon={isLowPower ? <Warning weight="bold" /> : <CarethRight weight="bold" />} hoverColor="var(--color-ev-red)" />
                </div>
            </div>
        </div>
    );
};

// Fix CaretRight typo and missing ActionButton
const CarethRight = CaretRight;

const ActionButton = ({ icon, hoverColor }: { icon: React.ReactNode, hoverColor: string }) => (
    <button
        style={{
            width: '2.5rem', height: '2.5rem',
            border: '1px solid #404040',
            backgroundColor: 'transparent',
            color: '#a3a3a3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#262626';
            e.currentTarget.style.color = hoverColor;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#a3a3a3';
        }}
    >
        {icon}
    </button>
)
