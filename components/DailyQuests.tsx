import React from 'react';
import type { DailyQuests, Quest } from '../data/data.ts';

interface DailyQuestsProps {
    quests: DailyQuests | null;
    onStartQuest: (quest: Quest) => void;
    isLoading: boolean;
}

const getQuestIcon = (type: string) => {
    switch(type) {
        case 'answer_questions': return '✍️';
        case 'answer_skill': return '🎯';
        case 'do_repetition': return '🧠';
        case 'use_zen_zone': return '🧘';
        default: return '⭐';
    }
};

const DailyQuestsComponent: React.FC<DailyQuestsProps> = ({ quests, onStartQuest, isLoading }) => {

    const renderQuests = () => {
        if (isLoading) {
            return (
                 <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div className="spinner" style={{width: '32px', height: '32px'}}></div>
                    <p style={{ marginTop: '12px', color: 'var(--subtle-text)' }}>Je missies worden geladen...</p>
                </div>
            )
        }
        
        if (!quests || quests.quests.length === 0) {
            return <p>Geen missies voor vandaag. Kom morgen terug!</p>;
        }

        return quests.quests.map((quest, index) => {
            const progress = quest.target > 0 ? (quest.current / quest.target) * 100 : 0;
            return (
                <div key={index} className={`quest-item ${quest.completed ? 'completed' : ''}`}>
                    <div className="quest-icon">{getQuestIcon(quest.type)}</div>
                    <div className="quest-details">
                        <p className="quest-description">{quest.description}</p>
                        <div className="progress-bar" style={{height: '8px'}}>
                            <div className="progress-fill xp-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    {quest.completed ? (
                        <span style={{color: 'var(--correct-color)', fontWeight: 600}}>✓</span>
                    ) : (
                        <button className="button-tertiary" onClick={() => onStartQuest(quest)}>
                            Start
                        </button>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="card daily-quests-container">
            <div className="card-header">
                <h3>Dagelijkse Missies</h3>
                 <span style={{fontWeight: 500, color: 'var(--xp-color)'}}>+75 XP te verdienen</span>
            </div>
            {renderQuests()}
        </div>
    );
};

export default DailyQuestsComponent;