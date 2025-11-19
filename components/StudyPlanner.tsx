import React from 'react';
import type { StudyPlan, PlannerWeek, PlannerTask } from '../data/data.ts';

interface StudyPlannerProps {
    studyPlan: StudyPlan | null;
    readOnly?: boolean;
    examDate?: string;
    setExamDate?: (date: string) => void;
    generatePlan?: () => void;
    updatePlan?: () => void;
    isGenerating?: boolean;
    onToggleTask?: (weekIndex: number, taskIndex: number) => void;
    onReviewWeek?: (week: PlannerWeek) => void;
    onShowInfo?: (infoType: 'syllabus' | 'components') => void;
    onStartActionableTask?: (weekIndex: number, taskIndex: number, actionType: string, context?: string) => void;
}

const toolActionMap: { [key: string]: string } = {
    'Start Oefensessie': 'start_session',
    'Genereer Oefenvragen': 'generate_questions',
    'Gespreide Herhaling': 'repetition',
    'Analyseer Mijn Fouten': 'analyze_mistakes',
    'Zen Zone': 'zen_zone',
    'GLOW AI': 'chat_ai',
};
const toolKeywords = Object.keys(toolActionMap);

const parseDescriptionForAction = (description: string): { text: string; isAction: boolean; actionType?: string; context?: string }[] => {
    const keywordRegex = new RegExp(`'(${toolKeywords.join('|')})'`, 'i');
    const match = description.match(keywordRegex);

    if (!match) {
        return [{ text: description, isAction: false }];
    }

    const matchedKeyword = match[1];
    const originalKeyword = toolKeywords.find(k => k.toLowerCase() === matchedKeyword.toLowerCase()) || matchedKeyword;
    
    const actionType = toolActionMap[originalKeyword];
    const parts = description.split(`'${originalKeyword}'`);

    let context: string | undefined = undefined;
    if (actionType === 'start_session') {
        const contextMatch = description.match(/gericht op (het .*)/i);
        context = contextMatch ? contextMatch[1] : undefined;
    }

    return [
        { text: parts[0], isAction: false },
        { text: originalKeyword, isAction: true, actionType, context },
        { text: parts[1] || '', isAction: false }
    ];
};

const renderTask = (
    task: PlannerTask, 
    weekIndex: number, 
    taskIndex: number, 
    props: {
        onToggleTask?: StudyPlannerProps['onToggleTask'],
        onShowInfo?: StudyPlannerProps['onShowInfo'],
        onStartActionableTask?: StudyPlannerProps['onStartActionableTask'],
        readOnly: boolean
    }
) => {
    // Read-only view
    if (props.readOnly) {
         return (
            <div key={taskIndex} className={`planner-task ${task.completed ? 'completed' : ''}`}>
                <span className="task-status-icon">
                    {task.completed ? '✅' : '⚪️'}
                </span>
                <label>{task.description}</label>
            </div>
        );
    }
    
    // Interactive view starts here
    if (task.infoType && props.onShowInfo) {
        const icon = task.infoType === 'syllabus'
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M12 8V4M4 14v-4M20 10V6M7 17v-1M17 14v-4"/></svg>;
        
        return (
            <div key={taskIndex} className="info-task" onClick={() => props.onShowInfo!(task.infoType!)} role="button" tabIndex={0}>
                {icon}
                <span>{task.description}</span>
            </div>
        );
    }

    const parsedParts = parseDescriptionForAction(task.description);
    const actionPart = parsedParts.find(p => p.isAction);

    if (actionPart && !task.completed && props.onStartActionableTask) {
        return (
            <div key={taskIndex} className="planner-task">
                <span className="task-description">
                    {parsedParts.map((part, i) =>
                        part.isAction ? (
                            <button
                                key={i}
                                className="button-link-style"
                                onClick={() => props.onStartActionableTask!(weekIndex, taskIndex, part.actionType!, part.context)}
                            >
                                {part.text}
                            </button>
                        ) : (
                            <span key={i}>{part.text}</span>
                        )
                    )}
                </span>
            </div>
        );
    }


    return (
        <div key={taskIndex} className={`planner-task ${task.completed ? 'completed' : ''}`}>
            <input 
                type="checkbox" 
                id={`task-${weekIndex}-${taskIndex}`}
                checked={task.completed}
                onChange={() => props.onToggleTask && props.onToggleTask(weekIndex, taskIndex)}
            />
            <label htmlFor={`task-${weekIndex}-${taskIndex}`}>{task.description}</label>
        </div>
    );
};


const StudyPlanner: React.FC<StudyPlannerProps> = (props) => {
    const { examDate, setExamDate, studyPlan, generatePlan, updatePlan, isGenerating, onToggleTask, onReviewWeek, onShowInfo, onStartActionableTask, readOnly = false } = props;
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
            {!readOnly && <h3>Jouw Persoonlijke Studieplanner</h3>}
            {!studyPlan ? (
                 <div>
                    {!readOnly && generatePlan && setExamDate && examDate !== undefined && (
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
                    )}
                    {readOnly && (
                        <p style={{color: 'var(--subtle-text)'}}>Er is nog geen studieplan aangemaakt voor dit vak.</p>
                    )}
                 </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: readOnly ? '0px' : '24px' }}>
                       {daysLeft !== null && <span style={{fontWeight: 600, color: 'var(--primary-color)'}}>{daysLeft} {daysLeft === 1 ? 'dag' : 'dagen'} tot het examen!</span>}
                        <span style={{fontWeight: 600}}>{progressPercentage}% voltooid</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill skill-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div style={{maxHeight: '300px', overflowY: 'auto', marginTop: '16px', paddingRight: '10px'}}>
                        {studyPlan.weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="planner-week">
                                <h4 style={{marginBottom: '8px'}}>{week.theme} (Week {week.week_number})</h4>
                                {week.tasks.map((task, taskIndex) => renderTask(task, weekIndex, taskIndex, { onToggleTask, onShowInfo, onStartActionableTask, readOnly }))}
                                {!readOnly && onReviewWeek && (
                                    <button className="button-tertiary" onClick={() => onReviewWeek(week)} style={{marginTop: '8px', fontSize: '14px'}}>
                                        Review Mijn Week
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {!readOnly && updatePlan && (
                        <div style={{marginTop: '16px'}}>
                            <button onClick={updatePlan} className="button button-secondary" disabled={isGenerating}>
                                {isGenerating ? 'Updaten...' : 'Update Plan op Basis van Voortgang'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default StudyPlanner;
