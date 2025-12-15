import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { VaultList } from './components/VaultList';
import { PasswordGenerator } from './components/PasswordGenerator';
import { Auth } from './components/Auth';
import { AddEntryModal } from './components/AddEntryModal';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--color-ev-black)', minHeight: '100vh', color: 'white' }}>
      <Sidebar
        currentView={view}
        onChangeView={setView}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, display: 'flex', flexDirection: 'column' }} className="diagonal-stripe">

        <Header onAddClick={() => setIsAddModalOpen(true)} />

        {view === 'dashboard' && <Dashboard />}

        {view === 'vault' && <VaultList />}

        {view === 'generator' && (
          <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <h2 className="font-tech text-yellow" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Password Generator Tools</h2>
            <PasswordGenerator />
          </div>
        )}

        {(view === 'cards' || view === 'security' || view === 'settings') && (
          <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <div className="font-tech" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-ev-red)' }}>UNDER MAINTENANCE</div>
            <p>This module is currently initializing...</p>
          </div>
        )}
      </main>

      {isAddModalOpen && (
        <AddEntryModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            // Refresh logic - simplest way is to force re-mount of VaultList or window reload
            // For MVP, window reload or context is robust. 
            // Better: Pass a refresh signal to VaultList.
            // Doing refresh signal via props would require lifting state. 
            // Hack/Simple: window.location.reload(); 
            // Best for now: Switch view or just let user see it next time, 
            // OR we can lift items state to App.tsx but that's a larger refactor.
            // Let's toggle view to trigger re-mount if currently on vault.
            if (view === 'vault') {
              setView('dashboard');
              setTimeout(() => setView('vault'), 10);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
