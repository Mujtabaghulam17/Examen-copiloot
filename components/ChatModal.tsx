import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../data/data.ts';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isSending: boolean;
    chatLimitReached: boolean;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chatHistory, onSendMessage, isSending, chatLimitReached }) => {
    const [message, setMessage] = useState('');
    const chatHistoryRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);

    if (!isOpen) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="card chat-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="chat-header">
                    <h3>GLOW AI</h3>
                    <button onClick={onClose} className="chat-close-btn" aria-label="Sluit chat">&times;</button>
                </div>
                <div className="chat-history" ref={chatHistoryRef}>
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            {msg.text}
                        </div>
                    ))}
                     {isSending && <div className="chat-message model">...</div>}
                </div>
                <form onSubmit={handleSend} className="chat-form">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={chatLimitReached ? "Daglimiet bereikt..." : "Stel een vraag..."}
                        className="chat-input"
                        disabled={isSending || chatLimitReached}
                    />
                    <button type="submit" className="button" disabled={!message.trim() || isSending || chatLimitReached} style={{width: 'auto'}}>
                        Verstuur
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;