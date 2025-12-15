import React, { useState, useEffect } from 'react';

interface TOTPDisplayProps {
    secret: string; // Base32 secret (mocked for visual)
}

export const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ secret: _secret }) => {
    const [code, setCode] = useState('123 456');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Regenerate mock code
                    setCode(Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2'));
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const progress = (timeLeft / 30) * 100;
    const color = timeLeft < 5 ? 'var(--color-danger)' : 'var(--color-accent)';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--color-text-main)',
                letterSpacing: '2px',
                fontFamily: 'monospace'
            }}>
                {code}
            </div>
            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="4"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${progress}, 100`}
                        style={{ transition: 'stroke-dasharray 1s linear' }}
                    />
                </svg>
            </div>
        </div>
    );
};
