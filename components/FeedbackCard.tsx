import React from 'react';
import type { Question } from '../data/data.ts';

interface FeedbackCardProps {
    question: Question | null;
    isCorrect: boolean;
    onNext: (() => void) | null;
    onDashboard: () => void;
    feedbackData: {
        xpGained: number;
        aiFeedback: string;
        mindsetTip: string;
    };
    onOpenChat: () => void;
    onExplainConcept: () => void;
    onAnalyzeThinkingProcess: () => void;
    answerLimitReached: boolean;
    onUpgrade: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ question, isCorrect, onNext, onDashboard, feedbackData, onOpenChat, onExplainConcept, onAnalyzeThinkingProcess, answerLimitReached, onUpgrade }) => {
  if (!question) return null;
    
  return (
    <div className="card">
      <h2 className={isCorrect ? 'feedback-correct' : 'feedback-incorrect'}>
        {isCorrect ? `+${feedbackData.xpGained} XP | Goed gedaan!` : `+${feedbackData.xpGained} XP | Niet helemaal, maar goede poging.`}
      </h2>
      <p style={{color: 'var(--subtle-text)'}}>Je antwoord op de vraag over "{question.tekst_naam}" is beoordeeld.</p>
      
      {feedbackData.aiFeedback && (
        <div className="ai-feedback">
            <h3 style={{marginTop: 0, color: 'var(--primary-color)'}}>AI Feedback</h3>
            <p>{feedbackData.aiFeedback}</p>
        </div>
      )}

      {!isCorrect && feedbackData.mindsetTip && (
        <div className="mindset-tip">
            <h3 style={{marginTop: 0, color: 'var(--xp-color)'}}>Mindset Tip</h3>
            <p>{feedbackData.mindsetTip}</p>
        </div>
      )}

      <div className="correct-model">
        <h3>Correctiemodel</h3>
        <p>{question.correctie_model}</p>
      </div>
       <div style={{marginTop: '32px', display: 'flex', gap: '16px', flexDirection: 'column'}}>
        {onNext ? 
            (answerLimitReached ? (
                <button className="button" onClick={onUpgrade}>Daglimiet Bereikt - Upgrade voor Meer</button>
            ) : (
                <button className="button" onClick={onNext}>Volgende Vraag</button>
            )) :
            <p style={{textAlign: 'center', fontWeight: 500}}>Goed werk, je hebt alle beschikbare vragen beantwoord!</p>
        }
        <button className="button button-secondary" onClick={onDashboard}>Terug naar Dashboard</button>
       </div>

       <div className="feedback-tools-section">
            <h3 className="feedback-tools-title">Hulp & Analyse</h3>
            <div className="button-grid">
                <button className="button button-tertiary" onClick={onOpenChat}>
                    Bespreek met AI
                </button>
                <button className="button button-tertiary" onClick={onExplainConcept}>
                    Leg Concept Uit
                </button>
                 {!isCorrect && (
                    <button className="button button-tertiary" onClick={onAnalyzeThinkingProcess}>
                        Analyseer Denkproces
                    </button>
                )}
            </div>
       </div>
    </div>
  );
};

export default FeedbackCard;