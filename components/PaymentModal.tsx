import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
        }, 2000);
        setTimeout(() => {
            onPaymentSuccess();
        }, 3500); // Wait 1.5s after success message
    };

    const renderContent = () => {
        if (status === 'success') {
            return (
                <div className="payment-success-view">
                    <div className="success-checkmark">
                        <svg viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="25" fill="none" />
                            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                    <h2>Betaling Geslaagd!</h2>
                    <p>Welkom bij Premium. Je hebt nu volledige toegang.</p>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit}>
                <div style={{textAlign: 'center', margin: '16px 0 32px 0'}}>
                    <p style={{color: 'var(--subtle-text)', margin: '0'}}>Totaalbedrag</p>
                    <strong style={{fontSize: '36px'}}>€14,99</strong>
                    <span style={{color: 'var(--subtle-text)'}}>/maand</span>
                </div>


                <button type="submit" className="button" disabled={status === 'loading'}>
                    {status === 'loading' ? <div className="button-spinner"></div> : 'Betaal Veilig met Stripe'}
                </button>
                
                 <p className="payment-disclaimer" style={{marginTop: '12px', fontSize: '13px'}}>
                    Je wordt doorgestuurd naar Stripe. Ondersteunde methoden zijn o.a. iDEAL, Credit Card en Bancontact.
                </p>

                {status !== 'loading' && <button type="button" onClick={onClose} className="button-tertiary" style={{marginTop: '12px'}}>Annuleren</button>}
            </form>
        );
    };


    return (
        <div className="modal-overlay">
            <div className="card modal-content payment-modal-content" onClick={(e) => e.stopPropagation()}>
                {status !== 'success' && (
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <h2 style={{ color: 'var(--primary-color)' }}>Rond je Upgrade af</h2>
                        <p style={{ color: 'var(--subtle-text)' }}>Verzeker je van premium toegang.</p>
                    </div>
                )}
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentModal;
