import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chat, Modality, Type } from "@google/genai";
import Welcome from './components/Welcome.tsx';
import Dashboard from './components/Dashboard.tsx';
import QuestionCard from './components/QuestionCard.tsx';
import LoadingCard from './components/LoadingCard.tsx';
import FeedbackCard from './components/FeedbackCard.tsx';
import RepetitionCard from './components/RepetitionCard.tsx';
import ChatModal from './components/ChatModal.tsx';
import UpgradeModal from './components/UpgradeModal.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import ZenZoneModal from './components/ZenZoneModal.tsx';
import MindfulMoment from './components/MindfulMoment.tsx';
import ConceptExplanationModal from './components/ConceptExplanationModal.tsx';
import WeekReviewModal from './components/WeekReviewModal.tsx';
import MistakeAnalysisModal from './components/MistakeAnalysisModal.tsx';
import ThinkingProcessModal from './components/ThinkingProcessModal.tsx';
import MasterySessionModal from './components/MasterySessionModal.tsx';
import SessionProposalModal from './components/SessionProposalModal.tsx';
import InfoModal from './components/InfoModal.tsx';
import WeakSpotBoosterModal from './components/WeakSpotBoosterModal.tsx';
import GlobalStyles from './styles/GlobalStyles.tsx';
import { getInitialState, repetitionSchedule } from './utils/helpers.ts';
import { ai } from './api/gemini.ts';
import { 
    dutchExamQuestions, englishExamQuestions, natuurkundeExamQuestions, biologieExamQuestions, economieExamQuestions,
    FREE_QUESTION_IDS_NL, FREE_QUESTION_IDS_EN, FREE_QUESTION_IDS_NK, FREE_QUESTION_IDS_BIO, FREE_QUESTION_IDS_ECO
} from './data/data.ts';
import { examInfo } from './data/examInfo.ts';
import { allBadges } from './data/badges.ts';
import type { Question, MasteryScore, StudyPlan, Mistake, ChatMessage, PlannerTask, PlannerWeek, MasterySessionContent, SubjectSpecificData, SessionProposal, ActiveSession, Badge } from './data/data.ts';

const CHAT_MESSAGE_LIMIT_FREE = 10;
const DAILY_ANSWER_LIMIT_FREE = 15;
const MASTERY_THRESHOLD_BADGE = 0.85;

