import React from 'react';
import { useAuth0 } from '../auth/Auth0Provider.tsx';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EmailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { loginWithRedirect, isLoading } = useAuth0();

    if (!isOpen) return null;

    const handleEmailLogin = async () => {
        try {
            await loginWithRedirect({
                authorizationParams: {
                    screen_hint: 'signup'
                }
            });
        } catch (error) {
            console.error('Email login error:', error);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="card modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>
                        Welkom bij GLOWEXAMEN
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="chat-close-btn" 
                        aria-label="Sluiten"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>
                
                <p style={{ color: 'var(--subtle-text)', marginBottom: '24px' }}>
                    Log in of registreer met je e-mailadres
                </p>

                <div className="sso-button-container">
                    <button className="sso-button" onClick={handleEmailLogin} disabled={isLoading}>
                        {isLoading ? <div className="spinner" style={{width: '24px', height: '24px'}}></div> : <><EmailIcon /><span>Ga door met Email</span></>}
                    </button>
                </div>
                
                <p className="auth-consent-text">
                    Door verder te gaan, ga je akkoord met onze{' '}
                    <a href="#terms" style={{ color: 'var(--primary-color)' }}>Gebruiksvoorwaarden</a>
                    {' '}en ons{' '}
                    <a href="#privacy" style={{ color: 'var(--primary-color)' }}>Privacybeleid</a>.
                </p>
            </div>
        </div>
    );
};

export default AuthModal;