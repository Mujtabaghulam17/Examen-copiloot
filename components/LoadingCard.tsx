import React from 'react';

const LoadingCard = () => (
    <div className="card" style={{textAlign: 'center'}}>
        <div className="spinner"></div>
        <h2 style={{marginTop: '24px', color: 'var(--subtle-text)'}}>Je antwoord wordt nagekeken...</h2>
    </div>
);

export default LoadingCard;
