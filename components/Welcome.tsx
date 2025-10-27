import React from 'react';
import Logo from './Logo.tsx';

const Welcome = ({ onContinue }) => {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      {/* Logo container met beperkte grootte */}
      <div className="welcome-logo-container" style={{ 
        maxWidth: '280px', 
        margin: '0 auto 24px auto',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Logo style={{ maxWidth: '100%', height: 'auto' }} />
      </div>

      <h1 style={{ marginBottom: '12px' }}>
        Jouw examen glow-up begint hier.
      </h1>
      
      <p className="welcome-subtitle" style={{ marginBottom: '32px' }}>
        Van stress naar succes, op jouw tempo. GLOWEXAMEN is jouw persoonlijke AI-coach die je helpt groeien, leren en slagen.
      </p>

      <ul className="feature-list" style={{ 
        textAlign: 'left',
        marginBottom: '32px',
        paddingLeft: 0,
        listStyle: 'none'
      }}>
        <li className="feature-item" style={{ marginBottom: '20px' }}>
          <div className="feature-icon">✓</div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
              Gepersonaliseerd Leertraject
            </h3>
            <p style={{ margin: 0, color: 'var(--subtle-text)', fontSize: '14px' }}>
              Adaptive AI die met je meeleert.
            </p>
          </div>
        </li>

        <li className="feature-item" style={{ marginBottom: '20px' }}>
          <div className="feature-icon">✓</div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
              Directe, Slimme Feedback
            </h3>
            <p style={{ margin: 0, color: 'var(--subtle-text)', fontSize: '14px' }}>
              Begrijp je fouten en groei sneller.
            </p>
          </div>
        </li>

        <li className="feature-item" style={{ marginBottom: '20px' }}>
          <div className="feature-icon">✓</div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
              Jouw Persoonlijke Glow-Up Plan
            </h3>
            <p style={{ margin: 0, color: 'var(--subtle-text)', fontSize: '14px' }}>
              Een AI-gegenereerd plan tot aan je examen.
            </p>
          </div>
        </li>

        <li className="feature-item" style={{ marginBottom: '0' }}>
          <div className="feature-icon">✓</div>
          <div>
            <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>
              Van Zen Zone tot Foutenanalyse
            </h3>
            <p style={{ margin: 0, color: 'var(--subtle-text)', fontSize: '14px' }}>
              Tools voor focus, ontspanning en inzicht.
            </p>
          </div>
        </li>
      </ul>

      <button className="button" onClick={onContinue}>
        Start je glow-up →
      </button>
    </div>
  );
};

export default Welcome;