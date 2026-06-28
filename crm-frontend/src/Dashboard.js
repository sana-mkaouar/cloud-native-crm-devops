import React, { useState, useEffect } from 'react';
import { getCustomers } from './api';
import './Dashboard.css';

function Dashboard({ onLogout, onNavigate }) {
  const [stats, setStats] = useState({
    customers: 0,
    opportunities: 0,
    tasks: 0,
    revenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const customers = await getCustomers();
      setStats({
        customers: customers.length,
        opportunities: 0,
        tasks: 0,
        revenue: 0
      });
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>CRM Application</h2>
        </div>
        <div className="navbar-menu">
          <button className="btn-logout" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Bienvenue sur votre CRM</h1>
          <p>Gérez vos clients et vos activités en toute simplicité</p>
        </div>

        <div className="cards-container">
          <div className="card" onClick={() => onNavigate('customers')} style={{cursor: 'pointer'}}>
            <div className="card-icon">👥</div>
            <h3>Clients</h3>
            <p className="card-number">{stats.customers}</p>
            <p className="card-description">Clients enregistrés</p>
          </div>

          <div className="card">
            <div className="card-icon">📊</div>
            <h3>Opportunités</h3>
            <p className="card-number">{stats.opportunities}</p>
            <p className="card-description">Opportunités en cours</p>
          </div>

          <div className="card">
            <div className="card-icon">✅</div>
            <h3>Tâches</h3>
            <p className="card-number">{stats.tasks}</p>
            <p className="card-description">Tâches à réaliser</p>
          </div>

          <div className="card">
            <div className="card-icon">💰</div>
            <h3>Revenus</h3>
            <p className="card-number">{stats.revenue} €</p>
            <p className="card-description">Revenus du mois</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => onNavigate('customers')}>
              <span className="action-icon">➕</span>
              Nouveau client
            </button>
            <button className="action-btn">
              <span className="action-icon">📝</span>
              Nouvelle tâche
            </button>
            <button className="action-btn">
              <span className="action-icon">📞</span>
              Nouveau contact
            </button>
            <button className="action-btn">
              <span className="action-icon">📈</span>
              Voir rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
