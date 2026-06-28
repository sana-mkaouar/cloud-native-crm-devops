const API_BASE_URL = 'http://127.0.0.1:8001';

// Récupérer tous les clients
export const getCustomers = async () => {
  const response = await fetch(`${API_BASE_URL}/customers/`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des clients');
  }
  return response.json();
};

// Récupérer un client par ID
export const getCustomer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`);
  if (!response.ok) {
    throw new Error('Client non trouvé');
  }
  return response.json();
};

// Créer un nouveau client
export const createCustomer = async (customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Erreur lors de la création du client');
  }
  return response.json();
};

// Modifier un client
export const updateCustomer = async (id, customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la modification du client');
  }
  return response.json();
};

// Supprimer un client
export const deleteCustomer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression du client');
  }
  return response.json();
};

// Rechercher des clients
export const searchCustomers = async (query) => {
  const response = await fetch(`${API_BASE_URL}/customers/search/${query}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la recherche');
  }
  return response.json();
};
