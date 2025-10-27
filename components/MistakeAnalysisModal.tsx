import React from 'react';

interface MistakeAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    analysisContent: string;
    isLoading: boolean;
}

const MistakeAnalysisModal: React.FC<MistakeAnalysisModalProps> = ({ isOpen, onClose, analysisContent, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '22px' }}>AI Foutenanalyse</h2>
                     <button onClick={onClose} className="chat-close-btn" style={{color: 'var(--subtle-text)', fontSize: '28px', background: 'none', border: 'none', cursor: 'pointer'}} aria-label="Sluiten">&times;</button>
                </div>
                <div className="review-content">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '16px', color: 'var(--subtle-text)' }}>Een moment, ik analyseer je foutenpatroon...</p>
                        </div>
                    ) : (
                        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{analysisContent}</p>
                    )}
                </div>
                <button className="button" onClick={onClose} style={{marginTop: '16px'}}>Oké, bedankt!</button>
            </div>
        </div>
    );
};

export default MistakeAnalysisModal;