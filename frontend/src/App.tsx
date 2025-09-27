import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Header from './components/Common/Header';
import NotificationContainer from './components/Common/Notification';
import UserDashboard from './components/User/UserDashboard';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="pb-8">
        {currentUser.role === 'user' ? (
          <UserDashboard />
        ) : (
          <OrganizerDashboard />
        )}
      </main>
      <NotificationContainer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;