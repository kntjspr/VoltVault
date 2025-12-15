import React from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: ReactNode;
    currentView: string;
    onChangeView: (view: string) => void;
    onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onLogout }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar currentView={currentView} onChangeView={onChangeView} onLogout={onLogout} />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                padding: '2rem',
                maxWidth: '1200px',
                marginRight: 'auto',
            }}>
                {children}
            </main>
        </div>
    );
};
