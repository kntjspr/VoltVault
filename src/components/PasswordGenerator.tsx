import React, { useState, useEffect } from 'react';
import { GearSix, ArrowsClockwise } from '@phosphor-icons/react';

export const PasswordGenerator: React.FC = () => {
    const [length, setLength] = useState(16);
    const [password, setPassword] = useState('');
    const [useLetters, setUseLetters] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Generation Logic
    const generatePassword = () => {
        let charset = "";
        if (useLetters) charset += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (useNumbers) charset += "0123456789";
        if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        // Fallback
        if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz";

        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(retVal);
        setIsCopied(false);
    };

    // Auto-generate on change
    useEffect(() => {
        generatePassword();
    }, [length, useLetters, useNumbers, useSymbols]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Strength Colors
    const getStrengthColor = () => {
        if (length < 10) return 'var(--color-ev-red)';
        if (length < 14) return 'var(--color-ev-yellow)';
        return '#32CD32'; // Green
    };

    const getBars = () => {
        if (length < 10) return 1;
        if (length < 14) return 2;
        return 4;
    };

    return (
        <div style={{
            backgroundColor: '#121212',
            border: '1px solid #262626',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            height: 'fit-content'
        }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem' }}>
                <GearSix weight="fill" color="#404040" size={20} />
            </div>

            <h3 className="font-tech text-yellow" style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Generator
            </h3>

            {/* PASSWORD DISPLAY */}
            <div
                className="group"
                onClick={generatePassword}
                style={{
                    backgroundColor: 'black',
                    border: '1px solid #404040',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontSize: '1.125rem',
                    color: 'white',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    wordBreak: 'break-all'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = getStrengthColor()}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#404040'}
            >
                <span className="password-dots text-sheen">{password}</span>
                <ArrowsClockwise
                    weight="bold"
                    className="group-hover:text-white transition-all duration-500"
                    size={20}
                    style={{ color: '#404040', transition: 'all 0.5s ease', transform: 'rotate(0deg)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a3a3a3', textTransform: 'uppercase', fontWeight: 700 }}>Length: {length}</span>
                    {/* Signal Bars */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                                width: '4px', height: '12px',
                                backgroundColor: i <= getBars() ? getStrengthColor() : '#262626',
                                transition: 'background-color 0.3s ease'
                            }}></div>
                        ))}
                    </div>
                </div>

                <input
                    type="range"
                    min="8" max="32"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        height: '4px',
                        background: '#404040',
                        borderRadius: '4px',
                        appearance: 'none',
                        cursor: 'pointer',
                        accentColor: getStrengthColor()
                    }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <OptionToggle label="A-Z" active={useLetters} onClick={() => setUseLetters(!useLetters)} color="var(--color-ev-red)" />
                    <OptionToggle label="0-9" active={useNumbers} onClick={() => setUseNumbers(!useNumbers)} color="var(--color-ev-red)" />
                    <OptionToggle label="!@#" active={useSymbols} onClick={() => setUseSymbols(!useSymbols)} color="var(--color-ev-red)" />
                </div>
            </div>

            <button
                onClick={handleCopy}
                className="font-tech clip-battery"
                style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    backgroundColor: isCopied ? getStrengthColor() : 'white',
                    color: 'black',
                    fontWeight: 700,
                    padding: '0.75rem',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => !isCopied && (e.currentTarget.style.backgroundColor = 'var(--color-ev-yellow)')}
                onMouseLeave={(e) => !isCopied && (e.currentTarget.style.backgroundColor = 'white')}
            >
                {isCopied ? 'COPIED!' : 'Copy to Clipboard'}
            </button>
        </div>
    );
};

const OptionToggle: React.FC<{ label: string, active: boolean, onClick: () => void, color: string }> = ({ label, active, onClick, color }) => (
    <div
        onClick={onClick}
        style={{
            flex: 1,
            backgroundColor: '#171717',
            border: '1px solid #404040',
            padding: '0.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: active ? 'white' : '#737373',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: `2px solid ${active ? color : '#404040'}`,
            userSelect: 'none',
            transition: 'all 0.2s ease'
        }}
    >
        {label}
    </div>
)
