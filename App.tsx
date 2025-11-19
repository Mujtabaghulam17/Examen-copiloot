
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat, Modality, Type } from "@google/genai";
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
import AnalysisModal from './components/MistakeAnalysisModal.tsx';
import ThinkingProcessModal from './components/ThinkingProcessModal.tsx';
import MasterySessionModal from './components/MasterySessionModal.tsx';
import SessionProposalModal from './components/SessionProposalModal.tsx';
import InfoModal from './components/InfoModal.tsx';
import WeakSpotBoosterModal from './components/WeakSpotBoosterModal.tsx';
import ExamStartModal from './components/ExamStartModal.tsx';
import ExamSimulation from './components/ExamSimulation.tsx';
import ExamResults from './components/ExamResults.tsx';
import UploadAnalysisModal from './components/UploadAnalysisModal.tsx';
import AuthModal from './components/AuthModal.tsx';
import PulseCheckModal from './components/PulseCheckModal.tsx';
import OralPracticeModal from './components/OralPracticeModal.tsx';
import TutorInterventionModal from './components/TutorInterventionModal.tsx';
import SessionSummaryModal from './components/SessionSummaryModal.tsx';
import BurnoutGuardModal from './components/BurnoutGuardModal.tsx';
import GamedayModal from './components/GamedayModal.tsx';
import AdminStatsModal from './components/AdminStatsModal.tsx';
import FeatureFeedbackModal from './components/FeatureFeedbackModal.tsx';
import GlobalStyles from './styles/GlobalStyles.tsx';
import { getInitialState, repetitionSchedule } from './utils/helpers.ts';
import { generateContentWithRetry } from './api/gemini.ts';
import { decode, decodeAudioData } from './utils/audio.ts';
import { getUserDataFromFirestore, saveUserDataToFirestore } from './api/firebase.ts';
import { 
    dutchExamQuestions, englishExamQuestions, natuurkundeExamQuestions, biologieExamQuestions, economieExamQuestions,
    geschiedenisExamQuestions, scheikundeExamQuestions, bedrijfseconomieExamQuestions, wiskundeAExamQuestions, wiskundeBExamQuestions,
    fransExamQuestions, duitsExamQuestions,
    FREE_QUESTION_IDS_NL, FREE_QUESTION_IDS_EN, FREE_QUESTION_IDS_NK, FREE_QUESTION_IDS_BIO, FREE_QUESTION_IDS_ECO,
    FREE_QUESTION_IDS_GS, FREE_QUESTION_IDS_SK, FREE_QUESTION_IDS_BECO, FREE_QUESTION_IDS_WISA, FREE_QUESTION_IDS_WISB,
    FREE_QUESTION_IDS_FR, FREE_QUESTION_IDS_DE
} from './data/data.ts';
import { examInfo } from './data/examInfo.ts';
import { allBadges } from './data/badges.ts';
import { mockSquadData } from './data/mockSquad.ts';
import { useAuth0 } from './auth/Auth0Provider.tsx';
import type { Question, MasteryScore, StudyPlan, Mistake, ChatMessage, PlannerTask, PlannerWeek, MasterySessionContent, SubjectSpecificData, SessionProposal, ActiveSession, Badge, DailyQuests, Quest, ExamSimulationState, ExamResult, FlashcardDeck, ProgressHistoryEntry, User, MoodEntry, SquadData, AiFeedback } from './data/data.ts';
import { ai } from './api/gemini.ts';

const CHAT_MESSAGE_LIMIT_FREE = 10;
const DAILY_ANSWER_LIMIT_FREE = 15;
const MASTERY_THRESHOLD_BADGE = 0.85;
const EXAM_SIMULATION_QUESTIONS = 15; // Number of questions for a mock exam
const TUTOR_INTERVENTION_INTERVAL = 5; // Show tutor tip every 5 questions

type Subject = 'Nederlands' | 'Engels' | 'Natuurkunde' | 'Biologie' | 'Economie' | 'Geschiedenis' | 'Scheikunde' | 'Bedrijfseconomie' | 'Wiskunde A' | 'Wiskunde B' | 'Frans' | 'Duits';
type MainView = 'WELCOME' | 'DASHBOARD' | 'QUESTION' | 'LOADING' | 'FEEDBACK' | 'REPETITION' | 'MINDFUL_MOMENT' | 'EXAM_SIMULATION';

