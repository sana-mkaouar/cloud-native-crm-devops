import './Login.css';

import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  Users,
  Sparkles
} from 'lucide-react';
import './Login.css';

function Login({ onLoginSuccess, onShowRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation côté client
    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }
    
    if (!password.trim()) {
      setError('Veuillez saisir votre mot de passe');
      return;
    }
    
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        
        // Sauvegarder les infos utilisateur si "Se souvenir de moi"
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Simulation de délai pour l'animation
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
        
      } else {
        setError(data.detail || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* En-tête */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <Users size={24} />
            </div>
            <div className="logo-text">
              <h1 className="login-title">CRM Pro</h1>
              <p className="login-subtitle">Gestion de relations clients professionnelle</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message-enhanced">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Champ Email */}
          <div className="form-group-enhanced">
            <label htmlFor="email" className="form-label">
              <Mail size={16} />
              Adresse email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="form-input-enhanced"
                autoComplete="username"
              />
              <Mail size={20} className="input-icon" />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="form-group-enhanced">
            <label htmlFor="password" className="form-label">
              <Lock size={16} />
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input-enhanced"
                autoComplete="current-password"
              />
              <Lock size={20} className="input-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                style={{ top: '2.375rem' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Options supplémentaires */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            
            <button
              type="button"
              onClick={() => alert('Fonctionnalité à implémenter')}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-login pulse-animation"
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Se connecter
              </>
            )}
          </button>

          {/* Bouton de démo */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full mt-3 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all hover:shadow-lg"
          >
            <Sparkles size={18} />
            Essayer la version démo
          </button>
        </form>

        {/* Lien d'inscription */}
        <div className="register-prompt">
          <p className="register-text">Pas encore de compte ?</p>
          <button 
            onClick={onShowRegister}
            className="btn-register"
          >
            Créer un compte gratuit
          </button>
        </div>

        {/* Styles inline */}
        <style jsx>{`
          .relative {
            position: relative;
          }
          
          .absolute {
            position: absolute;
          }
          
          .right-3 {
            right: 0.75rem;
          }
          
          .top-1\/2 {
            top: 50%;
          }
          
          .transform {
            transform: translateY(-50%);
          }
          
          .-translate-y-1\/2 {
            transform: translateY(-50%);
          }
          
          .flex {
            display: flex;
          }
          
          .items-center {
            align-items: center;
          }
          
          .justify-between {
            justify-content: space-between;
          }
          
          .justify-center {
            justify-content: center;
          }
          
          .gap-2 {
            gap: 0.5rem;
          }
          
          .mb-6 {
            margin-bottom: 1.5rem;
          }
          
          .cursor-pointer {
            cursor: pointer;
          }
          
          .w-4 {
            width: 1rem;
          }
          
          .h-4 {
            height: 1rem;
          }
          
          .text-primary-600 {
            color: var(--primary-600);
          }
          
          .rounded {
            border-radius: 0.25rem;
          }
          
          .border-gray-300 {
            border-color: var(--gray-300);
          }
          
          .focus\:ring-primary-500:focus {
            --tw-ring-color: var(--primary-500);
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          .text-gray-600 {
            color: var(--gray-600);
          }
          
          .hover\:text-gray-600:hover {
            color: var(--gray-600);
          }
          
          .hover\:text-primary-800:hover {
            color: var(--primary-800);
          }
          
          .font-medium {
            font-weight: 500;
          }
          
          .mt-3 {
            margin-top: 0.75rem;
          }
          
          .p-3 {
            padding: 0.75rem;
          }
          
          .from-cyan-500 {
            --tw-gradient-from: #06b6d4;
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(6, 182, 212, 0));
          }
          
          .to-blue-500 {
            --tw-gradient-to: #3b82f6;
          }
          
          .hover\:from-cyan-600:hover {
            --tw-gradient-from: #0891b2;
          }
          
          .hover\:to-blue-600:hover {
            --tw-gradient-to: #2563eb;
          }
          
          .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
          }
          
          .hover\:shadow-lg:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Login;