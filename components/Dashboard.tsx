import React, { useState } from 'react';
import StudyPlanner from './StudyPlanner.tsx';
import Badges from './Badges.tsx';
import SummaryCard from './SummaryCard.tsx';
import Logo from './Logo.tsx';
import { summaries } from '../data/summaries.ts';
import type { MasteryScore, StudyPlan, Mistake, PlannerWeek, Badge } from '../data/data.ts';

type Subject = 'Nederlands' | 'Engels' | 'Natuurkunde' | 'Biologie' | 'Economie';

interface DashboardProps {
    masteryScores: { [key: string]: MasteryScore };
    onStartSession: () => void;
    isGeneratingSession: boolean;
    onReset: () => void;
    studyStreak: number;
    level: number;
    xp: number;
    xpForNextLevel: number;
    examDate: string;
    setExamDate: (date: string) => void;
    studyPlan: StudyPlan | null;
    generatePlan: () => void;
    updatePlan: () => void;
    isGeneratingPlan: boolean;
    onToggleTask: (weekIndex: number, taskIndex: number) => void;
    onReviewWeek: (week: PlannerWeek) => void;
    onShowInfo: (infoType: 'syllabus' | 'components') => void;
    repetitionQueue: Mistake[];
    onStartRepetition: () => void;
    onOpenChat: () => void;
    onOpenChatForQuestionGeneration: () => void;
    onOpenZenZone: () => void;
    isPremium: boolean;
    onUpgrade: () => void;
    onAnalyzeMistakes: () => void;
    hasMistakes: boolean;
    currentSubject: Subject;
    onSubjectChange: (subject: Subject) => void;
    answerLimitReached: boolean;
    dailyAnswers: { count: number, date: string };
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    allBadges: Badge[];
    earnedBadges: string[];
}

const DAILY_ANSWER_LIMIT_FREE = 15;

