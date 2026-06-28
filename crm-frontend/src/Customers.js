import React, { useState, useEffect } from 'react';
import { getCustomers, deleteCustomer } from './api';
import CustomerForm from './CustomerForm';
import './Customers.css';

function Customers({ onNavigateToDashboard }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteCustomer(id);
        loadCustomers();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleBackToDashboard = () => {
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  if (loading) {
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>CRM Application</h2>
          </div>
          <div className="navbar-menu">
            <button className="btn-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </nav>
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>CRM Application</h2>
        </div>
        <div className="navbar-menu">
          <button className="btn-nav" onClick={handleBackToDashboard}>
            🏠 Tableau de bord
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="customers-page">
        <div className="customers-header">
          <h1>Gestion des Clients</h1>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(true)}
          >
            ➕ Nouveau Client
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <CustomerForm 
            customer={editingCustomer}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}

        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Aucun client enregistré
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.company || '-'}</td>
                    <td>
                      <span className={`status status-${customer.status}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(customer)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(customer.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;