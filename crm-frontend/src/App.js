import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Register from './Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    alert('Compte créé avec succès ! Connectez-vous maintenant.');
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const navigateToCustomers = () => {
    setCurrentPage('customers');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={handleBackToLogin}
      />
    ) : (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="App">
      {currentPage === 'dashboard' && (
        <Dashboard onNavigateToCustomers={navigateToCustomers} />
      )}
      {currentPage === 'customers' && (
        <Customers onNavigateToDashboard={navigateToDashboard} />
      )}
    </div>
  );
}

export default App;