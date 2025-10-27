import React from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '48px' }} role="img" aria-label="Rocket">🚀</span>
                    <h2 style={{ marginTop: '16px', color: 'var(--primary-color)' }}>Investeer in je glow-up.</h2>
                    <p style={{ color: 'var(--subtle-text)', lineHeight: 1.6 }}>
                        Upgrade naar GLOW PRO en ontgrendel alle tools om met zelfvertrouwen je examens in te gaan.
                    </p>
                </div>

                <ul className="feature-list" style={{gridTemplateColumns: '1fr', gap: '16px', margin: '24px 0'}}>
                    <li className="feature-item">
                        <div className="feature-icon" style={{backgroundColor: 'var(--background-color)'}}>✓</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Oneindig oefenen, zonder limieten</h3>
                        </div>
                    </li>
                    <li className="feature-item">
                        <div className="feature-icon" style={{backgroundColor: 'var(--background-color)'}}>✓</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>24/7 toegang tot je GLOW AI coach</h3>
                        </div>
                    </li>
                    <li className="feature-item">
                        <div className="feature-icon" style={{backgroundColor: 'var(--background-color)'}}>✓</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Alle vakken, nu en in de toekomst</h3>
                        </div>
                    </li>
                     <li className="feature-item">
                        <div className="feature-icon" style={{backgroundColor: 'var(--background-color)'}}>✓</div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Exclusieve toegang tot alle premium tools</h3>
                        </div>
                    </li>
                </ul>
                
                <div style={{textAlign: 'center', margin: '16px 0'}}>
                    <strong style={{fontSize: '24px'}}>€14,99</strong>
                    <span style={{color: 'var(--subtle-text)'}}> / maand</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    <button onClick={onUpgrade} className="button">Upgrade naar GLOW PRO</button>
                    <button onClick={onClose} className="button-tertiary">Ga door met de gratis versie</button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;