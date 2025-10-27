import React from 'react';
import type { StudyPlan, PlannerWeek, PlannerTask } from '../data/data.ts';

interface StudyPlannerProps {
    examDate: string;
    setExamDate: (date: string) => void;
    studyPlan: StudyPlan | null;
    generatePlan: () => void;
    updatePlan: () => void;
    isGenerating: boolean;
    onToggleTask: (weekIndex: number, taskIndex: number) => void;
    onReviewWeek: (week: PlannerWeek) => void;
    onShowInfo: (infoType: 'syllabus' | 'components') => void;
}

const renderTask = (task: PlannerTask, weekIndex: number, taskIndex: number, onToggleTask: Function, onShowInfo: Function) => {
    if (task.infoType) {
        const icon = task.infoType === 'syllabus'
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M12 8V4M4 14v-4M20 10V6M7 17v-1M17 14v-4"/></svg>;
        
        return (
            <div key={taskIndex} className="info-task" onClick={() => onShowInfo(task.infoType!)} role="button" tabIndex={0}>
                {icon}
                <span>{task.description}</span>
            </div>
        );
    }

    return (
        <div key={taskIndex} className="planner-task">
            <input 
                type="checkbox" 
                id={`task-${weekIndex}-${taskIndex}`}
                checked={task.completed}
                onChange={() => onToggleTask(weekIndex, taskIndex)}
            />
            <label htmlFor={`task-${weekIndex}-${taskIndex}`}>{task.description}</label>
        </div>
    );
};


const StudyPlanner: React.FC<StudyPlannerProps> = ({ examDate, setExamDate, studyPlan, generatePlan, updatePlan, isGenerating, onToggleTask, onReviewWeek, onShowInfo }) => {
    const totalTasks = studyPlan?.weeks.reduce((acc, week) => acc + week.tasks.filter(t => !t.infoType).length, 0) || 0;
    const completedTasks = studyPlan?.weeks.reduce((acc, week) => acc + week.tasks.filter(t => t.completed && !t.infoType).length, 0) || 0;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const calculateDaysLeft = () => {
        if (!examDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(examDate);
        targetDate.setHours(0,0,0,0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };
    
    const daysLeft = calculateDaysLeft();

    return (
        <>
            <h3>Jouw Persoonlijke Studieplanner</h3>
            {!studyPlan ? (
                 <div>
                    <h4 style={{marginTop: '24px'}}>AI-Gegenereerd Plan</h4>
                    <p>Selecteer je examendatum en de AI maakt een interactief plan op maat, inclusief essentiële exameninformatie.</p>
                    <div style={{display: 'flex', gap: '12px'}}>
                        <input 
                            type="date" 
                            value={examDate} 
                            onChange={e => setExamDate(e.target.value)}
                            className="date-input"
                            aria-label="Examendatum"
                         />
                        <button onClick={generatePlan} className="button" disabled={!examDate || isGenerating} style={{flexShrink: 0, width: 'auto'}}>
                            {isGenerating ? 'Genereren...' : 'Maak Plan'}
                        </button>
                    </div>
                 </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '24px' }}>
                       {daysLeft !== null && <span style={{fontWeight: 600, color: 'var(--primary-color)'}}>{daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'} tot je examen!</span>}
                        <span style={{fontWeight: 600}}>{progressPercentage}% voltooid</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill skill-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div style={{maxHeight: '300px', overflowY: 'auto', marginTop: '16px', paddingRight: '10px'}}>
                        {studyPlan.weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="planner-week">
                                <h4 style={{marginBottom: '8px'}}>{week.theme} (Week {week.week_number})</h4>
                                {week.tasks.map((task, taskIndex) => renderTask(task, weekIndex, taskIndex, onToggleTask, onShowInfo))}
                                <button className="button-tertiary" onClick={() => onReviewWeek(week)} style={{marginTop: '8px', fontSize: '14px'}}>
                                    Review Mijn Week
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{marginTop: '16px'}}>
                        <button onClick={() => updatePlan()} className="button button-secondary" disabled={isGenerating}>
                            {isGenerating ? 'Updaten...' : 'Update Plan op Basis van Voortgang'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudyPlanner;