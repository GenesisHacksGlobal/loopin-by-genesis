import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/Navbar';
import { AuthPage } from './pages/AuthPage';
import { BadgePage } from './pages/BadgePage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { GenesisHubPage } from './pages/GenesisHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { QRScannerModal } from './components/QRScannerModal';
import { PostScanModal } from './components/PostScanModal';
import type { ConnectionCard as ConnectionCardType } from './types';

export function App() {
  const {
    isAuthenticated,
    loginWithOtp,
    logout,
    userProfile,
    updateUserProfile,
    toggleSocialVisibility,
    currentEvent,
    connections,
    addConnection,
    updateConnectionNote,
    deleteConnection,
    events,
    notifications,
    markNotificationRead,
    activeTab,
    setActiveTab,
    isScannerOpen,
    setIsScannerOpen,
    scannedConnection,
    setScannedConnection,
  } = useAppStore();

  const [editingConnectionNote, setEditingConnectionNote] = useState<ConnectionCardType | null>(null);

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={loginWithOtp} />;
  }

  const handleScanSuccess = (newCard: ConnectionCardType) => {
    setIsScannerOpen(false);
    addConnection(newCard);
    setScannedConnection(newCard);
  };

  const handleSavePostScanNote = (id: string, note: string, tags: string[]) => {
    updateConnectionNote(id, note, tags);
    setScannedConnection(null);
    setEditingConnectionNote(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white relative">
      {/* Background Decorative Mesh Gradients */}
      <div className="fixed top-0 left-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Top Header & Floating Bottom Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openScanner={() => setIsScannerOpen(true)}
        eventName={currentEvent.name}
        notifications={notifications}
        markNotificationRead={markNotificationRead}
      />

      {/* Main Content Router */}
      <main className="pt-4 max-w-6xl mx-auto">
        {activeTab === 'badge' && (
          <BadgePage
            user={userProfile}
            event={currentEvent}
            openScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionsPage
            connections={connections}
            onEditNote={(conn) => setEditingConnectionNote(conn)}
            onDeleteConnection={deleteConnection}
            openScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'hub' && (
          <GenesisHubPage events={events} user={userProfile} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            user={userProfile}
            onUpdateUser={updateUserProfile}
            onToggleSocial={toggleSocialVisibility}
            onLogout={logout}
          />
        )}
      </main>

      {/* QR Camera Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        currentEventName={currentEvent.name}
      />

      {/* Post Scan Mutual Exchange & Encrypted Note Modal */}
      <PostScanModal
        connection={scannedConnection || editingConnectionNote}
        onClose={() => {
          setScannedConnection(null);
          setEditingConnectionNote(null);
        }}
        onSave={handleSavePostScanNote}
      />
    </div>
  );
}

export default App;