const getWeekNumber = (d: Date): [number, number] => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return [d.getUTCFullYear(), weekNo];
}

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<MainView>(() => {
      // Check if there is an active session in storage to restore 'QUESTION' screen
      const savedSession = getInitialState('activeSession', null);
      return savedSession ? 'QUESTION' : 'WELCOME';
  });
  
  const [currentSubject, setCurrentSubject] = useState<Subject>('Nederlands');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialState('theme', 'light'));
  
  const initialSubjectData: { [key in Subject]: SubjectSpecificData } = {
    Nederlands: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Engels: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Natuurkunde: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Biologie: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Economie: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Geschiedenis: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Scheikunde: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Bedrijfseconomie: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    'Wiskunde A': {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    'Wiskunde B': {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Frans: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
    Duits: {
      masteryScores: {}, answeredIds: [], mistakes: [], studyPlan: null, examDate: '', dailyQuests: null, progressHistory: [], flashcardDecks: [], freeAnalysisUsed: false, lastPulseCheck: undefined, moodHistory: [],
    },
  };

  const [subjectData, setSubjectData] = useState<{ [key in Subject]: SubjectSpecificData }>(() => {
    const storedData = getInitialState('subjectData', null);
    if (storedData) {
        return { ...initialSubjectData, ...storedData };
    }
    return initialSubjectData;
  });
  
  // Session Persistence: Load these from local storage if available
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => getInitialState('activeSession', null));
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() => getInitialState('currentQuestion', null));
  const [sessionQuestionCount, setSessionQuestionCount] = useState(() => getInitialState('sessionQuestionCount', 0));
  const [sessionMistakeCount, setSessionMistakeCount] = useState(() => getInitialState('sessionMistakeCount', 0));
  
  const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
  const [lastAnswer, setLastAnswer] = useState<{isCorrect: boolean; question: Question | null; aiFeedback: AiFeedback; mindsetTip: string; xpGained: number; userAnswer: string;}>({ isCorrect: false, question: null, aiFeedback: { positive_reinforcement: '', core_mistake: '', detailed_explanation: '' }, mindsetTip: '', xpGained: 0, userAnswer: '' });
  
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
  const [upgradeModalReason, setUpgradeModalReason] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [chatUsage, setChatUsage] = useState(() => getInitialState('chatUsage', { count: 0, date: new Date().toISOString().split('T')[0] }));
  const [dailyAnswers, setDailyAnswers] = useState(() => getInitialState('dailyAnswers', { count: 0, date: new Date().toISOString().split('T')[0] }));

  const chatLimitReached = !isPremium && chatUsage.count >= CHAT_MESSAGE_LIMIT_FREE;
  const answerLimitReached = !isPremium && dailyAnswers.count >= DAILY_ANSWER_LIMIT_FREE;

  const [isZenZoneOpen, setIsZenZoneOpen] = useState(false);
  const [affirmation, setAffirmation] = useState('');
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const [hasUsedZenZone, setHasUsedZenZone] = useState(false);
  
  const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
  const [conceptExplanation, setConceptExplanation] = useState('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [conceptToExplain, setConceptToExplain] = useState<Question | null>(null);
  const conceptCache = useRef(new Map<string, string>());

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
  
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState({ title: '', content: '' });
  
  const [consecutiveMistakes, setConsecutiveMistakes] = useState<{ [key: string]: number }>({});
  const [isWeakSpotModalOpen, setIsWeakSpotModalOpen] = useState(false);

  const [earnedBadges, setEarnedBadges] = useState<string[]>(() => getInitialState('earnedBadges', []));

  const [activeActionableTask, setActiveActionableTask] = useState<{ weekIndex: number; taskIndex: number; type: string; } | null>(null);
  
  const [isGeneratingQuests, setIsGeneratingQuests] = useState(false);
  const [isExamStartModalOpen, setIsExamStartModalOpen] = useState(false);
  const [examState, setExamState] = useState<ExamSimulationState | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [proactiveInsight, setProactiveInsight] = useState<{ greeting: string; suggestion: string; action: string; context?: string } | null>(null);
  const [isPulseCheckModalOpen, setIsPulseCheckModalOpen] = useState(false);
  const [squadData, setSquadData] = useState<SquadData>(mockSquadData);

  const [isExamAnalysisModalOpen, setIsExamAnalysisModalOpen] = useState(false);
  const [examAnalysisResult, setExamAnalysisResult] = useState<ExamResult | null>(null);
  
  const [isOralPracticeOpen, setIsOralPracticeOpen] = useState(false);
  const [oralPracticeQuestion, setOralPracticeQuestion] = useState<Question | null>(null);

  const [tutorIntervention, setTutorIntervention] = useState<string | null>(null);
  
  const [isSessionSummaryModalOpen, setIsSessionSummaryModalOpen] = useState(false);
  const [sessionSummaryContent, setSessionSummaryContent] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isBurnoutGuardModalOpen, setIsBurnoutGuardModalOpen] = useState(false);
  const [consecutiveIncorrectAnswers, setConsecutiveIncorrectAnswers] = useState(0);
  const [isGamedayModalOpen, setIsGamedayModalOpen] = useState(false);

  // Phase 1 State
  const [isAdminStatsModalOpen, setIsAdminStatsModalOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isFeatureFeedbackModalOpen, setIsFeatureFeedbackModalOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState<{ feature: string; } | null>(null);

  const [parentTip, setParentTip] = useState('');
  const [isGeneratingParentTip, setIsGeneratingParentTip] = useState(false);
  
  const [isDataSynced, setIsDataSynced] = useState(false);


  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth0();

  const xpForNextLevel = 100 * level;
  
  const currentData = subjectData[currentSubject];
  
  const questions = (() => {
    switch (currentSubject) {
        case 'Nederlands': return dutchExamQuestions;
        case 'Engels': return englishExamQuestions;
        case 'Natuurkunde': return natuurkundeExamQuestions;
        case 'Biologie': return biologieExamQuestions;
        case 'Economie': return economieExamQuestions;
        case 'Geschiedenis': return geschiedenisExamQuestions;
        case 'Scheikunde': return scheikundeExamQuestions;
        case 'Bedrijfseconomie': return bedrijfseconomieExamQuestions;
        case 'Wiskunde A': return wiskundeAExamQuestions;
        case 'Wiskunde B': return wiskundeBExamQuestions;
        case 'Frans': return fransExamQuestions;
        case 'Duits': return duitsExamQuestions;
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
        case 'Geschiedenis': return FREE_QUESTION_IDS_GS;
        case 'Scheikunde': return FREE_QUESTION_IDS_SK;
        case 'Bedrijfseconomie': return FREE_QUESTION_IDS_BECO;
        case 'Wiskunde A': return FREE_QUESTION_IDS_WISA;
        case 'Wiskunde B': return FREE_QUESTION_IDS_WISB;
        case 'Frans': return FREE_QUESTION_IDS_FR;
        case 'Duits': return FREE_QUESTION_IDS_DE;
        default: return [];
    }
  })();

  // Firebase Synchronization Logic
  
  // 1. Load from Firestore on Login
  useEffect(() => {
    const syncData = async () => {
        if (!isAuthLoading && isAuthenticated && user?.email && !isDataSynced) {
            console.log("Fetching data from Firestore for user:", user.email);
            // Use user.email or a unique ID from Auth0 (user.sub is better but user type here has email)
            const userId = user.email.replace(/[.#$[\]]/g, '_'); // Simple sanitization for ID
            const cloudData = await getUserDataFromFirestore(userId);
            
            if (cloudData) {
                console.log("Cloud data found, syncing...");
                if (cloudData.subjectData) setSubjectData(cloudData.subjectData);
                if (cloudData.level) setLevel(cloudData.level);
                if (cloudData.xp) setXp(cloudData.xp);
                if (cloudData.studyStreak) setStudyStreak(cloudData.studyStreak);
                if (cloudData.isPremium !== undefined) setIsPremium(cloudData.isPremium);
                if (cloudData.earnedBadges) setEarnedBadges(cloudData.earnedBadges);
                if (cloudData.dailyAnswers) setDailyAnswers(cloudData.dailyAnswers);
                if (cloudData.chatUsage) setChatUsage(cloudData.chatUsage);
            } else {
                console.log("No cloud data found, starting fresh or using local.");
            }
            setIsDataSynced(true);
        }
    };
    syncData();
  }, [isAuthenticated, isAuthLoading, user, isDataSynced]);

  // 2. Auto-save to Firestore on change
  useEffect(() => {
      if (!isAuthLoading && isAuthenticated && user?.email && isDataSynced) {
          const userId = user.email.replace(/[.#$[\]]/g, '_');
          const dataToSave = {
              subjectData,
              level,
              xp,
              studyStreak,
              isPremium,
              earnedBadges,
              dailyAnswers,
              chatUsage,
              lastUpdated: new Date().toISOString()
          };
          
          // Debounce saving to avoid too many writes
          const timer = setTimeout(() => {
              saveUserDataToFirestore(userId, dataToSave);
          }, 2000);
          
          return () => clearTimeout(timer);
      }
  }, [subjectData, level, xp, studyStreak, isPremium, earnedBadges, dailyAnswers, chatUsage, isAuthenticated, isAuthLoading, user, isDataSynced]);
  
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && currentScreen === 'WELCOME') {
        // Only redirect to dashboard if there's no active session running
        if (!activeSession) {
            setCurrentScreen('DASHBOARD');
        }
    }
  }, [isAuthenticated, isAuthLoading, currentScreen, activeSession]);

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

  // Session Memory persistence
  useEffect(() => {
      if (activeSession) {
          localStorage.setItem('activeSession', JSON.stringify(activeSession));
      } else {
          localStorage.removeItem('activeSession');
      }
  }, [activeSession]);

  useEffect(() => {
      if (currentQuestion) {
          localStorage.setItem('currentQuestion', JSON.stringify(currentQuestion));
      } else {
          localStorage.removeItem('currentQuestion');
      }
  }, [currentQuestion]);

  useEffect(() => { localStorage.setItem('sessionQuestionCount', JSON.stringify(sessionQuestionCount)); }, [sessionQuestionCount]);
  useEffect(() => { localStorage.setItem('sessionMistakeCount', JSON.stringify(sessionMistakeCount)); }, [sessionMistakeCount]);
  
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

    useEffect(() => {
        if (currentScreen === 'DASHBOARD' && isAuthenticated && currentData && !activeSession) {
            const [year, week] = getWeekNumber(new Date());
            const lastCheck = currentData.lastPulseCheck;
            if (!lastCheck || lastCheck.year !== year || lastCheck.week !== week) {
                const timer = setTimeout(() => {
                    setIsPulseCheckModalOpen(true);
                }, 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [currentScreen, isAuthenticated, currentData, activeSession]);

  useEffect(() => {
    const generateProactiveInsight = async () => {
        if (!currentData || proactiveInsight) return;

        const masteryScores = currentData.masteryScores || {};
        const weakSkills = Object.entries(masteryScores)
            .filter(([, score]: [string, MasteryScore]) => score.total > 2)
            .map(([skill, score]: [string, MasteryScore]) => ({ skill, score: score.correct / score.total }))
            .sort((a, b) => a.score - b.score);
        
        const moodHistory = currentData.moodHistory || [];
        const lastMoodEntry = moodHistory.length > 0
            ? moodHistory[moodHistory.length - 1]
            : null;

        const prompt = `Je bent een AI-studiecoach. Schrijf een korte, proactieve en empathische begroeting voor het dashboard van een VWO leerling.
        
        CONTEXT LEERLING:
        - Zwakste vaardigheid: ${weakSkills[0]?.skill || 'Nog geen data'}
        - Herhalingen klaar: ${repetitionQueue.length}
        - Gevoel deze week (1=gestrest, 5=zelfverzekerd): ${lastMoodEntry?.rating || 'Onbekend'}
        - Focuspunt deze week: "${lastMoodEntry?.focus || 'Onbekend'}"
        
        TAAK:
        Kies de MEEST RELEVANTE actie en schrijf een passende begroeting.
        - Als de leerling gestrest is (rating 1-2), begin dan empathisch en stel iets laagdrempeligs voor.
        - Als de leerling een focuspunt heeft, probeer daar op in te spelen.
        - Als er een zwakke vaardigheid is, stel een booster sessie voor.
        - Als er herhalingen zijn, moedig aan om die te doen.

        Geef een JSON object: {"greeting": "...", "suggestion": "...", "action": "...", "context": "..." (optioneel)}.
        Mogelijke acties: 'start_booster', 'start_repetition'.`;
        
        try {
            const response = await generateContentWithRetry({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            greeting: { type: Type.STRING },
                            suggestion: { type: Type.STRING },
                            action: { type: Type.STRING },
                            context: { type: Type.STRING }
                        },
                        required: ["greeting", "suggestion", "action"]
                    }
                }
            });
            setProactiveInsight(JSON.parse(response.text));
        } catch (e) {
            console.error("Failed to generate proactive insight", e);
        }
    };
    if (currentScreen === 'DASHBOARD') {
        generateProactiveInsight();
    }
  }, [currentData, repetitionQueue.length, currentScreen, proactiveInsight]);

    useEffect(() => {
        if (currentScreen !== 'DASHBOARD' || !currentData.examDate) return;
        
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const examDateStr = currentData.examDate;

        // 1. Check if examDate is valid and actually set
        if (!examDateStr || examDateStr === '') return;

        // 2. Check if today matches exam date string exactly
        if (todayStr === examDateStr) {
             // 3. Check localStorage to see if we already showed it today
             const hasSeenToday = localStorage.getItem(`hasSeenGameday_${todayStr}`);
             if (!hasSeenToday) {
                 setIsGamedayModalOpen(true);
                 localStorage.setItem(`hasSeenGameday_${todayStr}`, 'true');
             }
        }
    }, [currentScreen, currentData.examDate]);


  const getTodayISO = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  }
  
  const calculateRepetitionQueue = useCallback(() => {
    const today = getTodayISO();
    if (currentData && currentData.mistakes) {
        const dueMistakes = currentData.mistakes.filter(m => m.nextReviewDate <= today);
        setRepetitionQueue(dueMistakes);
    } else {
        setRepetitionQueue([]);
    }
  }, [currentData]);

  useEffect(() => {
    calculateRepetitionQueue();
  }, [calculateRepetitionQueue, currentSubject]);
  
  const handleWelcomeContinue = () => {
    setCurrentScreen('DASHBOARD');
  };

  const openUpgradeModal = (reason: string) => {
    setUpgradeModalReason(reason);
    setIsUpgradeModalOpen(true);
  };
  
  const handleGenerateSessionProposal = async (focusSkillOverride?: string) => {
    if (answerLimitReached) {
        openUpgradeModal('om onbeperkt vragen te oefenen.');
        return;
    }
    setIsGeneratingSession(true);

    const masteryScores = currentData.masteryScores || {};
    const weakSkills = Object.entries(masteryScores)
        .filter(([, score]: [string, MasteryScore]) => score.total > 2)
        .map(([skill, score]: [string, MasteryScore]) => ({ skill, score: score.correct / score.total }))
        .sort((a, b) => a.score - b.score);

    const weakestSkill = weakSkills.length > 0 ? weakSkills[0] : null;

    const prompt = `Je bent een expert VWO ${currentSubject} docent en een motiverende studiecoach. Je taak is om een korte, gepersonaliseerde studiesessie voor te stellen aan een leerling.

    CONTEXT:
    - Focus-vaardigheid (indien opgegeven): ${focusSkillOverride || 'Niet opgegeven'}
    - Zwakste vaardigheid van de leerling (indien geen override): "${weakestSkill?.skill || 'Nog te bepalen'}" (gebaseerd op een score van ${weakestSkill ? (weakestSkill.score * 100).toFixed(0) : 'N/A'}%)
    - Aantal fouten dat herhaald moet worden: ${repetitionQueue.length}

    TAAK:
    Genereer een voorstel voor een studiesessie in een JSON-object. Baseer de sessie op de 'Focus-vaardigheid' als die is opgegeven, anders op de zwakste vaardigheid.

    STRUCTUUR JSON-OBJECT:
    {
      "focusSkill": "De naam van de focus-vaardigheid, of 'Algemene Oefening' als er geen focus is",
      "newQuestionsCount": EEN GETAL TUSSEN 3 EN 5 (kies 3 als er een focus-vaardigheid is, anders 4),
      "introMessage": "Een korte, bemoedigende introductie voor de sessie (max 3 zinnen). Noem de focus-vaardigheid en het aantal vragen. Noem ook dat de herhalingen klaarliggen op het dashboard."
    }`;

    try {
        const response = await generateContentWithRetry({
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
    setConsecutiveIncorrectAnswers(0);

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
        if (!isPremium) openUpgradeModal('om toegang te krijgen tot alle vragen.');
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
        localStorage.clear();
        
        setSubjectData(initialSubjectData);
        setLevel(1);
        setXp(0);
        setStudyStreak(0);
        setRepetitionQueue([]);
        setIsPremium(false);
        setActiveSession(null);
        setCurrentQuestion(null);
        setSessionQuestionCount(0);
        setSessionMistakeCount(0);
        const today = new Date().toISOString().split('T')[0];
        setChatUsage({ count: 0, date: today });
        setDailyAnswers({ count: 0, date: today });
        setEarnedBadges([]);
        setProactiveInsight(null);
        if (isAuthenticated) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    }
  };
  
  const handleGenerateOrUpdatePlan = async (isUpdate: boolean = false) => {
    if (!currentData.examDate) return;
    setIsGeneratingPlan(true);
    const today = new Date();
    const targetDate = new Date(currentData.examDate);
    const daysLeft = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 1) {
        alert("Je examendatum is al geweest of is vandaag. Stel een nieuwe datum in om een plan te maken.");
        setIsGeneratingPlan(false);
        return;
    }
    
    const masteryScores = currentData.masteryScores || {};
    const weakTopics = Object.entries(masteryScores)
        .filter(([, score]: [string, MasteryScore]) => score.total > 0 && (score.correct / score.total) < 0.6)
        .map(([topic, _]) => topic);

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
    - "Zen Zone": Een tool voor ontspanning en focus.

    **TAAK:**
    Maak een studieplan voor de komende weken tot aan het examen. De output MOET een JSON-object zijn met een "weeks" array. Elke week in de array is een object met:
    1.  "week_number": Het weeknummer (beginnend bij 1).
    2.  "theme": Een motiverend thema voor de week (bijv. "Fundamenten leggen" of "Examenstrategieën").
    3.  "tasks": Een array van 3 tot 5 taak-objecten voor die week. Elk taak-object heeft:
        - "description": Een KORTE, actiegerichte beschrijving. Integreer de naam van een app-tool tussen apostroffen (bijv. 'Start Oefensessie') waar relevant.
        - "completed": false (standaard).

    **INSTRUCTIES:**
    - Maak een logische opbouw: begin met de zwakke onderwerpen en eindig met herhaling en proefexamens.
    - Wees realistisch: Plan niet te veel per week.
    - Wees concreet: Zeg niet "oefen veel", maar "Gebruik 'Start Oefensessie' gericht op [zwak onderwerp]".
    - Integreer de app-tools in de taakomsrijvingen. Dit is cruciaal. Gebruik de exacte toolnamen tussen apostroffen.
    `;

    let prompt = "";
    if (isUpdate && currentData.studyPlan) {
        const completedTasksSummary = currentData.studyPlan.weeks
            .flatMap(w => w.tasks.filter(t => t.completed).map(t => t.description))
            .join(', ');
        prompt = `${commonPromptStart}
        **UPDATE CONTEXT:**
        De leerling heeft een bestaand plan en wil dit bijwerken. De voortgang is als volgt:
        - Reeds voltooide taken: ${completedTasksSummary || 'Nog geen'}
        
        Pas het resterende plan aan op basis van de nieuwe context (resterende dagen, bijgewerkte zwakke vaardigheden). Behoud de structuur van voltooide weken/taken niet. Genereer een volledig nieuw plan voor de resterende tijd.
        `;
    } else {
        prompt = `${commonPromptStart}
        **INSTRUCTIE EXTRA:**
        Voeg aan de eerste week twee speciale taken toe, ongeacht het onderwerp:
        1. Een taak om de syllabus te bekijken, met een speciale 'infoType' property.
           {"description": "Bekijk de officiële examen syllabus", "completed": false, "infoType": "syllabus"}
        2. Een taak om de examenonderdelen te bekijken.
           {"description": "Begrijp de examenonderdelen", "completed": false, "infoType": "components"}
        `;
    }

    try {
        const response = await generateContentWithRetry({
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
                                                completed: { type: Type.BOOLEAN },
                                                infoType: { type: Type.STRING }
                                            },
                                            required: ["description", "completed"]
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
        const plan = JSON.parse(response.text) as StudyPlan;
        setSubjectData(prev => ({ ...prev, [currentSubject]: { ...prev[currentSubject], studyPlan: plan } }));
    } catch (e) {
        console.error("Failed to generate study plan", e);
        alert("Er ging iets mis met het genereren van je studieplan. Probeer het opnieuw.");
    } finally {
        setIsGeneratingPlan(false);
    }
  };
  
    const handleGenerateParentTips = async () => {
        setIsGeneratingParentTip(true);
        setParentTip('');

        const scoresArray = Object.entries(currentData.masteryScores).map(([skill, score]: [string, MasteryScore]) => ({
            skill,
            percentage: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0,
            total: score.total,
        }));

        const strengths = scoresArray.filter(s => s.percentage >= 75 && s.total >= 3).map(s => s.skill).join(', ') || 'nog te bepalen';
        const weaknesses = scoresArray.filter(s => s.percentage < 55 && s.total >= 3).map(s => s.skill).join(', ') || 'nog geen';

        const prompt = `Je bent een AI-onderwijscoach met expertise in pedagogiek. Schrijf een korte, ondersteunende tip voor een ouder wiens kind VWO ${currentSubject} leert. De tip moet gericht zijn op het proces en het aanmoedigen van een groeimindset, NIET op het controleren van resultaten.

        CONTEXT LEERLING:
        - Sterke punten: ${strengths}
        - Werkpunten: ${weaknesses}
        - Studietaak: VWO Examenvoorbereiding ${currentSubject}

        TAAK:
        Geef één concrete, positieve tip. Focus op het ondersteunen van het leerproces. Bijvoorbeeld: hoe praat je over werkpunten zonder te demotiveren? Of hoe kun je de sterke punten vieren? Schrijf in de 'je/jij'-vorm gericht aan de ouder.
        Houd het kort en krachtig (2-3 zinnen).`;
        
        try {
            const response = await generateContentWithRetry({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setParentTip(response.text);
        } catch (e) {
            console.error("Failed to generate parent tip", e);
            setParentTip("Er ging iets mis bij het genereren van de tip. Probeer het later opnieuw.");
        } finally {
            setIsGeneratingParentTip(false);
        }
    };
  
  const handleToggleTask = (weekIndex: number, taskIndex: number) => {
    setSubjectData(prev => {
        const newSubjectData = { ...prev };
        const plan = newSubjectData[currentSubject].studyPlan;
        if (plan) {
            const newPlan = { ...plan };
            const task = newPlan.weeks[weekIndex].tasks[taskIndex];
            task.completed = !task.completed;
            if (task.completed && !task.xpAwarded) {
                addXp(15);
                task.xpAwarded = true;
            }
            newSubjectData[currentSubject].studyPlan = newPlan;
        }
        return newSubjectData;
    });
  };

  const handleReviewWeek = async (week: PlannerWeek) => {
    setWeekToReview(week);
    setIsReviewModalOpen(true);
    setIsGeneratingReview(true);
    
    const completedTasks = week.tasks.filter(t => t.completed).map(t => t.description);
    const incompleteTasks = week.tasks.filter(t => !t.completed).map(t => t.description);

    const prompt = `Je bent een motiverende studiecoach. Geef korte, positieve feedback op de voortgang van een leerling voor de afgelopen week.
    
    CONTEXT:
    - Weekthema: "${week.theme}"
    - Voltooide taken: ${completedTasks.join(', ') || 'Geen'}
    - Onvoltooide taken: ${incompleteTasks.join(', ') || 'Geen'}
    
    TAAK:
    Schrijf een korte review (3-4 zinnen).
    - Prijs de voltooide taken.
    - Geef een constructieve en aanmoedigende opmerking over de onvoltooide taken (als die er zijn).
    - Eindig met een motiverende zin voor de komende week.`;

    try {
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        setReviewContent(response.text);
    } catch (e) {
        console.error("Failed to generate week review", e);
        setReviewContent("Er ging iets mis bij het genereren van je review. Probeer het later opnieuw.");
    } finally {
        setIsGeneratingReview(false);
    }
  };

  const handleShowInfo = (infoType: 'syllabus' | 'components') => {
    const info = examInfo[currentSubject]?.[infoType];
    if (info) {
        setInfoModalData({ title: info.title, content: info.content });
        setIsInfoModalOpen(true);
    }
  };

  const handleOpenChat = (context?: {type: string, data: any} | null, mode: 'default' | 'question_generation' = 'default', systemInstructionOverride?: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (chatUsage.date !== today) {
        setChatUsage({ count: 0, date: today });
    }

    if (chatLimitReached) {
        openUpgradeModal('om onbeperkt te chatten met de AI-coach.');
        return;
    }

    let systemInstruction = `Je bent GLOW AI, een vriendelijke en deskundige AI-studiecoach voor VWO-leerlingen in Nederland. Je helpt met het vak ${currentSubject}. Wees ondersteunend, duidelijk en gebruik af en toe een emoji.`;
    if (systemInstructionOverride) {
        systemInstruction = systemInstructionOverride;
    }

    chatSession.current = ai.chats.create({ 
        model: 'gemini-2.5-flash', 
        config: {
            systemInstruction
        }
    });

    const initialHistory: ChatMessage[] = [{ role: 'system', text: systemInstruction }];

    if (mode === 'question_generation') {
        initialHistory.push({ role: 'model', text: 'Oké! Over welk onderwerp wil je oefenvragen maken?' });
    } else if (context?.type === 'summary') {
        const summaryText = context.data.summaryText;
        initialHistory.push({ role: 'model', text: `Oké, laten we deze samenvatting bespreken. Wat wil je erover weten?\n\n---\n${summaryText}\n---` });
    } else if (currentQuestion) {
         initialHistory.push({ role: 'model', text: `Hoi! Heb je een vraag over de opgave "${currentQuestion.vraag_tekst}"?` });
    } else {
         initialHistory.push({ role: 'model', text: 'Hoi! Waar kan ik je vandaag mee helpen?' });
    }
    
    setChatHistory(initialHistory);
    setIsChatOpen(true);
  };

  const handleOpenZenZone = () => {
    setIsZenZoneOpen(true);
  };

  const handleStartRepetition = () => {
    if (repetitionQueue.length > 0) {
        setCurrentRepetitionIndex(0);
        setCurrentScreen('REPETITION');
    }
  };

  const handleAnalyzeMistakes = async () => {
    const canAnalyze = isPremium || !currentData.freeAnalysisUsed;
    if (!canAnalyze) {
        openUpgradeModal('voor ongelimiteerde foutenanalyses.');
        return;
    }

    setIsAnalysisModalOpen(true);
    setIsGeneratingAnalysis(true);

    const mistakesSummary = currentData.mistakes.map(m => {
        const q = questions.find(q => q.id === m.questionId);
        return `- Vraag over "${q?.kern_vaardigheid}": Mijn antwoord was "${m.userAnswer}", de kernfout was "${m.aiFeedback.substring(0, 100)}..."`;
    }).join('\n');

    const prompt = `Je bent een expert VWO ${currentSubject} docent. Analyseer de volgende samenvatting van gemaakte fouten van een leerling. Identificeer 2-3 concrete patronen of terugkerende misvattingen. Geef per patroon een praktisch advies om dit te verbeteren. Wees bemoedigend.
    
    FOUTEN:
    ${mistakesSummary}
    
    OUTPUT:
    Geef een korte analyse met duidelijke kopjes voor de patronen. Gebruik ### voor kopjes.`;
    
    try {
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        setAnalysisContent(response.text);
        if (!isPremium) {
            setSubjectData(prev => ({...prev, [currentSubject]: {...prev[currentSubject], freeAnalysisUsed: true}}));
        }
    } catch (e) {
        console.error("Failed to analyze mistakes", e);
        setAnalysisContent("Er ging iets mis bij het analyseren van je fouten. Probeer het later opnieuw.");
    } finally {
        setIsGeneratingAnalysis(false);
    }
  };

  const handleStartActionableTask = (weekIndex: number, taskIndex: number, actionType: string, context?: string) => {
    setActiveActionableTask({ weekIndex, taskIndex, type: actionType });
    switch (actionType) {
        case 'start_session':
            handleGenerateSessionProposal(context);
            break;
        case 'generate_questions':
            handleOpenChat(null, 'question_generation');
            break;
        case 'repetition':
            handleStartRepetition();
            break;
        case 'analyze_mistakes':
            handleAnalyzeMistakes();
            break;
        case 'zen_zone':
            handleOpenZenZone();
            break;
        case 'chat_ai':
            handleOpenChat();
            break;
        default:
            console.warn(`Unknown actionable task type: ${actionType}`);
    }
  };
  
  const handleSubjectChange = (subject: Subject) => {
    setCurrentSubject(subject);
    setProactiveInsight(null); // Reset insight for new subject
  };

  const handleGenerateDailyQuests = useCallback(async () => {
    setIsGeneratingQuests(true);
    const today = new Date().toISOString().split('T')[0];

    const weakSkills = Object.entries(currentData.masteryScores)
        .filter(([, score]: [string, MasteryScore]) => score.total > 1 && (score.correct / score.total) < 0.7)
        .map(([skill]) => skill);

    const prompt = `Genereer 3 dagelijkse "quests" voor een VWO ${currentSubject} leerling. Maak een gevarieerde set.
    CONTEXT:
    - Zwakke vaardigheden: ${weakSkills.join(', ') || 'Nog geen'}
    - Herhalingen beschikbaar: ${repetitionQueue.length > 0}
    
    TAAK:
    Geef een JSON object met een "quests" array. Elke quest heeft:
    - "description": Korte, motiverende omschrijving.
    - "type": Kies uit 'answer_questions' (beantwoord X vragen), 'answer_skill' (beantwoord X vragen over [specifieke vaardigheid]), 'do_repetition' (doe je herhalingen), 'use_zen_zone' (gebruik de Zen Zone).
    - "target": Het doel (bijv. 5 voor 5 vragen).
    - "xp": Beloning (tussen 20 en 30).
    - "skill": (Optioneel) De vaardigheid voor 'answer_skill'.
    
    Kies logische quests. Als er een zwakke vaardigheid is, maak daar een quest van. Als er herhalingen zijn, maak een quest. Vul aan met een algemene quest.`;
    
    try {
        const response = await generateContentWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quests: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    description: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    target: { type: Type.INTEGER },
                                    xp: { type: Type.INTEGER },
                                    skill: { type: Type.STRING },
                                },
                                required: ["description", "type", "target", "xp"]
                            }
                        }
                    },
                    required: ["quests"]
                }
            }
        });
        const questData = JSON.parse(response.text);
        const newQuests: DailyQuests = {
            date: today,
            quests: questData.quests.map((q: Quest) => ({...q, current: 0, completed: false}))
        };
        setSubjectData(prev => ({...prev, [currentSubject]: {...prev[currentSubject], dailyQuests: newQuests}}));
    } catch (e) {
        console.error("Failed to generate daily quests", e);
    } finally {
        setIsGeneratingQuests(false);
    }
  }, [currentData.masteryScores, repetitionQueue.length, currentSubject]);

  const handleStartQuest = (quest: Quest) => {
    switch (quest.type) {
        case 'answer_questions':
        case 'answer_skill':
            handleGenerateSessionProposal(quest.skill);
            break;
        case 'do_repetition':
            handleStartRepetition();
            break;
        case 'use_zen_zone':
            handleOpenZenZone();
            break;
    }
  };

  const handleStartExamSimulation = () => {
    if (!isPremium) {
        openUpgradeModal("om proefexamens te maken.");
        return;
    }
    setIsExamStartModalOpen(true);
  };
  
  const handleAddFlashcardDeck = (deck: FlashcardDeck) => {
    setSubjectData(prev => ({
        ...prev,
        [currentSubject]: {
            ...prev[currentSubject],
            flashcardDecks: [...prev[currentSubject].flashcardDecks, deck]
        }
    }));
  };

  const handleCreateDeckFromSummary = async (summaryText: string): Promise<FlashcardDeck | null> => {
    const prompt = `Genereer een flashcard deck van de volgende samenvatting over ${currentSubject}.
    Samenvatting: "${summaryText}"

    TAAK: Maak een JSON object met een "title" (korte, pakkende titel) en een "cards" array. Elke kaart heeft een "question" (kernbegrip) en "answer" (beknopte definitie/uitleg). Genereer 5-8 relevante kaarten.`;

    try {
        const response = await generateContentWithRetry({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        cards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                },
                                required: ["question", "answer"]
                            }
                        }
                    },
                    required: ["title", "cards"]
                }
            }
        });
        const deckData = JSON.parse(response.text);
        const newDeck: FlashcardDeck = {
            id: Date.now(),
            title: deckData.title,
            cards: deckData.cards
        };
        handleAddFlashcardDeck(newDeck);
        return newDeck;
    } catch (e) {
        console.error(e);
        return null;
    }
  };

  const handleGenerateProgressAnalysis = async (): Promise<string> => {
    const masterySummary = Object.entries(currentData.masteryScores).map(([skill, score]: [string, MasteryScore]) => 
        `- ${skill}: ${(score.total > 0 ? (score.correct/score.total*100) : 0).toFixed(0)}% (${score.total} vragen)`
    ).join('\n');

    const prompt = `Analyseer de voortgang van deze VWO ${currentSubject} leerling. Geef een kort, motiverend inzicht.
    
    VOORTGANG:
    ${masterySummary}
    
    TAAK:
    Schrijf 1-2 zinnen die de data samenvatten en een positief, toekomstgericht inzicht geven.`;

    try {
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (e) {
        console.error("Failed to generate progress analysis", e);
        return "Analyse kon niet worden geladen.";
    }
  };

  const handleProactiveAction = (action: string, context?: string) => {
    switch (action) {
        case 'start_booster':
            handleGenerateSessionProposal(context);
            break;
        case 'start_repetition':
            handleStartRepetition();
            break;
        default:
            console.warn(`Unknown proactive action: ${action}`);
    }
  };
  
  const handleShareDeck = (deck: FlashcardDeck) => {
    // In a real app, this would integrate with a backend to share.
    // For this simulation, we'll just add an activity to the feed.
    const newActivity = {
        id: Date.now(),
        avatar: '🚀',
        text: `<strong>Jij</strong> heeft het flashcard deck '${deck.title}' gedeeld.`,
        timestamp: "Zojuist"
    };
    setSquadData(prev => ({
        ...prev,
        activityFeed: [newActivity, ...prev.activityFeed]
    }));
    alert(`Deck "${deck.title}" is gedeeld met je squad!`);
  };

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
        setIsAdminStatsModalOpen(true);
        setLogoClickCount(0);
    }
  };

  // Implement missing handlers that were causing issues
  const handleNextQuestion = () => {
      if (!activeSession) {
          setCurrentScreen('DASHBOARD');
          return;
      }
      
      // If there's a next question pre-loaded, use it
      if (nextQuestion) {
          const nextIndex = activeSession.currentIndex + 1;
          const updatedSession = { ...activeSession, currentIndex: nextIndex };
          setActiveSession(updatedSession);
          setCurrentQuestion(nextQuestion);
          setCurrentScreen('QUESTION');
          setNextQuestion(null); // Reset nextQuestion, it will be re-fetched in handleAnswerSubmit if available
      } else {
          // End of session
          handleFinishSession();
      }
  };

  const handleFinishSession = async () => {
    setCurrentScreen('LOADING');
    // Generate session summary
    const prompt = `Genereer een korte, motiverende samenvatting van de zojuist voltooide studiesessie voor ${currentSubject}.
    Resultaat: ${sessionQuestionCount} vragen beantwoord, ${sessionMistakeCount} fouten.
    Focus op groei en volharding.`;

    try {
        setIsGeneratingSummary(true);
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        setSessionSummaryContent(response.text);
        setIsSessionSummaryModalOpen(true);
    } catch (e) {
        console.error("Failed to generate session summary", e);
    } finally {
        setIsGeneratingSummary(false);
        setActiveSession(null); // Clear active session
        setCurrentScreen('DASHBOARD');
    }
  };

  const handleReturnToDashboard = () => {
      if (activeSession) {
          if (window.confirm("Weet je zeker dat je de sessie wilt stoppen? Je voortgang in deze sessie wordt niet opgeslagen.")) {
              setActiveSession(null);
              setCurrentScreen('DASHBOARD');
          }
      } else {
          setCurrentScreen('DASHBOARD');
      }
  };

  const handleGetHint = async (): Promise<string> => {
      if (!currentQuestion) return "Geen vraag actief.";
      const prompt = `Geef een subtiele hint voor de volgende vraag, zonder het antwoord weg te geven.
      Vraag: "${currentQuestion.vraag_tekst}"`;
      try {
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
      } catch(e) {
        return "Kon geen hint genereren.";
      }
  };

  const handleOralPractice = () => {
      setOralPracticeQuestion(currentQuestion);
      setIsOralPracticeOpen(true);
  };
  
  const handleOralSubmit = (text: string) => {
      setIsOralPracticeOpen(false);
      handleAnswerSubmit(text);
  };

  const handleExplainConcept = async () => {
      if (!currentQuestion) return;
      setIsGeneratingExplanation(true);
      setConceptExplanation('');
      setConceptToExplain(currentQuestion);
      setIsConceptModalOpen(true);
      
      const conceptKey = currentQuestion.kern_vaardigheid;
      if (conceptCache.current.has(conceptKey)) {
          setConceptExplanation(conceptCache.current.get(conceptKey)!);
          setIsGeneratingExplanation(false);
          return;
      }

      const prompt = `Leg het concept "${currentQuestion.kern_vaardigheid}" uit in de context van ${currentSubject} op VWO-niveau. Wees beknopt maar duidelijk. Gebruik een voorbeeld.`;
      try {
          const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
          const explanation = response.text;
          setConceptExplanation(explanation);
          conceptCache.current.set(conceptKey, explanation);
      } catch (e) {
          setConceptExplanation("Kon geen uitleg genereren.");
      } finally {
          setIsGeneratingExplanation(false);
      }
  };

  const handleExplainEli5 = async (originalExplanation: string) => {
      const prompt = `Leg de volgende uitleg uit alsof ik 5 jaar oud ben (of in Jip-en-Janneketaal):
      "${originalExplanation}"`;
      const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text;
  };

  const handleAnalyzeThinkingProcess = () => {
      if (currentQuestion && lastAnswer) {
        setThinkingProcessQuestion({ question: currentQuestion, userAnswer: lastAnswer.userAnswer });
        setIsThinkingProcessModalOpen(true);
      }
  };

  const handleAnalyzeThinking = async (reflections: { deconstruction: string; reasoning: string; }) => {
      const prompt = `Analyseer het denkproces van de leerling bij de volgende vraag.
      Vraag: "${thinkingProcessQuestion?.question.vraag_tekst}"
      Antwoord Leerling: "${thinkingProcessQuestion?.userAnswer}"
      Correctiemodel: "${thinkingProcessQuestion?.question.correctie_model}"
      
      Reflectie Leerling:
      - Deconstructie: "${reflections.deconstruction}"
      - Redenering: "${reflections.reasoning}"
      
      Geef feedback op waar de redeneerfout zit of waar de leerling juist goed zat. Wees constructief.`;
      
      const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text;
  };

  const handleGetSimplifiedExplanation = async (explanation: string) => {
      const prompt = `Vertaal deze uitleg naar "Jip en Janneke taal": "${explanation}"`;
      const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text;
  };

  const handleGetAnalogy = async (explanation: string, question: Question) => {
      const prompt = `Geef een creatieve analogie om dit concept uit te leggen: "${explanation}". Vraag context: ${question.vraag_tekst}`;
      const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
      return response.text;
  };
  
  const handleGenerateAffirmation = async () => {
      setIsGeneratingAffirmation(true);
      const prompt = "Geef een korte, krachtige affirmatie voor een student die examenstress heeft. Nederlands.";
      try {
        const response = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt });
        setAffirmation(response.text);
      } catch (e) {
          setAffirmation("Ik ben kalm, gefocust en klaar om te leren.");
      } finally {
          setIsGeneratingAffirmation(false);
      }
  }
  
  const handleConfirmStartExam = () => {
      setIsExamStartModalOpen(false);
      // Generate a mock exam session
      const examQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, EXAM_SIMULATION_QUESTIONS);
      
      setExamState({
          questions: examQuestions,
          answers: new Array(examQuestions.length).fill(''),
          currentIndex: 0,
          startTime: Date.now(),
          flags: new Array(examQuestions.length).fill(false)
      });
      setCurrentScreen('EXAM_SIMULATION');
  };

  const handleExamSubmit = async () => {
      if (!examState) return;
      
      setCurrentScreen('LOADING');
      
      // Calculate results
      const results = await Promise.all(examState.questions.map(async (q, index) => {
          const userAnswer = examState.answers[index];
          let isCorrect = false;
           if (q.vraag_type === 'Meerkeuzevraag') {
                isCorrect = userAnswer.trim().toLowerCase() === q.correct_option?.trim().toLowerCase();
            } else {
                const gradingPrompt = `Beoordeel dit antwoord: Vraag: "${q.vraag_tekst}", Model: "${q.correctie_model}", Antwoord: "${userAnswer}". Antwoord alleen met CORRECT of INCORRECT.`;
                const res = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: gradingPrompt });
                isCorrect = res.text.trim().toUpperCase().includes('CORRECT');
            }
            
            return {
                question: q,
                userAnswer,
                isCorrect,
                feedback: q.correctie_model,
                skill: q.kern_vaardigheid
            };
      }));
      
      const score = (results.filter(r => r.isCorrect).length / results.length) * 100;
      
      setExamAnalysisResult({
          questions: examState.questions,
          userAnswers: examState.answers,
          results: results.map(r => ({ isCorrect: r.isCorrect, feedback: r.feedback, skill: r.skill })),
          score,
          startTime: examState.startTime,
          endTime: Date.now()
      });
      
      setExamState(null);
      setIsExamAnalysisModalOpen(true);
      setCurrentScreen('DASHBOARD'); // Results shown in modal
  };

  const handleUploadAnalyze = async (file: File) => {
      setIsAnalyzingUpload(true);
      try {
          // Convert file to base64
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
              const base64Data = (reader.result as string).split(',')[1];
              
              const prompt = "Analyseer deze samenvatting. Is hij compleet voor het VWO eindexamen? Wat mist er? Geef concrete feedback.";
              
              const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: [
                      { text: prompt },
                      { inlineData: { mimeType: file.type, data: base64Data } }
                  ]
              });
              
              setAnalysisContent(response.text);
              setIsAnalyzingUpload(false);
              setIsUploadModalOpen(false);
              setIsAnalysisModalOpen(true); // Reuse analysis modal
          };
      } catch (e) {
          console.error(e);
          alert("Kon bestand niet analyseren.");
          setIsAnalyzingUpload(false);
      }
  };
  
  const handlePulseCheckSubmit = (rating: number, focus: string) => {
      const [year, week] = getWeekNumber(new Date());
      setSubjectData(prev => ({
          ...prev,
          [currentSubject]: {
              ...prev[currentSubject],
              lastPulseCheck: { week, year },
              moodHistory: [...(prev[currentSubject].moodHistory || []), { week, year, rating, focus }]
          }
      }));
      setIsPulseCheckModalOpen(false);
  };

  
  const handleAnswerSubmit = async (answer: string) => {
    if (!currentQuestion || !activeSession) return;

    setCurrentScreen('LOADING');
    
    // Check daily answer limit
    if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        setDailyAnswers(prev => {
            if (prev.date !== today) return { count: 1, date: today };
            return { ...prev, count: prev.count + 1 };
        });
    }
    
    // Update Daily Quests
    setSubjectData(prev => {
        const newSubjectData = { ...prev };
        const quests = newSubjectData[currentSubject].dailyQuests;
        if (quests) {
            quests.quests.forEach(q => {
                if (q.completed) return;
                if (q.type === 'answer_questions') q.current++;
                if (q.type === 'answer_skill' && q.skill === currentQuestion.kern_vaardigheid) q.current++;

                if (q.current >= q.target) {
                    q.completed = true;
                    addXp(q.xp);
                }
            });
        }
        return newSubjectData;
    });

    let isCorrect = false;
    let xpGained = 10; // Base XP for answering

    if (currentQuestion.vraag_type === 'Meerkeuzevraag') {
        isCorrect = answer.trim().toLowerCase() === currentQuestion.correct_option?.trim().toLowerCase();
    } else {
        // For open questions, use AI to check
        const gradingPrompt = `Je bent een VWO ${currentSubject} examinator. Beoordeel het antwoord van een leerling op een examenvraag. Geef ALLEEN "CORRECT" of "INCORRECT" terug.
        
        VRAAG: "${currentQuestion.vraag_tekst}"
        CORRECTIEMODEL: "${currentQuestion.correctie_model}"
        ANTWOORD LEERLING: "${answer}"`;
        
        const gradingResponse = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: gradingPrompt });
        isCorrect = gradingResponse.text.trim().toUpperCase().includes('CORRECT');
    }
    
    const feedbackPrompt = `Je bent een AI-studiecoach. Een leerling heeft een vraag beantwoord. Geef feedback in een JSON-object.
    VRAAG: "${currentQuestion.vraag_tekst}"
    CORRECTIEMODEL: "${currentQuestion.correctie_model}"
    ANTWOORD LEERLING: "${answer}"
    BEOORDELING: ${isCorrect ? "Correct" : "Incorrect"}
    
    STRUCTUUR JSON-OBJECT:
    {
      "positive_reinforcement": "Een korte, bemoedigende opmerking over wat goed ging (bijv. 'Goed dat je het kernbegrip noemt!'). Zelfs bij een fout antwoord, zoek iets positiefs.",
      "core_mistake": "Als het antwoord fout is, identificeer de ENKELE kernfout in de redenering van de leerling. Wees beknopt. (Anders, lege string)",
      "detailed_explanation": "Leg stap-voor-stap uit hoe je tot het juiste antwoord komt volgens het correctiemodel. Vergelijk dit met het antwoord van de leerling als dat relevant is.",
      "mindset_tip": "Als het antwoord fout is, geef een korte, opbeurende tip over leren en groeien. (Bijv. 'Elke fout is een kans om te leren!'). (Anders, lege string)"
    }`;
    
    const feedbackResponse = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: feedbackPrompt, config: { responseMimeType: 'application/json' } });
    const aiFeedbackData = JSON.parse(feedbackResponse.text);

    if (isCorrect) {
        xpGained += 15; // Bonus for correct answer
        setConsecutiveIncorrectAnswers(0);
    } else {
        setSessionMistakeCount(prev => prev + 1);
        setConsecutiveIncorrectAnswers(prev => prev + 1);
    }
    addXp(xpGained);

    // Update Mastery Scores & Mistakes
    setSubjectData(prev => {
        const newSubjectData = { ...prev };
        const data = newSubjectData[currentSubject];
        
        // Mastery
        const skill = currentQuestion.kern_vaardigheid;
        if (!data.masteryScores[skill]) {
            data.masteryScores[skill] = { correct: 0, total: 0 };
        }
        if (isCorrect) {
            data.masteryScores[skill].correct++;
        }
        data.masteryScores[skill].total++;
        
        // Mistakes (for spaced repetition)
        if (!isCorrect) {
            const newMistake = {
                questionId: currentQuestion.id,
                userAnswer: answer,
                aiFeedback: aiFeedbackData.detailed_explanation,
                repetitionLevel: 0,
                nextReviewDate: new Date(Date.now() + repetitionSchedule[0] * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
            // Avoid adding duplicate mistakes
            if (!data.mistakes.some(m => m.questionId === newMistake.questionId)) {
                data.mistakes.push(newMistake);
            }
        }
        
        // Answered IDs
        data.answeredIds.push(currentQuestion.id);

        return newSubjectData;
    });
    
    setLastAnswer({
        isCorrect,
        question: currentQuestion,
        aiFeedback: aiFeedbackData,
        mindsetTip: aiFeedbackData.mindset_tip,
        xpGained,
        userAnswer: answer,
    });
    
    // Check for proactive interventions
    if (consecutiveIncorrectAnswers + 1 >= 3) {
      setIsBurnoutGuardModalOpen(true);
    }
    
    // Pre-load next question
    const nextIndex = activeSession.currentIndex + 1;
    if (nextIndex < activeSession.questions.length) {
        setNextQuestion(activeSession.questions[nextIndex]);
    } else {
        setNextQuestion(null); // Last question
    }
    
    setSessionQuestionCount(prev => prev + 1);

    setCurrentScreen('FEEDBACK');
  };
  
  return (
    <>
      <GlobalStyles />
      <div className={`app-wrapper ${currentScreen === 'QUESTION' || currentScreen === 'EXAM_SIMULATION' ? 'focus-mode' : ''}`}>
        {currentScreen === 'WELCOME' && <Welcome onContinue={handleWelcomeContinue} />}
        
        {currentScreen === 'DASHBOARD' && (
          <Dashboard
              masteryScores={currentData.masteryScores}
              onStartSession={handleGenerateSessionProposal}
              isGeneratingSession={isGeneratingSession}
              onReset={handleResetProgress}
              studyStreak={studyStreak}
              level={level}
              xp={xp}
              xpForNextLevel={xpForNextLevel}
              examDate={currentData.examDate}
              setExamDate={(date) => setSubjectData(prev => ({ ...prev, [currentSubject]: { ...prev[currentSubject], examDate: date } }))}
              studyPlan={currentData.studyPlan}
              generatePlan={handleGenerateOrUpdatePlan}
              updatePlan={() => handleGenerateOrUpdatePlan(true)}
              isGeneratingPlan={isGeneratingPlan}
              onToggleTask={handleToggleTask}
              onReviewWeek={handleReviewWeek}
              onShowInfo={handleShowInfo}
              onStartActionableTask={handleStartActionableTask}
              repetitionQueue={repetitionQueue}
              onStartRepetition={handleStartRepetition}
              onOpenChat={handleOpenChat}
              onOpenChatForQuestionGeneration={() => handleOpenChat(null, 'question_generation')}
              onOpenZenZone={handleOpenZenZone}
              isPremium={isPremium}
              onUpgrade={openUpgradeModal}
              onAnalyzeMistakes={handleAnalyzeMistakes}
              hasMistakes={currentData.mistakes.length > 0}
              currentSubject={currentSubject}
              onSubjectChange={handleSubjectChange}
              answerLimitReached={answerLimitReached}
              dailyAnswers={dailyAnswers}
              theme={theme}
              setTheme={setTheme}
              allBadges={allBadges}
              earnedBadges={earnedBadges}
              dailyQuests={currentData.dailyQuests}
              onGenerateDailyQuests={handleGenerateDailyQuests}
              isGeneratingQuests={isGeneratingQuests}
              onStartQuest={handleStartQuest}
              onStartExam={handleStartExamSimulation}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              progressHistory={currentData.progressHistory}
              flashcardDecks={currentData.flashcardDecks}
              onAddFlashcardDeck={handleAddFlashcardDeck}
              onCreateDeckFromSummary={handleCreateDeckFromSummary}
              onGenerateProgressAnalysis={handleGenerateProgressAnalysis}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              proactiveInsight={proactiveInsight}
              onProactiveAction={handleProactiveAction}
              onShareDeck={handleShareDeck}
              squadData={squadData}
              user={user}
              onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              onLogoClick={handleLogoClick}
              onOpenSquadOfficeHours={() => handleOpenChat(null, 'default', 'Je bent een AI-moderator voor een live groepssessie voor VWO-leerlingen. Stel een discussievraag over het moeilijkste onderwerp van de week.')}
              onGenerateParentTips={handleGenerateParentTips}
              parentTip={parentTip}
              isGeneratingParentTip={isGeneratingParentTip}
          />
        )}
        
        {currentScreen === 'QUESTION' && currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            allQuestions={questions}
            onSubmit={handleAnswerSubmit}
            onGetHint={handleGetHint}
            onOralPractice={handleOralPractice}
            user={user}
          />
        )}

        {currentScreen === 'LOADING' && <LoadingCard />}

        {currentScreen === 'FEEDBACK' && (
          <FeedbackCard
            question={lastAnswer.question}
            isCorrect={lastAnswer.isCorrect}
            onNext={activeSession && (activeSession.currentIndex + 1 < activeSession.questions.length) ? handleNextQuestion : null}
            onDashboard={handleFinishSession}
            inSession={!!activeSession}
            isLastQuestionInSession={!activeSession || (activeSession.currentIndex >= activeSession.questions.length - 1)}
            feedbackData={lastAnswer}
            onOpenChat={() => handleOpenChat(null, 'default', `De leerling heeft een vraag beantwoord over ${lastAnswer.question?.tekst_naam}. Het antwoord was ${lastAnswer.isCorrect ? 'correct' : 'fout'}. De vraag was: "${lastAnswer.question?.vraag_tekst}". Help de leerling dit beter te begrijpen.`)}
            onExplainConcept={handleExplainConcept}
            onAnalyzeThinkingProcess={handleAnalyzeThinkingProcess}
            answerLimitReached={answerLimitReached}
            onUpgrade={() => openUpgradeModal('om meer vragen per dag te beantwoorden.')}
            onGetSimplifiedExplanation={handleGetSimplifiedExplanation}
            onGetAnalogy={handleGetAnalogy}
          />
        )}
        
        {currentScreen === 'REPETITION' && repetitionQueue.length > 0 && (
            <RepetitionCard
                mistake={repetitionQueue[currentRepetitionIndex]}
                allQuestions={questions}
                currentIndex={currentRepetitionIndex}
                totalMistakes={repetitionQueue.length}
                onGotIt={(id) => {
                    // Logic for removing from queue or moving to next level
                    setSubjectData(prev => {
                        const data = prev[currentSubject];
                        const mistake = data.mistakes.find(m => m.questionId === id);
                        if (mistake) {
                            mistake.repetitionLevel++;
                            mistake.nextReviewDate = new Date(Date.now() + repetitionSchedule[mistake.repetitionLevel] * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        }
                        return { ...prev };
                    });
                    
                    if (currentRepetitionIndex < repetitionQueue.length - 1) {
                        setCurrentRepetitionIndex(prev => prev + 1);
                    } else {
                        setRepetitionQueue([]);
                        setCurrentScreen('DASHBOARD');
                    }
                }}
                onDashboard={() => setCurrentScreen('DASHBOARD')}
            />
        )}
        
        {currentScreen === 'EXAM_SIMULATION' && examState && (
            <ExamSimulation 
                examState={examState}
                onAnswer={(ans) => {
                     setExamState(prev => prev ? {...prev, answers: prev.answers.map((a, i) => i === prev.currentIndex ? ans : a)} : null);
                }}
                onNavigate={(dir) => {
                    setExamState(prev => {
                        if(!prev) return null;
                        const newIndex = dir === 'next' ? prev.currentIndex + 1 : prev.currentIndex - 1;
                        return {...prev, currentIndex: newIndex};
                    });
                }}
                onFlag={(index) => {
                    setExamState(prev => prev ? {...prev, flags: prev.flags.map((f, i) => i === index ? !f : f)} : null);
                }}
                onJumpToQuestion={(index) => {
                     setExamState(prev => prev ? {...prev, currentIndex: index} : null);
                }}
                onSubmit={handleExamSubmit}
            />
        )}

        {currentScreen === 'MINDFUL_MOMENT' && (
            <MindfulMoment onContinue={() => setCurrentScreen('QUESTION')} />
        )}
        
        {/* Modals */}
        <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            chatHistory={chatHistory}
            onSendMessage={async (msg) => {
                if (!chatSession.current) return;
                
                const newHistory = [...chatHistory, { role: 'user', text: msg }];
                setChatHistory(newHistory as ChatMessage[]);
                setIsSendingMessage(true);
                
                // Update usage
                const today = new Date().toISOString().split('T')[0];
                if (!isPremium) {
                    setChatUsage(prev => {
                        if (prev.date !== today) return { count: 1, date: today };
                        return { ...prev, count: prev.count + 1 };
                    });
                }

                try {
                    const result = await chatSession.current.sendMessage(msg);
                    const responseText = result.response.text;
                    setChatHistory([...newHistory, { role: 'model', text: responseText }] as ChatMessage[]);
                } catch (e) {
                    setChatHistory([...newHistory, { role: 'model', text: "Sorry, ik kon geen verbinding maken." }] as ChatMessage[]);
                } finally {
                    setIsSendingMessage(false);
                }
            }}
            isSending={isSendingMessage}
            chatLimitReached={chatLimitReached}
        />

        <UpgradeModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
            onUpgrade={() => {
                setIsUpgradeModalOpen(false);
                setIsPaymentModalOpen(true);
            }}
            reason={upgradeModalReason}
        />
        
        <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={() => {
                setIsPaymentModalOpen(false);
                setIsPremium(true);
                alert("Welkom bij GLOW PRO!");
            }}
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
            onExplainEli5={handleExplainEli5}
        />
        
        <WeekReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            weekTheme={weekToReview?.theme || ''}
            reviewContent={reviewContent}
            isLoading={isGeneratingReview}
        />
        
        <AnalysisModal
            isOpen={isAnalysisModalOpen}
            onClose={() => setIsAnalysisModalOpen(false)}
            title="Mijn Foutenanalyse"
            loadingText="Je fouten worden geanalyseerd op patronen..."
            analysisContent={analysisContent}
            isLoading={isGeneratingAnalysis}
        />
        
        <ThinkingProcessModal
            isOpen={isThinkingProcessModalOpen}
            onClose={() => setIsThinkingProcessModalOpen(false)}
            questionContext={thinkingProcessQuestion}
            onAnalyze={handleAnalyzeThinking}
        />
        
        <MasterySessionModal
            isOpen={isMasterySessionModalOpen}
            onClose={() => setIsMasterySessionModalOpen(false)}
            skillName={skillForMasterySession || ''}
            onGenerate={async (skill) => {
                 // Mock generator for mastery session content
                 const prompt = `Maak een korte 'Meesterschapssessie' voor de vaardigheid: ${skill}. JSON format.
                 {
                    "explanation": "Korte uitleg van concept",
                    "guided_example": { "question": "Voorbeeldvraag", "thinking_process": "Stap voor stap uitleg" },
                    "practice_questions": [
                        { "question": "Oefenvraag 1", "options": ["A", "B"], "correct_option": "A", "feedback_correct": "Goed!", "feedback_incorrect": "Fout, want..." },
                        { "question": "Oefenvraag 2", "options": ["A", "B"], "correct_option": "B", "feedback_correct": "Netjes!", "feedback_incorrect": "Niet helemaal." }
                    ],
                    "final_tip": "Gouden tip"
                 }`;
                 const res = await generateContentWithRetry({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
                 return JSON.parse(res.text);
            }}
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
            skillName={Object.keys(consecutiveMistakes)[0] || ''}
            onStart={() => {
                setSkillForMasterySession(Object.keys(consecutiveMistakes)[0] || 'Algemeen');
                setIsWeakSpotModalOpen(false);
                setIsMasterySessionModalOpen(true);
            }}
        />

        <ExamStartModal
            isOpen={isExamStartModalOpen}
            onClose={() => setIsExamStartModalOpen(false)}
            onConfirm={handleConfirmStartExam}
            questionCount={EXAM_SIMULATION_QUESTIONS}
            timeLimitMinutes={30}
        />
        
        {isExamAnalysisModalOpen && examAnalysisResult && (
            <div className="modal-overlay" style={{display: 'block', overflowY: 'auto'}}>
                 <div className="card modal-content" style={{maxWidth: '800px', margin: '32px auto'}} onClick={e => e.stopPropagation()}>
                    <ExamResults 
                        results={examAnalysisResult}
                        onClose={() => setIsExamAnalysisModalOpen(false)}
                    />
                 </div>
            </div>
        )}
        
        <UploadAnalysisModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onAnalyze={handleUploadAnalyze}
            isAnalyzing={isAnalyzingUpload}
        />
        
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
        />
        
        <PulseCheckModal
            isOpen={isPulseCheckModalOpen}
            onClose={() => setIsPulseCheckModalOpen(false)}
            onSubmit={handlePulseCheckSubmit}
            subject={currentSubject}
            userName={user?.name || 'Student'}
        />
        
        <OralPracticeModal
            isOpen={isOralPracticeOpen}
            onClose={() => setIsOralPracticeOpen(false)}
            question={oralPracticeQuestion}
            onSubmit={handleOralSubmit}
        />
        
        <TutorInterventionModal
            isOpen={!!tutorIntervention}
            onClose={() => setTutorIntervention(null)}
            message={tutorIntervention || ''}
        />
        
        <SessionSummaryModal
            isOpen={isSessionSummaryModalOpen}
            onClose={() => setIsSessionSummaryModalOpen(false)}
            summary={sessionSummaryContent}
            isLoading={isGeneratingSummary}
        />
        
        <BurnoutGuardModal
            isOpen={isBurnoutGuardModalOpen}
            onClose={() => {
                setIsBurnoutGuardModalOpen(false);
                setConsecutiveIncorrectAnswers(0);
            }}
            onTakeBreak={() => {
                setIsBurnoutGuardModalOpen(false);
                setIsZenZoneOpen(true);
                setConsecutiveIncorrectAnswers(0);
            }}
        />

        <GamedayModal
            isOpen={isGamedayModalOpen}
            onClose={() => setIsGamedayModalOpen(false)}
            userName={user?.name || 'Student'}
            subject={currentSubject}
            masteryScores={currentData.masteryScores}
        />
        
        <AdminStatsModal
            isOpen={isAdminStatsModalOpen}
            onClose={() => setIsAdminStatsModalOpen(false)}
            subjectData={subjectData}
            level={level}
            xp={xp}
        />
        
        <FeatureFeedbackModal
            isOpen={isFeatureFeedbackModalOpen}
            onClose={() => setIsFeatureFeedbackModalOpen(false)}
            onSubmit={(helpful) => {
                // Send feedback
                setIsFeatureFeedbackModalOpen(false);
            }}
            feature={feedbackContext?.feature || ''}
        />
      </div>
    </>
  );
};

export default App;
