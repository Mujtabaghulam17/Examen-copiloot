import React, { useState, useEffect, useRef } from 'react';
import { Modality } from "@google/genai";
import { ai } from '../api/gemini.ts';
import { decode, decodeAudioData } from '../utils/audio.ts';
import type { Question } from '../data/data.ts';

const SpeakerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
);

const StopIcon = () => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><rect x="6" y="6" width="12" height="12"></rect></svg>
);

const LoadingIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6"></path><path d="M2.5 22v-6h6"></path>
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3l-2.8 1.1"></path>
        <path d="M22 12.5a10 10 0 0 1-18.8 4.3l2.8-1.1"></path>
    </svg>
);


const QuestionCard: React.FC<{ question: Question; allQuestions: Question[]; onSubmit: (answer: string) => void; onGetHint: () => Promise<string>; }> = ({ question, allQuestions, onSubmit, onGetHint }) => {
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Timer effect
  useEffect(() => {
    setTimeLeft(180); // Reset timer for each new question
    if (!question) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          onSubmit(''); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on component unmount or question change
  }, [question, onSubmit]);

  useEffect(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return () => {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
    };
  }, []);

  const handleToggleSpeech = async (textToSpeak: string, id: string) => {
      if (audioState === 'playing' && activeSpeechId === id) {
          if (audioSourceRef.current) {
              audioSourceRef.current.stop();
          }
          setAudioState('idle');
          setActiveSpeechId(null);
          return;
      }
      
      if (audioSourceRef.current) {
         audioSourceRef.current.stop();
      }

      setActiveSpeechId(id);
      setAudioState('loading');
      
      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: textToSpeak }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio && audioContextRef.current) {
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setAudioState('idle');
                setActiveSpeechId(null);
            };
            source.start();
            audioSourceRef.current = source;
            setAudioState('playing');
        } else {
            throw new Error("No audio data received");
        }
      } catch(error) {
        console.error("Error generating or playing speech:", error);
        setAudioState('idle');
        setActiveSpeechId(null);
      }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      if (audioSourceRef.current) audioSourceRef.current.stop();
      setAudioState('idle');
      setActiveSpeechId(null);
      onSubmit(answer);
    }
  };

  const handleGetHint = async () => {
      setIsHintLoading(true);
      const hintText = await onGetHint();
      setHint(hintText);
      setIsHintLoading(false);
  }

  let passageToShow = question.vraag_passage;
  if (!passageToShow && question.context_id) {
    const contextQuestion = allQuestions.find(q => q.id === question.context_id);
    if (contextQuestion) {
      passageToShow = contextQuestion.vraag_passage;
    }
  }

  const renderSpeechIcon = (id: string) => {
      if (activeSpeechId === id) {
        if (audioState === 'loading') return <LoadingIcon />;
        if (audioState === 'playing') return <StopIcon />;
      }
      return <SpeakerIcon />;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="card">
      <div className={`question-timer ${timeLeft < 30 ? 'low-time' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      <div style={{color: 'var(--subtle-text)', fontSize: '14px', marginBottom: '16px'}}>
        {question.examen_id} / Vraag {question.vraag_nummer}
      </div>
      {passageToShow && (
        <div className="passage readable-content">
            {passageToShow}
            <button
                onClick={() => handleToggleSpeech(passageToShow!, 'passage')}
                className={`speech-button ${activeSpeechId === 'passage' ? 'active' : ''}`}
                aria-label={audioState === 'playing' && activeSpeechId === 'passage' ? "Stop met voorlezen" : "Lees passage voor"}
                disabled={audioState === 'loading'}
            >
               {renderSpeechIcon('passage')}
            </button>
        </div>
      )}
      <div className="readable-content">
          <p className="question-text">{question.vraag_tekst}</p>
           <button
                onClick={() => handleToggleSpeech(question.vraag_tekst, 'question')}
                className={`speech-button ${activeSpeechId === 'question' ? 'active' : ''}`}
                aria-label={audioState === 'playing' && activeSpeechId === 'question' ? "Stop met voorlezen" : "Lees vraag voor"}
                disabled={audioState === 'loading'}
            >
               {renderSpeechIcon('question')}
            </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {question.options ? (
            <div className="mcq-options">
                {question.options.map((option, index) => (
                    <div key={index}>
                        <input 
                            type="radio" 
                            id={`option-${index}`} 
                            name="mcq" 
                            value={option} 
                            checked={answer === option}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="mcq-input"
                        />
                        <label htmlFor={`option-${index}`} className="mcq-label">{option}</label>
                    </div>
                ))}
            </div>
        ) : (
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Typ hier je antwoord..."
              aria-label="Antwoord invoerveld"
            />
        )}
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
             <button type="submit" className="button" disabled={!answer.trim()}>
                Antwoord insturen
            </button>
            {!hint && (
                 <button type="button" className="button-tertiary" onClick={handleGetHint} disabled={isHintLoading}>
                    {isHintLoading ? 'Hint wordt opgehaald...' : 'Krijg een hint'}
                </button>
            )}
        </div>
      </form>
       {hint && <div className="hint-box">{hint}</div>}
    </div>
  );
};

export default QuestionCard;