type Subject = 'Nederlands' | 'Engels' | 'Natuurkunde' | 'Biologie' | 'Economie';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('WELCOME');
  const [currentSubject, setCurrentSubject] = useState<Subject>('Nederlands');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialState('theme', 'light'));
  
  const initialSubjectData: { [key in Subject]: SubjectSpecificData } = {
    Nederlands: {
      masteryScores: {},
      answeredIds: [],
      mistakes: [],
      studyPlan: null,
      examDate: '',
    },
    Engels: {
      masteryScores: {},
      answeredIds: [],
      mistakes: [],
      studyPlan: null,
      examDate: '',
    },
    Natuurkunde: {
      masteryScores: {},
      answeredIds: [],
      mistakes: [],
      studyPlan: null,
      examDate: '',
    },
    Biologie: {
      masteryScores: {},
      answeredIds: [],
      mistakes: [],
      studyPlan: null,
      examDate: '',
    },
    Economie: {
      masteryScores: {},
      answeredIds: [],
      mistakes: [],
      studyPlan: null,
      examDate: '',
    },
  };

  const [subjectData, setSubjectData] = useState<{ [key in Subject]: SubjectSpecificData }>(() => getInitialState('subjectData', initialSubjectData));
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{isCorrect: boolean; question: Question | null; aiFeedback: string; mindsetTip: string; xpGained: number; userAnswer: string;}>({ isCorrect: false, question: null, aiFeedback: '', mindsetTip: '', xpGained: 0, userAnswer: '' });
  
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [studyStreak, setStudyStreak] = useState(() => getInitialState('studyStreak', 0));
  const [level, setLevel] = useState(() => getInitialState('level', 1));
  const [xp, setXp] = useState(() => getInitialState('xp', 0));
    
  const [repetitionQueue, setRepetitionQueue] = useState<Mistake[]>([]);
  const [currentRepetitionIndex, setCurrentRepetitionIndex] = useState(0);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  
  const [isPremium, setIsPremium] = useState(() => getInitialState('isPremium', false));
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [chatUsage, setChatUsage] = useState(() => getInitialState('chatUsage', { count: 0, date: new Date().toISOString().split('T')[0] }));
  const [dailyAnswers, setDailyAnswers] = useState(() => getInitialState('dailyAnswers', { count: 0, date: new Date().toISOString().split('T')[0] }));

  const chatLimitReached = !isPremium && chatUsage.count >= CHAT_MESSAGE_LIMIT_FREE;
  const answerLimitReached = !isPremium && dailyAnswers.count >= DAILY_ANSWER_LIMIT_FREE;

  const [isZenZoneOpen, setIsZenZoneOpen] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const [hasUsedZenZone, setHasUsedZenZone] = useState(false);
  const [sessionQuestionCount, setSessionQuestionCount] = useState(0);
  const [sessionMistakeCount, setSessionMistakeCount] = useState(0);
  
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [conceptExplanation, setConceptExplanation] = useState('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [conceptToExplain, setConceptToExplain] = useState<Question | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [weekToReview, setWeekToReview] = useState<PlannerWeek | null>(null);

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisContent, setAnalysisContent] = useState('');
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  
  const [isThinkingProcessModalOpen, setIsThinkingProcessModalOpen] = useState(false);
  const [thinkingProcessQuestion, setThinkingProcessQuestion] = useState<{question: Question, userAnswer: string} | null>(null);

  const [isMasterySessionModalOpen, setIsMasterySessionModalOpen] = useState(false);
  const [skillForMasterySession, setSkillForMasterySession] = useState<string | null>(null);
  const [masterySessionContent, setMasterySessionContent] = useState<MasterySessionContent | null>(null);
  const [isGeneratingMasterySession, setIsGeneratingMasterySession] = useState(false);
  
  const [isSessionProposalModalOpen, setIsSessionProposalModalOpen] = useState(false);
  const [proposedSession, setProposedSession] = useState<SessionProposal | null>(null);
  const [isGeneratingSession, setIsGeneratingSession] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState({ title: '', content: '' });
  
  const [consecutiveMistakes, setConsecutiveMistakes] = useState<{ [key: string]: number }>({});
  const [isWeakSpotModalOpen, setIsWeakSpotModalOpen] = useState(false);

  const [earnedBadges, setEarnedBadges] = useState<string[]>(() => getInitialState('earnedBadges', []));

  const xpForNextLevel = 100 * level;
  
  // Data accessors for current subject
  const currentData = subjectData[currentSubject];
  
  const questions = (() => {
    switch (currentSubject) {
        case 'Nederlands': return dutchExamQuestions;
        case 'Engels': return englishExamQuestions;
        case 'Natuurkunde': return natuurkundeExamQuestions;
        case 'Biologie': return biologieExamQuestions;
        case 'Economie': return economieExamQuestions;
        default: return [];
    }
  })();

  const freeQuestionIds = (() => {
    switch (currentSubject) {
        case 'Nederlands': return FREE_QUESTION_IDS_NL;
        case 'Engels': return FREE_QUESTION_IDS_EN;
        case 'Natuurkunde': return FREE_QUESTION_IDS_NK;
        case 'Biologie': return FREE_QUESTION_IDS_BIO;
        case 'Economie': return FREE_QUESTION_IDS_ECO;
        default: return [];
    }
  })();

  useEffect(() => { localStorage.setItem('subjectData', JSON.stringify(subjectData)); }, [subjectData]);
  useEffect(() => { localStorage.setItem('level', JSON.stringify(level)); }, [level]);
  useEffect(() => { localStorage.setItem('xp', JSON.stringify(xp)); }, [xp]);
  useEffect(() => { localStorage.setItem('isPremium', JSON.stringify(isPremium)); }, [isPremium]);
  useEffect(() => { localStorage.setItem('chatUsage', JSON.stringify(chatUsage)); }, [chatUsage]);
  useEffect(() => { localStorage.setItem('dailyAnswers', JSON.stringify(dailyAnswers)); }, [dailyAnswers]);
  useEffect(() => { localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges)); }, [earnedBadges]);
  useEffect(() => { 
    localStorage.setItem('theme', JSON.stringify(theme));
    document.body.setAttribute('data-theme', theme);
  }, [theme]);
  
  const addXp = useCallback((amount: number) => {
    setXp(currentXp => {
        let newXp = currentXp + amount;
        let newLevel = level;
        while (newXp >= 100 * newLevel) {
            newXp -= 100 * newLevel;
            newLevel++;
        }
        if (newLevel > level) {
             setLevel(newLevel);
        }
        return newXp;
    });
  }, [level]);

  const awardBadge = useCallback((badgeId: string) => {
    setEarnedBadges(prev => {
        if (!prev.includes(badgeId)) {
            // You could add a notification here later
            return [...prev, badgeId];
        }
        return prev;
    });
  }, []);
  
  const updateStudyStreak = useCallback(() => {
      const today = new Date().toDateString();
      const lastVisit = getInitialState('lastVisitDate', null);
      let currentStreak = getInitialState('studyStreak', 0);

      if (lastVisit !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastVisit === yesterday.toDateString()) {
              currentStreak++;
              addXp(25); 
          } else {
              currentStreak = 1;
          }
          localStorage.setItem('studyStreak', JSON.stringify(currentStreak));
          localStorage.setItem('lastVisitDate', JSON.stringify(today));
      }
      setStudyStreak(currentStreak);
      
      if (currentStreak >= 3) awardBadge('streak_3');
      if (currentStreak >= 7) awardBadge('streak_7');

  }, [addXp, awardBadge]);

  useEffect(() => {
      updateStudyStreak();
      const today = new Date().toISOString().split('T')[0];
      if (dailyAnswers.date !== today) {
          setDailyAnswers({ count: 0, date: today });
      }
  }, [updateStudyStreak, dailyAnswers.date]);

  const getTodayISO = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  }
  
  const calculateRepetitionQueue = useCallback(() => {
    const today = getTodayISO();
    const dueMistakes = currentData.mistakes.filter(m => m.nextReviewDate <= today);
    setRepetitionQueue(dueMistakes);
  }, [currentData.mistakes]);

  useEffect(() => {
    calculateRepetitionQueue();
  }, [calculateRepetitionQueue, currentSubject]);
  
  const handleWelcomeContinue = () => {
    setCurrentScreen('DASHBOARD');
  };

  const handleGenerateSessionProposal = async () => {
    if (answerLimitReached) {
        setIsUpgradeModalOpen(true);
        return;
    }
    setIsGeneratingSession(true);

    const weakSkills = Object.entries(currentData.masteryScores)
        .filter(([_, score]: [string, MasteryScore]) => score.total > 2)
        .map(([skill, score]: [string, MasteryScore]) => ({ skill, score: score.correct / score.total }))
        .sort((a, b) => a.score - b.score);

    const weakestSkill = weakSkills.length > 0 ? weakSkills[0] : null;

    const prompt = `Je bent een expert VWO ${currentSubject} docent en een motiverende studiecoach. Je taak is om een korte, gepersonaliseerde studiesessie voor te stellen aan een leerling.

    CONTEXT:
    - Zwakste vaardigheid van de leerling: "${weakestSkill?.skill || 'Nog te bepalen'}" (gebaseerd op een score van ${weakestSkill ? (weakestSkill.score * 100).toFixed(0) : 'N/A'}%)
    - Aantal fouten dat herhaald moet worden: ${repetitionQueue.length}

    TAAK:
    Genereer een voorstel voor een studiesessie in een JSON-object. Het moet motiverend en gericht zijn. Als er geen zwakke vaardigheid is, stel dan een algemene sessie voor.

    STRUCTUUR JSON-OBJECT:
    {
      "focusSkill": "De naam van de zwakste vaardigheid, of 'Algemene Oefening' als er geen zwakke vaardigheid is",
      "newQuestionsCount": EEN GETAL TUSSEN 3 EN 5 (kies 3 als er een zwakke vaardigheid is, anders 4),
      "introMessage": "Een korte, bemoedigende introductie voor de sessie (max 3 zinnen). Noem de focus-vaardigheid en het aantal vragen. Noem ook dat de herhalingen klaarliggen op het dashboard."
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        focusSkill: { type: Type.STRING },
                        newQuestionsCount: { type: Type.INTEGER },
                        introMessage: { type: Type.STRING },
                    },
                    required: ["focusSkill", "newQuestionsCount", "introMessage"]
                }
            }
        });
        const proposal = JSON.parse(response.text) as SessionProposal;
        setProposedSession(proposal);
        setIsSessionProposalModalOpen(true);
    } catch (e) {
        console.error("Failed to generate session proposal", e);
        alert("Er ging iets mis met het voorbereiden van je sessie. Probeer het opnieuw.");
    } finally {
        setIsGeneratingSession(false);
    }
  };

  const handleStartPersonalizedSession = () => {
    if (!proposedSession) return;

    if (!window.confirm("Zodra je de sessie start, kun je niet terug naar het dashboard totdat alle vragen zijn beantwoord. Weet je zeker dat je wilt beginnen?")) {
      return;
    }

    setSessionQuestionCount(0);
    setSessionMistakeCount(0);
    setHasUsedZenZone(false);

    const questionPool = isPremium ? questions : questions.filter(q => freeQuestionIds.includes(q.id));
    const answeredIdsSet = new Set(currentData.answeredIds);
    const availableQuestions = questionPool.filter(q => !answeredIdsSet.has(q.id));

    let sessionQuestions: Question[];
    if (proposedSession.focusSkill !== 'Algemene Oefening') {
        const focusQuestions = availableQuestions.filter(q => q.kern_vaardigheid === proposedSession.focusSkill);
        sessionQuestions = focusQuestions.slice(0, proposedSession.newQuestionsCount);
    } else {
        sessionQuestions = availableQuestions.sort(() => 0.5 - Math.random()).slice(0, proposedSession.newQuestionsCount);
    }

    if (sessionQuestions.length === 0) {
        if (!isPremium) setIsUpgradeModalOpen(true);
        else alert(`Er zijn geen nieuwe vragen meer beschikbaar voor ${proposedSession.focusSkill}. Reset je voortgang om opnieuw te oefenen.`);
        setIsSessionProposalModalOpen(false);
        return;
    }

    setActiveSession({
        questions: sessionQuestions,
        currentIndex: 0
    });
    setCurrentQuestion(sessionQuestions[0]);
    setCurrentScreen('QUESTION');
    setIsSessionProposalModalOpen(false);
  };
  
  const handleResetProgress = () => {
    if (window.confirm("Weet je zeker dat je al je voortgang wilt resetten? Dit kan niet ongedaan worden gemaakt.")) {
        localStorage.removeItem('subjectData');
        localStorage.removeItem('level');
        localStorage.removeItem('xp');
        localStorage.removeItem('studyStreak');
        localStorage.removeItem('isPremium');
        localStorage.removeItem('chatUsage');
        localStorage.removeItem('dailyAnswers');
        localStorage.removeItem('earnedBadges');
        
        setSubjectData(initialSubjectData);
        setLevel(1);
        setXp(0);
        setStudyStreak(0);
        setRepetitionQueue([]);
        setIsPremium(false);
        const today = new Date().toISOString().split('T')[0];
        setChatUsage({ count: 0, date: today });
        setDailyAnswers({ count: 0, date: today });
        setEarnedBadges([]);
    }
  };
  
  const handleGenerateOrUpdatePlan = async (isUpdate: boolean = false) => {
    if(!currentData.examDate) return;
    setIsGeneratingPlan(true);
    const today = new Date();
    const targetDate = new Date(currentData.examDate);
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const weakTopics = Object.entries(currentData.masteryScores)
        .filter(([_, score]: [string, MasteryScore]) => score.total > 0 && (score.correct / score.total) < 0.6)
        .map(([topic, _]) => topic);

    let prompt = "";
    const commonPromptStart = `Je bent een expert VWO ${currentSubject} docent en studiecoach. Je ontwerpt een interactief studieplan voor een leerling BINNEN een specifieke studie-app.

    **CONTEXT LEERLING:**
    - Vak: ${currentSubject}
    - Dagen tot examen: ${daysLeft}
    - Zwakste vaardigheden: ${weakTopics.join(', ') || 'Nog te bepalen, focus op algemene voorbereiding'}

    **BESCHIKBARE TOOLS IN DE APP:**
    - "Start Oefensessie": Start een gepersonaliseerde sessie met adaptieve vragen.
    - "Gespreide Herhaling": Herhaalt eerdere fouten op slimme momenten.
    - "Analyseer Mijn Fouten": Een AI-tool die patronen in gemaakte fouten analyseert.
    - "Genereer Oefenvragen": Een AI-tool om zelf vragen over een specifiek onderwerp te maken.
    - "GLOW AI": Een AI-chat om dieper op stof in te gaan.
    - "Zen Zone": Voor ontspannings- en focusoefeningen.

    **TAAK:**
    Maak een gestructureerd, week-per-week studieplan. Geef voor elke week een thema en 3-4 concrete, afvinkbare taken.

    **BELANGRIJKE REGELS:**
    1.  **HOUD DE GEBRUIKER IN DE APP:** Alle taken moeten direct uitvoerbaar zijn met de hierboven genoemde tools.
    2.  **GEEN EXTERNE LINKS/BRONNEN:** Verwijs NIET naar externe websites, studieboeken, of andere bronnen. De app is het enige platform.
    3.  **WEES CONCREET:** Formuleer taken die direct naar een app-functie verwijzen. Bijvoorbeeld: "Gebruik de 'Analyseer Mijn Fouten' tool om je zwakke plekken te vinden." in plaats van "Denk na over je fouten."
    4.  **INTEGREER DE ZWAKKE VAARDIGHEDEN:** Baseer de taken op de zwakke vaardigheden van de leerling.`;
    
    if (isUpdate) {
        prompt = `${commonPromptStart}\n\n**UPDATE-TAAK:** De leerling heeft al een studieplan, maar wil het updaten op basis van recente prestaties. Pas het bestaande plan aan of stel extra taken voor de komende weken voor om op de zwakke punten te focussen. Geef het VOLLEDIGE, bijgewerkte plan terug in hetzelfde JSON-formaat.`;
    } else {
        prompt = `${commonPromptStart}\n\n**OUTPUT FORMAAT (JSON):** Geef een JSON-object terug met een "weeks" array, waarin elke week een thema en een lijst met taken (als "description") heeft.`;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weeks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    week_number: { type: Type.INTEGER },
                                    theme: { type: Type.STRING },
                                    tasks: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                description: { type: Type.STRING },
                                            },
                                            required: ["description"]
                                        }
                                    }
                                },
                                required: ["week_number", "theme", "tasks"]
                            }
                        }
                    },
                    required: ["weeks"]
                }
            }
        });
        const planData = JSON.parse(response.text);

        const infoTasks: PlannerTask[] = [
            { description: 'Bekijk de officiële exameninformatie en syllabi', completed: false, xpAwarded: false, infoType: 'syllabus' },
            { description: 'Overzicht van examenonderdelen en weging', completed: false, xpAwarded: false, infoType: 'components' }
        ];

        if (planData.weeks && planData.weeks.length > 0) {
            planData.weeks[0].tasks.unshift(...infoTasks);
        }

        const interactivePlan = {
            weeks: planData.weeks.map((week: PlannerWeek) => ({
                ...week,
                tasks: week.tasks.map((task: PlannerTask) => ({ ...task, completed: false, xpAwarded: false, ...task }))
            }))
        };
        setSubjectData(prev => ({...prev, [currentSubject]: {...prev[currentSubject], studyPlan: interactivePlan }}));
    } catch(e) {
        console.error("Failed to generate study plan", e);
        alert("Er is iets misgegaan bij het maken van je plan. Probeer het later opnieuw.");
    } finally {
        setIsGeneratingPlan(false);
    }
  };
  
  const handleToggleTask = (weekIndex: number, taskIndex: number) => {
    setSubjectData(prev => {
        const newPlan = JSON.parse(JSON.stringify(prev[currentSubject].studyPlan));
        if (!newPlan) return prev;
        const task = newPlan.weeks[weekIndex].tasks[taskIndex];
        
        if (!task.xpAwarded && !task.completed) {
            addXp(10);
            task.xpAwarded = true;
        }
        task.completed = !task.completed;
        return {...prev, [currentSubject]: {...prev[currentSubject], studyPlan: newPlan}};
    });
  };

  const handleReviewWeek = async (week: PlannerWeek) => {
    setWeekToReview(week);
    setIsReviewModalOpen(true);
    setIsGeneratingReview(true);
    setReviewContent('');
    
    const completedTasks = week.tasks.filter(t => t.completed);
    const prompt = `Ik ben een VWO-leerling die studeert voor het ${currentSubject} examen. Jij bent mijn motiverende studiecoach. Geef korte, positieve en persoonlijke feedback op mijn afgelopen studieweek. Wees bemoedigend.
    - Week Thema: "${week.theme}"
    - Voltooide taken: ${completedTasks.length} van de ${week.tasks.length}.
    - Omschrijving voltooide taken: ${completedTasks.map(t => t.description).join(', ') || 'Geen'}
    
    Begin met een compliment, geef een korte reflectie en eindig met een motiverende zin voor de komende week. Houd de totale lengte op ongeveer 3-4 zinnen.`;

    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setReviewContent(response.text);
    } catch (error) {
        console.error("Error generating week review:", error);
        setReviewContent("Ik kon je week nu niet beoordelen, maar je hebt hard gewerkt en dat is wat telt. Ga zo door!");
    } finally {
        setIsGeneratingReview(false);
    }
  };
  
  const selectNextQuestion = (current: Question, isCorrect: boolean): Question | null => {
      let targetDifficulty = current.difficulty;
      if (isCorrect && targetDifficulty < 3) {
          targetDifficulty++;
      } else if (!isCorrect && targetDifficulty > 1) {
          targetDifficulty--;
      }
      
      const newAnsweredIds = new Set(currentData.answeredIds).add(current.id);

      const questionPool = isPremium ? questions : questions.filter(q => freeQuestionIds.includes(q.id));
      const availableQuestions = questionPool.filter(q => !newAnsweredIds.has(q.id));
      if(availableQuestions.length === 0) return null;

      let next = availableQuestions.find(q => q.difficulty === targetDifficulty);
      if (!next) next = availableQuestions.sort((a,b) => Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty))[0];

      return next;
  }

  const handleGetHintForQuestion = async (): Promise<string> => {
      if (!currentQuestion) return "Geen vraag geselecteerd.";
      try {
          const prompt = `Geef een korte, subtiele hint voor de volgende VWO ${currentSubject} examenvraag. GEEF NIET het antwoord, maar stuur de leerling in de goede richting. Bijvoorbeeld door te focussen op een sleutelwoord in de vraag of een specifiek deel van de tekst.
          
          VRAAG: "${currentQuestion.vraag_tekst}"
          PASSAGE: "${currentQuestion.vraag_passage || ''}"
          CORRECTIEMODEL (ter context, niet onthullen): "${currentQuestion.correctie_model}"
          
          HINT:`;
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { thinkingConfig: { thinkingBudget: 0 } } });
          return response.text;
      } catch (error) {
          console.error("Error getting hint:", error);
          return "Kon op dit moment geen hint ophalen.";
      }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion) return;

    if (answerLimitReached) {
        setIsUpgradeModalOpen(true);
        return;
    }

    setCurrentScreen('LOADING');

    try {
        const prompt = `Je bent een ZEER STRIKTE AI-examinator voor het Nederlandse VWO ${currentSubject} examen. Je primaire taak is om het antwoord van een leerling te vergelijken met het officiële correctiemodel. Wees kritisch: het is beter om een goed antwoord ten onrechte af te keuren dan een fout antwoord goed te keuren.
        **Regels voor Beoordeling:**
        1. **Sleutelwoorden zijn niet genoeg:** Een antwoord dat alleen een sleutelwoord noemt zonder de volledige context of uitleg uit het correctiemodel is **ALTIJD FOUT**.
        2. **Volledigheid is vereist:** Het antwoord van de leerling moet de volledige redenering of alle kerncomponenten van het correctiemodel bevatten om als 'correct' te worden beschouwd.
        3. **Geen aannames:** Beoordeel alleen wat er letterlijk geschreven is.
        
        **Input:**
        VRAAG: "${currentQuestion.vraag_tekst}"
        CORRECTIEMODEL: "${currentQuestion.correctie_model}"
        ANTWOORD LEERLING: "${answer}"

        **Output Formaat (JSON):**
        Geef een JSON-object terug met de volgende velden:
        1. "is_correct": boolean.
        2. "feedback": string. Korte, directe feedback. Als het antwoord fout is omdat het onvolledig is, leg dit dan uit.
        3. "mindset_tip": string. ALS het antwoord FOUT is, geef een korte, bemoedigende mindset-tip. ALS het antwoord GOED is, laat dit veld leeg ("").`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        is_correct: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                        mindset_tip: { type: Type.STRING }
                    },
                    required: ["is_correct", "feedback", "mindset_tip"]
                }
            }
        });
        
        if (!isPremium) {
            setDailyAnswers(prev => ({ ...prev, count: prev.count + 1 }));
        }

        const result = JSON.parse(response.text.trim());
        const { is_correct, feedback, mindset_tip } = result;
        const xpGained = is_correct ? 15 : 5;
        addXp(xpGained);

        if (!is_correct) {
            setSessionMistakeCount(prev => prev + 1);
        }
        
        let nextQ: Question | null = null;
        if (activeSession) {
            const nextIndex = activeSession.currentIndex + 1;
            if (nextIndex < activeSession.questions.length) {
                nextQ = activeSession.questions[nextIndex];
            }
        } else {
            // Fallback to old adaptive logic if not in a personalized session
            nextQ = selectNextQuestion(currentQuestion, is_correct);
        }
        setNextQuestion(nextQ);

        setLastAnswer({ isCorrect: is_correct, question: currentQuestion, aiFeedback: feedback, mindsetTip: mindset_tip, xpGained, userAnswer: answer });

        setSubjectData(prev => {
            const skill = currentQuestion.kern_vaardigheid;
            const currentScores = prev[currentSubject].masteryScores;
            const currentSkillScore = currentScores[skill] || { correct: 0, total: 0 };
            const newScores = {
              ...currentScores,
              [skill]: {
                correct: currentSkillScore.correct + (is_correct ? 1 : 0),
                total: currentSkillScore.total + 1,
              },
            };
            
            // Badge logic for mastery
            const updatedScore = newScores[skill];
            const masteryPercentage = updatedScore.total > 0 ? updatedScore.correct / updatedScore.total : 0;
            if (masteryPercentage >= MASTERY_THRESHOLD_BADGE) {
                if (skill === 'Argumentatieanalyse') awardBadge('master_analyst');
                if (skill === 'Tekstbegrip') awardBadge('master_comprehension');
            }
  
            return {
              ...prev,
              [currentSubject]: {
                ...prev[currentSubject],
                masteryScores: newScores,
                answeredIds: [...prev[currentSubject].answeredIds, currentQuestion.id]
              }
            };
        });
        
        // Weak-spot booster logic
        const skill = currentQuestion.kern_vaardigheid;
        if (!is_correct) {
            const newCount = (consecutiveMistakes[skill] || 0) + 1;
            setConsecutiveMistakes(prev => ({...prev, [skill]: newCount}));
            if (newCount >= 3) {
                setSkillForMasterySession(skill);
                setIsWeakSpotModalOpen(true);
                setConsecutiveMistakes(prev => ({...prev, [skill]: 0})); // Reset after triggering
            }
        } else {
             setConsecutiveMistakes(prev => ({...prev, [skill]: 0}));
        }

        if (!is_correct) {
            setSubjectData(prev => {
                const currentMistakes = prev[currentSubject].mistakes;
                if (currentMistakes.some(m => m.questionId === currentQuestion.id)) {
                    return prev; 
                }
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0,0,0,0);
                
                const newMistake = {
                    questionId: currentQuestion.id,
                    userAnswer: answer,
                    aiFeedback: feedback,
                    repetitionLevel: 0,
                    nextReviewDate: tomorrow.toISOString().split('T')[0]
                };

                return {
                    ...prev,
                    [currentSubject]: {
                        ...prev[currentSubject],
                        mistakes: [...currentMistakes, newMistake]
                    }
                };
            });
        }

    } catch (error) {
        console.error("Error evaluating answer:", error);
        addXp(5);
        setLastAnswer({ 
            isCorrect: false, 
            question: currentQuestion, 
            aiFeedback: 'Er was een fout bij de AI-beoordeling. Controleer je antwoord handmatig met het correctiemodel en probeer het later opnieuw.',
            mindsetTip: "Soms faalt de technologie, maar je leerproces niet. Een goed moment om diep adem te halen en opnieuw te focussen.",
            xpGained: 5,
            userAnswer: answer
        });
        const nextQ = selectNextQuestion(currentQuestion, false);
        setNextQuestion(nextQ);
    } finally {
        setCurrentScreen('FEEDBACK');
        setSessionQuestionCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
      if (answerLimitReached && !activeSession) {
          setIsUpgradeModalOpen(true);
          return;
      }
      if (activeSession) {
        setActiveSession(prev => prev ? ({ ...prev, currentIndex: prev.currentIndex + 1 }) : null);
      }
      if (!isPremium && sessionQuestionCount > 0 && sessionQuestionCount % 5 === 0) {
          setCurrentScreen('MINDFUL_MOMENT');
      } else {
          setCurrentQuestion(nextQuestion);
          setNextQuestion(null);
          setCurrentScreen('QUESTION');
      }
  }
  
  const handleContinueFromMindfulMoment = () => {
      setCurrentQuestion(nextQuestion);
      setNextQuestion(null);
      setCurrentScreen('QUESTION');
  }

  const handleDashboard = () => {
      if (activeSession && sessionMistakeCount === 0 && activeSession.questions.length >= 5) {
        awardBadge('flawless_session');
      }
      setActiveSession(null); // Ensure session state is cleared
      setCurrentScreen('DASHBOARD');
  }
  
  const handleStartRepetition = () => {
      if (repetitionQueue.length > 0) {
          setCurrentRepetitionIndex(0);
          setCurrentScreen('REPETITION');
      }
  }
  
  const handleGotIt = (mistakeQuestionId: number) => {
      addXp(20); 
      setSubjectData(prev => {
        const newMistakes = prev[currentSubject].mistakes.map(mistake => {
            if (mistake.questionId === mistakeQuestionId) {
                const newLevel = mistake.repetitionLevel + 1;
                const daysToAdd = repetitionSchedule[Math.min(newLevel, repetitionSchedule.length -1)];
                const nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + daysToAdd);
                nextDate.setHours(0,0,0,0);
                
                return {
                    ...mistake,
                    repetitionLevel: newLevel,
                    nextReviewDate: nextDate.toISOString().split('T')[0]
                };
            }
            return mistake;
        });
        return { ...prev, [currentSubject]: { ...prev[currentSubject], mistakes: newMistakes } };
      });

      if (currentRepetitionIndex < repetitionQueue.length - 1) {
          setCurrentRepetitionIndex(prev => prev + 1);
      } else {
          setCurrentScreen('DASHBOARD');
      }
  };
  
  const handleOpenChat = (context: {type: string; data: any} | null = null, mode: 'default' | 'question_generation' = 'default') => {
    let initialHistory: ChatMessage[] = [];
    let systemInstruction = "";

    if (mode === 'question_generation') {
        systemInstruction = `Je bent GLOW AI, een examengenerator. Je primaire taak is om realistische VWO ${currentSubject} examenvragen te genereren over onderwerpen die de leerling aandraagt. Vraag eerst naar het onderwerp en het gewenste vraagtype (bijv. open, meerkeuze, etc.). Genereer dan één vraag. Wacht op het antwoord van de leerling voordat je het correctiemodel en een korte uitleg geeft. Houd de interactie gericht op het oefenen met de gegenereerde vraag.`;
        initialHistory.push({ role: 'model', text: `Hoi! Ik kan nieuwe oefenvragen voor je maken. Welk onderwerp of welke vaardigheid in ${currentSubject} wil je oefenen?` });
    } else { 
        systemInstruction = "Je bent GLOW AI. Je gebruikt de Socratische methode. Je primaire doel is om de VWO-leerling door hun eigen denkproces te leiden. GEEF NOOIT het directe antwoord. Stel in plaats daarvan gerichte, open vragen die hen helpen hun eigen denkfouten te ontdekken en tot het juiste antwoord te komen. Breek het probleem op in kleinere stukjes. Als een leerling vraagt 'Waarom is mijn antwoord fout?', antwoord dan met een vraag als 'Laten we samen naar de vraag kijken. Wat is het belangrijkste sleutelwoord in de vraag?' of 'Welk deel van het correctiemodel begrijp je niet helemaal?'. Wees geduldig, bemoedigend en focus op het leerproces, niet op het resultaat.";

        if (context && context.type === 'feedback') {
            const { question, userAnswer, aiFeedback } = context.data;
            initialHistory.push({ role: 'user', text: `Ik heb een vraag over een oefenopgave die ik net heb gemaakt.` });
            initialHistory.push({ role: 'model', text: `Natuurlijk! Laten we er samen naar kijken. Om je het beste te helpen, hier is de context:\n\n**Vraag:** "${question.vraag_tekst}"\n**Jouw antwoord:** "${userAnswer}"\n**Mijn feedback:** "${aiFeedback}"\n\nWat was je eerste gedachte toen je deze vraag las?` });
        } else {
            initialHistory.push({ role: 'model', text: `Hoi! Ik ben GLOW AI. Waar loop je tegenaan?` });
        }
    }

    chatSession.current = ai.chats.create({ 
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: initialHistory.map(m => ({ role: m.role, parts: [{text: m.text}] }))
    });
    
    const today = new Date().toISOString().split('T')[0];
    if (chatUsage.date !== today) {
      setChatUsage({ count: 0, date: today });
    }

    setChatHistory(initialHistory);
    setIsChatOpen(true);
  };
  
  const handleCloseChat = () => {
      setIsChatOpen(false);
      setChatHistory([]);
      chatSession.current = null;
  }
  
  const handleSendMessage = async (messageText: string) => {
      if (chatLimitReached) {
          setIsUpgradeModalOpen(true);
          return;
      }
      
      const newUserMessage: ChatMessage = { role: 'user', text: messageText };
      setChatHistory(prev => [...prev, newUserMessage]);
      setIsSendingMessage(true);
      
      if (!isPremium) {
          setChatUsage(prev => ({ ...prev, count: prev.count + 1 }));
      }

      try {
          if (!chatSession.current) throw new Error("Chat session not initialized.");
          const response = await chatSession.current.sendMessage({ message: messageText });
          const modelResponse: ChatMessage = { role: 'model', text: response.text };
          setChatHistory(prev => [...prev, modelResponse]);
      } catch (error) {
          console.error("Chat error:", error);
          const errorMessage: ChatMessage = { role: 'model', text: "Oeps, er ging iets mis. Probeer het opnieuw." };
          setChatHistory(prev => [...prev, errorMessage]);
      } finally {
          setIsSendingMessage(false);
          if (!isPremium && chatUsage.count + 1 >= CHAT_MESSAGE_LIMIT_FREE) {
              const limitMessage: ChatMessage = { role: 'system', text: `Je hebt je dagelijkse limiet van ${CHAT_MESSAGE_LIMIT_FREE} gratis berichten bereikt. Upgrade naar GLOW PRO voor onbeperkt chatten.` };
              setChatHistory(prev => [...prev, limitMessage]);
          }
      }
  };
  
  const handleGenerateAffirmation = async () => {
    setIsGeneratingAffirmation(true);
    setAffirmation('');
    try {
        const prompt = "Geef me een korte, krachtige en bemoedigende positieve affirmatie (max 2 zinnen). Het is voor een VWO-leerling die een korte pauze neemt van het studeren voor de eindexamens. De toon moet ondersteunend en kalmerend zijn.";
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { thinkingConfig: { thinkingBudget: 0 } } });
        setAffirmation(response.text);
    } catch (error) {
        console.error("Error generating affirmation:", error);
        setAffirmation("Onthoud dat elke stap, hoe klein ook, vooruitgang is. Je kunt dit.");
    } finally {
        setIsGeneratingAffirmation(false);
    }
  };

  const handleStartUpgrade = () => {
      setIsUpgradeModalOpen(false);
      setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
      setIsPremium(true);
      setIsPaymentModalOpen(false);
  };

  const handleExplainConcept = async (question: Question | null) => {
    if (!question) return;
    setConceptToExplain(question);
    setIsConceptModalOpen(true);
    setIsGeneratingExplanation(true);
    setConceptExplanation('');

    try {
        const prompt = `Ik ben een VWO-leerling. Leg helder en stapsgewijs het concept "${question.kern_vaardigheid}" uit, zoals het van toepassing is op het ${currentSubject} examen. Gebruik eenvoudige taal, een duidelijke analogie en geef een kort, simpel voorbeeld dat NIET uit een examen komt. Het doel is om de basis van het concept te begrijpen. Structureer het antwoord met duidelijke kopjes.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setConceptExplanation(response.text);
    } catch (error) {
        console.error("Error generating concept explanation:", error);
        setConceptExplanation("Oeps, ik kon nu geen uitleg genereren. Probeer het later opnieuw.");
    } finally {
        setIsGeneratingExplanation(false);
    }
  };

  const handleExplainConceptEli5 = async (originalExplanation: string, conceptName: string): Promise<string> => {
    try {
        const prompt = `Leg de volgende uitleg over "${conceptName}" uit alsof ik 5 jaar oud ben. Gebruik een hele simpele, alledaagse analogie en vermijd jargon.
        
        Originele Uitleg:
        "${originalExplanation}"
        
        Simpele Uitleg:`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { thinkingConfig: { thinkingBudget: 0 } } });
        return response.text;
    } catch (error) {
        console.error("Error generating ELI5 explanation:", error);
        return "Oeps, ik kon het nu niet verder versimpelen. Probeer het later opnieuw!";
    }
  };

  const handleAnalyzeMistakes = async () => {
    setIsAnalysisModalOpen(true);
    setIsGeneratingAnalysis(true);
    setAnalysisContent('');
    awardBadge('first_analysis');

    const mistakesSummary = currentData.mistakes.map(m => {
        const q = questions.find(q => q.id === m.questionId);
        return {
            skill: q?.kern_vaardigheid,
            question: q?.vraag_tekst,
            your_answer: m.userAnswer,
            feedback: m.aiFeedback
        };
    });

    const prompt = `Je bent een expert VWO ${currentSubject} docent. Analyseer de volgende fouten van een leerling. Identificeer het belangrijkste, overkoepelende patroon in de fouten. Geef een korte, duidelijke analyse (max 2 zinnen) en sluit af met één concreet, praktisch en bemoedigend advies (max 2 zinnen) om dit specifieke probleem aan te pakken.
    
    Fouten:
    ${JSON.stringify(mistakesSummary, null, 2)}
    
    Analyse:`;

    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setAnalysisContent(response.text);
    } catch (error) {
        console.error("Error generating mistake analysis:", error);
        setAnalysisContent("Ik kon je fouten op dit moment niet analyseren. Probeer het later opnieuw. Onthoud dat elke fout een leermoment is!");
    } finally {
        setIsGeneratingAnalysis(false);
    }
  };
  
  const handleOpenThinkingProcessModal = () => {
    if (lastAnswer.question) {
        setThinkingProcessQuestion({ question: lastAnswer.question, userAnswer: lastAnswer.userAnswer });
        setIsThinkingProcessModalOpen(true);
    }
  };

  const handleAnalyzeThinkingProcess = async (reflections: { deconstruction: string; reasoning: string }): Promise<string> => {
    if (!thinkingProcessQuestion) return "Kon het denkproces niet analyseren omdat de context ontbreekt.";

    const { question, userAnswer } = thinkingProcessQuestion;
    const { deconstruction, reasoning } = reflections;
    
    const prompt = `Je bent een expert metacognitiecoach voor VWO-leerlingen die ${currentSubject} studeren. Je doel is niet om het antwoord uit te leggen, maar om het denkproces van de leerling te analyseren op basis van hun reflectie. Wees bemoedigend en focus op het proces.
    
    CONTEXT:
    - VRAAG: "${question.vraag_tekst}"
    - PASSAGE: "${question.vraag_passage || 'Geen'}"
    - CORRECTIEMODEL: "${question.correctie_model}"
    - FOUT ANTWOORD VAN LEERLING: "${userAnswer}"
    
    REFLECTIE VAN LEERLING:
    1. Wat de leerling denkt dat de vraag vraagt: "${deconstruction}"
    2. De logische stappen die de leerling nam: "${reasoning}"
    
    ANALYSEER HET DENKPROCES:
    Identificeer waar de logica van de leerling afweek. Geef een korte, duidelijke analyse (2-3 zinnen) van het denkproces. Sluit af met 1-2 concrete, praktische en bemoedigende adviezen om hun aanpak voor dit type vraag te verbeteren. Spreek de leerling direct aan (met 'je'). Focus op het *hoe*, niet op het *wat*.`;

    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error generating thinking process analysis:", error);
        return "Ik kon je denkproces op dit moment niet analyseren. Probeer het later opnieuw. Je reflectie is al een grote stap in de goede richting!";
    }
  };

  const handleStartMasterySession = () => {
      if(skillForMasterySession) {
          setIsMasterySessionModalOpen(true);
      }
  }

  const handleGenerateMasterySessionContent = async (skillName: string): Promise<MasterySessionContent | null> => {
      setIsGeneratingMasterySession(true);
      try {
        const prompt = `Je bent een expert VWO ${currentSubject} examencoach. Een leerling heeft moeite met de vaardigheid: "${skillName}". Genereer een complete, gestructureerde "Meesterschapssessie" om hen te helpen. Geef een enkel JSON-object terug met de exacte structuur hieronder.

        {
          "explanation": "Een duidelijke, beknopte uitleg van wat '${skillName}' is, met een eenvoudige analogie. (max 3-4 zinnen)",
          "guided_example": {
            "question": "Een nieuwe, simpele voorbeeldvraag voor '${skillName}'.",
            "thinking_process": "Een stapsgewijze uitleg van hoe je deze vraag oplost. Begin met 'Stap 1:', 'Stap 2:', etc. Wees expliciet over de logica."
          },
          "practice_questions": [
            {
              "question": "Een nieuwe, simpele, meerkeuze-oefenvraag voor '${skillName}'.",
              "options": ["Optie A", "Optie B", "Optie C", "Optie D"],
              "correct_option": "De correcte optietekst",
              "feedback_correct": "Korte feedback voor wanneer de leerling correct antwoordt.",
              "feedback_incorrect": "Korte, nuttige feedback voor wanneer de leerling incorrect antwoordt, met uitleg over de veelgemaakte fout."
            },
            {
              "question": "Een tweede nieuwe, simpele, meerkeuze-oefenvraag voor '${skillName}'.",
              "options": ["Optie A", "Optie B", "Optie C", "Optie D"],
              "correct_option": "De correcte optietekst",
              "feedback_correct": "Korte feedback voor wanneer de leerling correct antwoordt.",
              "feedback_incorrect": "Korte, nuttige feedback voor wanneer de leerling incorrect antwoordt, met uitleg over de veelgemaakte fout."
            }
          ],
          "final_tip": "Een enkele, toepasbare strategietip voor de leerling om te onthouden voor '${skillName}'-vragen in de toekomst. (max 2 zinnen)"
        }`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        explanation: { type: Type.STRING },
                        guided_example: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                thinking_process: { type: Type.STRING }
                            },
                            required: ["question", "thinking_process"]
                        },
                        practice_questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correct_option: { type: Type.STRING },
                                    feedback_correct: { type: Type.STRING },
                                    feedback_incorrect: { type: Type.STRING }
                                },
                                required: ["question", "options", "correct_option", "feedback_correct", "feedback_incorrect"]
                            }
                        },
                        final_tip: { type: Type.STRING }
                    },
                    required: ["explanation", "guided_example", "practice_questions", "final_tip"]
                }
            }
        });

        const content = JSON.parse(response.text) as MasterySessionContent;
        setMasterySessionContent(content);
        return content;
      } catch (error) {
          console.error("Error generating mastery session content:", error);
          return null;
      } finally {
          setIsGeneratingMasterySession(false);
      }
  };

  const handleOpenZenZone = () => {
      if (!isPremium && hasUsedZenZone) {
          alert("Je kunt de Zen Zone één keer per studiesessie gebruiken in de gratis versie. Start een nieuwe sessie om het opnieuw te gebruiken.");
          return;
      }
      setIsZenZoneOpen(true);
      setHasUsedZenZone(true);
  };
  
  const handleShowInfo = (infoType: 'syllabus' | 'components') => {
      const info = examInfo[currentSubject][infoType];
      setInfoModalData({ title: info.title, content: info.content });
      setIsInfoModalOpen(true);
  };

  const FOCUS_SCREENS = ['QUESTION', 'LOADING', 'FEEDBACK', 'REPETITION', 'MINDFUL_MOMENT'];
  const isFocusMode = FOCUS_SCREENS.includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return <Welcome onContinue={handleWelcomeContinue} />;
      case 'QUESTION':
        return currentQuestion && <QuestionCard question={currentQuestion} allQuestions={questions} onSubmit={handleSubmitAnswer} onGetHint={handleGetHintForQuestion} />;
      case 'LOADING':
        return <LoadingCard />;
      case 'FEEDBACK':
        return <FeedbackCard 
                    question={lastAnswer.question} 
                    isCorrect={lastAnswer.isCorrect} 
                    onNext={nextQuestion ? handleNext : null} 
                    onDashboard={handleDashboard}
                    feedbackData={lastAnswer}
                    onOpenChat={() => handleOpenChat({ type: 'feedback', data: { question: lastAnswer.question, userAnswer: lastAnswer.userAnswer, aiFeedback: lastAnswer.aiFeedback }})}
                    onExplainConcept={() => handleExplainConcept(lastAnswer.question)}
                    onAnalyzeThinkingProcess={handleOpenThinkingProcessModal}
                    answerLimitReached={answerLimitReached && nextQuestion !== null}
                    onUpgrade={() => setIsUpgradeModalOpen(true)}
                />;
      case 'REPETITION':
        return <RepetitionCard 
                    mistake={repetitionQueue[currentRepetitionIndex]}
                    allQuestions={questions}
                    onGotIt={handleGotIt}
                    onDashboard={handleDashboard}
                    currentIndex={currentRepetitionIndex}
                    totalMistakes={repetitionQueue.length}
                />;
      case 'MINDFUL_MOMENT':
          return <MindfulMoment onContinue={handleContinueFromMindfulMoment} />;
      case 'DASHBOARD':
      default:
        return <Dashboard 
                    masteryScores={currentData.masteryScores} 
                    onStartSession={handleGenerateSessionProposal}
                    isGeneratingSession={isGeneratingSession}
                    onReset={handleResetProgress}
                    studyStreak={studyStreak}
                    level={level}
                    xp={xp}
                    xpForNextLevel={xpForNextLevel}
                    examDate={currentData.examDate}
                    setExamDate={(date) => setSubjectData(prev => ({...prev, [currentSubject]: {...prev[currentSubject], examDate: date}}))}
                    studyPlan={currentData.studyPlan}
                    generatePlan={() => handleGenerateOrUpdatePlan(false)}
                    updatePlan={() => handleGenerateOrUpdatePlan(true)}
                    isGeneratingPlan={isGeneratingPlan}
                    onToggleTask={handleToggleTask}
                    onReviewWeek={handleReviewWeek}
                    onShowInfo={handleShowInfo}
                    repetitionQueue={repetitionQueue}
                    onStartRepetition={handleStartRepetition}
                    onOpenChat={() => handleOpenChat()}
                    onOpenChatForQuestionGeneration={() => handleOpenChat(null, 'question_generation')}
                    onOpenZenZone={handleOpenZenZone}
                    isPremium={isPremium}
                    onUpgrade={() => setIsUpgradeModalOpen(true)}
                    onAnalyzeMistakes={handleAnalyzeMistakes}
                    hasMistakes={currentData.mistakes.length > 0}
                    currentSubject={currentSubject}
                    onSubjectChange={setCurrentSubject}
                    answerLimitReached={answerLimitReached}
                    dailyAnswers={dailyAnswers}
                    theme={theme}
                    setTheme={setTheme}
                    allBadges={allBadges}
                    earnedBadges={earnedBadges}
                />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className={isFocusMode ? 'focus-mode' : ''}>
        {renderScreen()}
      </div>
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={handleCloseChat} 
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isSending={isSendingMessage}
        chatLimitReached={chatLimitReached}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleStartUpgrade}
       />
       <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
       />
       <ZenZoneModal
        isOpen={isZenZoneOpen}
        onClose={() => setIsZenZoneOpen(false)}
        affirmation={affirmation}
        onGenerateAffirmation={handleGenerateAffirmation}
        isGenerating={isGeneratingAffirmation}
       />
       <ConceptExplanationModal
            isOpen={isConceptModalOpen}
            onClose={() => setIsConceptModalOpen(false)}
            conceptName={conceptToExplain?.kern_vaardigheid || ''}
            explanation={conceptExplanation}
            isLoading={isGeneratingExplanation}
            onExplainEli5={handleExplainConceptEli5}
        />
        <WeekReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            weekTheme={weekToReview?.theme || ''}
            reviewContent={reviewContent}
            isLoading={isGeneratingReview}
        />
        <MistakeAnalysisModal
            isOpen={isAnalysisModalOpen}
            onClose={() => setIsAnalysisModalOpen(false)}
            analysisContent={analysisContent}
            isLoading={isGeneratingAnalysis}
        />
        <ThinkingProcessModal
            isOpen={isThinkingProcessModalOpen}
            onClose={() => { setIsThinkingProcessModalOpen(false); setThinkingProcessQuestion(null); }}
            questionContext={thinkingProcessQuestion}
            onAnalyze={handleAnalyzeThinkingProcess}
        />
        <MasterySessionModal
            isOpen={isMasterySessionModalOpen}
            onClose={() => { setIsMasterySessionModalOpen(false); setSkillForMasterySession(null); setMasterySessionContent(null); }}
            skillName={skillForMasterySession || ''}
            onGenerate={handleGenerateMasterySessionContent}
            isGenerating={isGeneratingMasterySession}
            initialContent={masterySessionContent}
        />
        <SessionProposalModal
            isOpen={isSessionProposalModalOpen}
            onClose={() => setIsSessionProposalModalOpen(false)}
            onStart={handleStartPersonalizedSession}
            proposal={proposedSession}
        />
        <InfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            title={infoModalData.title}
            content={infoModalData.content}
        />
        <WeakSpotBoosterModal
            isOpen={isWeakSpotModalOpen}
            onClose={() => setIsWeakSpotModalOpen(false)}
            onStart={() => {
                setIsWeakSpotModalOpen(false);
                handleStartMasterySession();
            }}
            skillName={skillForMasterySession || ''}
        />
    </>
  );
};

export default App;