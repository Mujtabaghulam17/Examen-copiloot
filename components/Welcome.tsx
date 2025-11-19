import React from 'react';
import Logo from './Logo.tsx';

interface WelcomeProps {
  onContinue: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onContinue }) => {
  const handleGetStarted = () => {
    onContinue();
  };

  return (
    <>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="welcome-logo-container">
          <Logo style={{ maxWidth: '100%', height: 'auto' }} />
        </div>

        <h1>
          Jouw examen glow-up begint hier.
        </h1>
        
        <p className="welcome-subtitle">
          Van stress naar succes, op jouw tempo. GLOWEXAMEN is jouw persoonlijke AI-coach die je helpt groeien, leren en slagen.
        </p>

        <ul className="feature-list">
          <li className="feature-item">
            <div className="feature-icon">✓</div>
            <div>
              <h3>Gepersonaliseerd Leertraject</h3>
              <p>Adaptive AI die met je meeleert.</p>
            </div>
          </li>

          <li className="feature-item">
            <div className="feature-icon">✓</div>
            <div>
              <h3>Directe, Slimme Feedback</h3>
              <p>Begrijp je fouten en groei sneller.</p>
            </div>
          </li>

          <li className="feature-item">
            <div className="feature-icon">✓</div>
            <div>
              <h3>Jouw Persoonlijke Glow-Up Plan</h3>
              <p>Een AI-gegenereerd plan tot aan je examen.</p>
            </div>
          </li>

          <li className="feature-item">
            <div className="feature-icon">✓</div>
            <div>
              <h3>Van Zen Zone tot Foutenanalyse</h3>
              <p>Tools voor focus, ontspanning en inzicht.</p>
            </div>
          </li>
        </ul>

        <button className="button" onClick={handleGetStarted}>
          Start je glow-up →
        </button>
        
        <p className="welcome-footer-text">
          Momenteel geoptimaliseerd voor VWO eindexamens.
        </p>
      </div>
    </>
  );
};

export default Welcome;