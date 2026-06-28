import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  UserCheck
} from 'lucide-react';
import './Register.css';

function Register({ onRegisterSuccess, onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation du mot de passe
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Calculer la force du mot de passe
    const strength = {
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      special: /[^A-Za-z0-9]/.test(formData.password)
    };
    setPasswordStrength(strength);
  }, [formData.password]);

  const getPasswordStrength = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score === 0) return { level: 'weak', percentage: 0 };
    if (score <= 2) return { level: 'weak', percentage: 33 };
    if (score <= 4) return { level: 'medium', percentage: 66 };
    return { level: 'strong', percentage: 100 };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!formData.email.trim()) {
          setError('Veuillez saisir votre email');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError('Veuillez saisir un email valide');
          return false;
        }
        if (!formData.username.trim()) {
          setError('Veuillez saisir un nom d\'utilisateur');
          return false;
        }
        return true;
        
      case 2:
        if (!formData.password.trim()) {
          setError('Veuillez saisir un mot de passe');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Le mot de passe doit contenir au moins 8 caractères');
          return false;
        }
        if (!formData.confirmPassword.trim()) {
          setError('Veuillez confirmer votre mot de passe');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        return true;
        
      case 3:
        if (!formData.acceptTerms) {
          setError('Veuillez accepter les conditions d\'utilisation');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    if (step < 3) {
      handleNextStep();
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
        
        // Attendre 2 secondes avant la redirection
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);
        
      } else {
        setError(data.detail || 'Erreur lors de la création du compte');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-card">
        {/* En-tête */}
        <div className="register-header">
          <div className="login-logo">
            <div className="logo-icon">
              <UserPlus size={24} />
            </div>
            <div className="logo-text">
              <h1 className="register-title">Créer un compte</h1>
              <p className="register-subtitle">Rejoignez notre plateforme CRM professionnelle</p>
            </div>
          </div>

          {/* Étapes de progression */}
          <div className="progress-steps">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className={`step ${step >= stepNum ? 'active' : ''}`}>
                <div className="step-circle">{stepNum}</div>
                <div className="step-label">
                  {stepNum === 1 && 'Informations'}
                  {stepNum === 2 && 'Sécurité'}
                  {stepNum === 3 && 'Confirmation'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message-register">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message-register">
              <CheckCircle size={20} />
              <span>{success}</span>
            </div>
          )}

          {/* Étape 1: Informations personnelles */}
          {step === 1 && (
            <div className="step-content">
              <div className="form-group-register">
                <label htmlFor="email">
                  <Mail size={16} />
                  Adresse email *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                    className="form-input-register"
                  />
                  <Mail size={20} className="input-icon-register" />
                </div>
              </div>

              <div className="form-group-register">
                <label htmlFor="username">
                  <UserCheck size={16} />
                  Nom d'utilisateur *
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choisissez un nom d'utilisateur"
                    required
                    className="form-input-register"
                  />
                  <UserCheck size={20} className="input-icon-register" />
                </div>
              </div>

              <div className="form-group-register">
                <label htmlFor="firstName">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  className="form-input-register"
                />
              </div>

              <div className="form-group-register">
                <label htmlFor="lastName">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className="form-input-register"
                />
              </div>
            </div>
          )}

          {/* Étape 2: Mot de passe */}
          {step === 2 && (
            <div className="step-content">
              <div className="form-group-register">
                <label htmlFor="password">
                  <Lock size={16} />
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="form-input-register"
                  />
                  <Lock size={20} className="input-icon-register" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    style={{ top: '2.375rem' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Force du mot de passe */}
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill ${strength.level}`}></div>
                  </div>
                  <div className="strength-text">
                    Force: {strength.level === 'weak' ? 'Faible' : 
                            strength.level === 'medium' ? 'Moyenne' : 'Forte'}
                  </div>
                </div>

                {/* Conditions du mot de passe */}
                <div className="password-requirements">
                  <div className={`requirement ${passwordStrength.length ? 'valid' : 'invalid'}`}>
                    <div className="requirement-check">
                      {passwordStrength.length ? '✓' : '•'}
                    </div>
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className={`requirement ${passwordStrength.uppercase ? 'valid' : 'invalid'}`}>
                    <div className="requirement-check">
                      {passwordStrength.uppercase ? '✓' : '•'}
                    </div>
                    <span>Une lettre majuscule</span>
                  </div>
                  <div className={`requirement ${passwordStrength.lowercase ? 'valid' : 'invalid'}`}>
                    <div className="requirement-check">
                      {passwordStrength.lowercase ? '✓' : '•'}
                    </div>
                    <span>Une lettre minuscule</span>
                  </div>
                  <div className={`requirement ${passwordStrength.number ? 'valid' : 'invalid'}`}>
                    <div className="requirement-check">
                      {passwordStrength.number ? '✓' : '•'}
                    </div>
                    <span>Un chiffre</span>
                  </div>
                  <div className={`requirement ${passwordStrength.special ? 'valid' : 'invalid'}`}>
                    <div className="requirement-check">
                      {passwordStrength.special ? '✓' : '•'}
                    </div>
                    <span>Un caractère spécial</span>
                  </div>
                </div>
              </div>

              <div className="form-group-register">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="form-input-register"
                  />
                  <Lock size={20} className="input-icon-register" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    style={{ top: '2.375rem' }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && (
            <div className="step-content">
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="acceptTerms" className="terms-label">
                  J'accepte les <a href="#" className="terms-link">conditions d'utilisation</a> 
                  et la <a href="#" className="terms-link">politique de confidentialité</a>. 
                  J'autorise la collecte et le traitement de mes données personnelles 
                  conformément au RGPD.
                </label>
              </div>

              <div className="summary-section">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Récapitulatif</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Nom d'utilisateur:</strong> {formData.username}</p>
                  {formData.firstName && <p><strong>Prénom:</strong> {formData.firstName}</p>}
                  {formData.lastName && <p><strong>Nom:</strong> {formData.lastName}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation entre étapes */}
          <div className="step-nav">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-step btn-step-prev"
                disabled={loading}
              >
                <ArrowLeft size={18} />
                Précédent
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-step btn-step-next ml-auto"
              >
                Suivant
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.acceptTerms}
                className="btn-register-primary"
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Créer mon compte
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Lien de connexion */}
        <div className="login-prompt">
          <p className="login-text">Déjà un compte ?</p>
          <button 
            onClick={onBackToLogin}
            className="btn-login-secondary"
            disabled={loading}
          >
            Se connecter
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
          
          .text-gray-400 {
            color: var(--gray-400);
          }
          
          .hover\:text-gray-600:hover {
            color: var(--gray-600);
          }
          
          .ml-auto {
            margin-left: auto;
          }
          
          .space-y-2 > * + * {
            margin-top: 0.5rem;
          }
          
          .text-lg {
            font-size: 1.125rem;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .mb-3 {
            margin-bottom: 0.75rem;
          }
          
          .text-gray-800 {
            color: var(--gray-800);
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          .text-gray-600 {
            color: var(--gray-600);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Register;