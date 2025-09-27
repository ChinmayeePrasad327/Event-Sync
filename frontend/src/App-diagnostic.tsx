import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Auth/Login';
import Header from './components/Common/Header';
import NotificationContainer from './components/Common/Notification';
import UserDashboard from './components/User/UserDashboard';
import OrganizerDashboard from './components/Organizer/OrganizerDashboard';
import ConnectionDiagnostic from './components/ConnectionDiagnostic';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  if (showDiagnostic) {
    return (
      <div>
        <div className="bg-white shadow-sm border-b border-gray-100 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Connection Diagnostic</h1>
            <button
              onClick={() => setShowDiagnostic(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to App
            </button>
          </div>
        </div>
        <ConnectionDiagnostic />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <div className="bg-white shadow-sm border-b border-gray-100 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">EventSync - Login</h1>
            <button
              onClick={() => setShowDiagnostic(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
  );
}

export default App;