const ThemeToggle = ({ theme, setTheme }) => (
    <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
        className="theme-toggle" 
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        {theme === 'light' ? 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg> :
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        }
    </button>
);

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
      masteryScores, onStartSession, isGeneratingSession, onReset, studyStreak, level, xp, xpForNextLevel, examDate, setExamDate, studyPlan, generatePlan, updatePlan, isGeneratingPlan, onToggleTask, onReviewWeek, onShowInfo, repetitionQueue, onStartRepetition, onOpenChat, onOpenChatForQuestionGeneration, onOpenZenZone, isPremium, onUpgrade, onAnalyzeMistakes, hasMistakes, currentSubject, onSubjectChange, answerLimitReached, dailyAnswers, theme, setTheme, allBadges, earnedBadges
  } = props;
  
  const [activeTab, setActiveTab] = useState<'sessie' | 'planner' | 'tools' | 'samenvatting'>('sessie');
  const xpPercentage = xpForNextLevel > 0 ? Math.round((xp / xpForNextLevel) * 100) : 0;

  return (
    <div className="dashboard-container">
        <div className="dashboard-header" style={{ marginBottom: '24px' }}>
            <div>
                 <div className="dashboard-logo-container" style={{
                     maxWidth: '200px',
                     marginBottom: '8px',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px'
                 }}>
                    <Logo style={{ maxWidth: '100%', height: 'auto' }} />
                    {isPremium && <span className="premium-badge">PRO</span>}
                 </div>
                 <p className="dashboard-subtitle" style={{ margin: 0 }}>
                     Welkom terug. Klaar voor je glow-up?
                 </p>
            </div>
            <div className="header-controls">
                {studyStreak > 0 && (
                    <div className="study-streak" title={`${studyStreak} day streak!`}>
                        <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                           <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>
                        </svg>
                        <span>{studyStreak}</span>
                    </div>
                )}
                <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
        </div>
        
        <div className="subject-switcher" style={{ marginBottom: '20px' }}>
            <button onClick={() => onSubjectChange('Nederlands')} className={currentSubject === 'Nederlands' ? 'active' : ''}>
                Nederlands
            </button>
            <button onClick={() => onSubjectChange('Engels')} className={currentSubject === 'Engels' ? 'active' : ''}>
                Engels
            </button>
            <button onClick={() => onSubjectChange('Natuurkunde')} className={currentSubject === 'Natuurkunde' ? 'active' : ''}>
                Natuurkunde
            </button>
            <button onClick={() => onSubjectChange('Biologie')} className={currentSubject === 'Biologie' ? 'active' : ''}>
                Biologie
            </button>
            <button onClick={() => onSubjectChange('Economie')} className={currentSubject === 'Economie' ? 'active' : ''}>
                Economie
            </button>
        </div>
        
        <div className="dashboard-tabs" style={{ marginBottom: '24px' }}>
            <button onClick={() => setActiveTab('sessie')} className={activeTab === 'sessie' ? 'active' : ''}>
                Studiesessie
            </button>
            <button onClick={() => setActiveTab('planner')} className={activeTab === 'planner' ? 'active' : ''}>
                Planner
            </button>
            <button onClick={() => setActiveTab('tools')} className={activeTab === 'tools' ? 'active' : ''}>
                Tools
            </button>
            <button onClick={() => setActiveTab('samenvatting')} className={activeTab === 'samenvatting' ? 'active' : ''}>
                Samenvatting
            </button>
        </div>

        <div className="dashboard-tab-content">
            {activeTab === 'sessie' && (
                <>
                    <div className="dashboard-hero card">
                        <h2 style={{ marginBottom: '12px' }}>Start een Studiesessie</h2>
                        <p style={{ marginBottom: '16px' }}>
                            De AI stelt een persoonlijke sessie voor op basis van jouw voortgang.
                        </p>
                        {!isPremium && 
                            <div className="daily-limit-tracker" style={{ marginBottom: '16px' }}>
                               <span>Dagelijkse vragen: {dailyAnswers.count}/{DAILY_ANSWER_LIMIT_FREE}</span>
                               <div className="progress-bar" style={{ height: '8px', marginTop: '8px' }}>
                                   <div className="progress-fill skill-progress-fill" style={{ width: `${(dailyAnswers.count / DAILY_ANSWER_LIMIT_FREE) * 100}%` }}></div>
                               </div>
                            </div>
                        }
                        <button className="button" onClick={onStartSession} disabled={answerLimitReached || isGeneratingSession}>
                          {isGeneratingSession ? 'Sessie voorbereiden...' : (answerLimitReached ? "Dagelijkse Limiet Bereikt" : "Start Oefensessie")}
                        </button>
                    </div>
                    
                    <Badges allBadges={allBadges} earnedBadges={earnedBadges} />

                    <div className="card">
                        <h3 style={{ marginBottom: '16px' }}>Mijn Vaardigheden</h3>
                        <div className="level-progress" style={{ marginBottom: '20px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600 }}>Niveau {level}</span>
                                <span style={{ fontWeight: 500, color: 'var(--subtle-text)' }}>{xp} / {xpForNextLevel} XP</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill xp-progress-fill" style={{ width: `${xpPercentage}%` }}></div>
                            </div>
                        </div>
                        {Object.keys(masteryScores).length > 0 ? (
                            Object.entries(masteryScores).map(([skill, score]: [string, MasteryScore]) => {
                                const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
                                return (
                                    <div className="skill-progress" key={skill} style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                          <span style={{ fontWeight: 600 }}>{skill}</span>
                                          <span style={{ fontWeight: 500, color: 'var(--subtle-text)' }}>{percentage}%</span>
                                        </div>
                                        <div className="progress-bar">
                                          <div className="progress-fill skill-progress-fill" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ margin: '8px 0 0 0', color: 'var(--subtle-text)', fontSize: '14px', textAlign: 'center' }}>
                                Nog geen voortgang. Start een sessie om te beginnen!
                            </p>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'planner' && (
                <>
                    <div className="card">
                        <StudyPlanner 
                            examDate={examDate}
                            setExamDate={setExamDate}
                            studyPlan={studyPlan}
                            generatePlan={generatePlan}
                            updatePlan={updatePlan}
                            isGenerating={isGeneratingPlan}
                            onToggleTask={onToggleTask}
                            onReviewWeek={onReviewWeek}
                            onShowInfo={onShowInfo}
                        />
                    </div>
                    {!isPremium && (
                        <div className="card upgrade-card">
                            <h3 style={{ marginBottom: '12px' }}>Ontgrendel je Volledige Potentieel</h3>
                            <p style={{ marginBottom: '16px' }}>
                                Krijg onbeperkt vragen, onbeperkte AI-chat en toegang tot alle toekomstige vakken.
                            </p>
                            <button className="button" onClick={onUpgrade}>Upgrade naar GLOW PRO</button>
                        </div>
                    )}
                </>
            )}
            
            {activeTab === 'tools' && (
                 <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Slimme Tools</h3>
                    <div className="button-grid-vertical">
                        <button className="button button-secondary" onClick={onStartRepetition} disabled={repetitionQueue.length === 0}>
                            Gespreide Herhaling ({repetitionQueue.length})
                        </button>
                         {hasMistakes && (
                            <button className="button button-secondary" onClick={onAnalyzeMistakes}>
                                Analyseer Mijn Fouten
                            </button>
                        )}
                        <button className="button button-secondary" onClick={onOpenChat}>
                            Chat met GLOW AI
                        </button>
                        <button className="button button-secondary" onClick={onOpenChatForQuestionGeneration}>
                            Genereer Oefenvragen
                        </button>
                        <button className="button button-secondary" onClick={onOpenZenZone}>
                           Ga naar de Zen Zone
                        </button>
                    </div>
                </div>
            )}
            
            {activeTab === 'samenvatting' && (
                <SummaryCard subject={currentSubject} content={summaries[currentSubject]} />
            )}
        </div>
        
        <div style={{ textAlign: 'center', paddingBottom: '16px', marginTop: '32px' }}>
            <button className="button-tertiary" onClick={onReset}>Reset Alle Voortgang</button>
        </div>
    </div>
  );
};

export default Dashboard;