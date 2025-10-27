import React, { useState, useEffect, useRef } from 'react';
import { Modality, Type } from "@google/genai";
import { ai } from '../api/gemini.ts';
import { decode, decodeAudioData } from '../utils/audio.ts';
import BreathingExercise from './BreathingExercise.tsx';

interface ZenZoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    affirmation: string;
    onGenerateAffirmation: () => void;
    isGenerating: boolean;
}

interface BreathingPhase {
    text: string;
    duration: number;
    type: 'inhale' | 'hold' | 'exhale';
}

const ZenZoneModal: React.FC<ZenZoneModalProps> = ({ isOpen, onClose, affirmation, onGenerateAffirmation, isGenerating }) => {
    const [guidedAudioState, setGuidedAudioState] = useState<'idle' | 'loading' | 'playing' | 'finished'>('idle');
    const [breathingText, setBreathingText] = useState('Adem in... Adem uit...');
    const [currentPhase, setCurrentPhase] = useState<{type: string, duration: number} | null>(null);
    const [activeSound, setActiveSound] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
        }
        return () => { // Cleanup on close
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            if(phaseTimeoutRef.current) {
                clearTimeout(phaseTimeoutRef.current);
            }
            setGuidedAudioState('idle');
            setBreathingText('Adem in... Adem uit...');
            setCurrentPhase(null);
            setActiveSound(null);
        };
    }, [isOpen]);

    const runExercisePhases = (phases: BreathingPhase[], index = 0) => {
        if (index >= phases.length) {
            setGuidedAudioState('finished');
            setCurrentPhase(null);
            setBreathingText("Goed gedaan. Voel de rust.");
            return;
        }
        const phase = phases[index];
        setBreathingText(phase.text);
        setCurrentPhase({ type: phase.type, duration: phase.duration });
        
        phaseTimeoutRef.current = setTimeout(() => {
            runExercisePhases(phases, index + 1);
        }, phase.duration * 1000);
    };

    const handleStartGuidedExercise = async () => {
        if (guidedAudioState === 'playing') {
            if (audioSourceRef.current) audioSourceRef.current.stop();
            if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
            setGuidedAudioState('idle');
            setCurrentPhase(null);
            setBreathingText('Adem in... Adem uit...');
            return;
        }
        
        setGuidedAudioState('loading');
        try {
            const exercisePrompt = "Genereer een gestructureerde ademhalingsoefening. Geef een JSON-object terug met een 'phases' array. Elke fase heeft een 'text' (bijv. 'Adem nu diep in door je neus'), 'duration' (in seconden, tussen 3 en 6), en 'type' ('inhale', 'hold', of 'exhale'). Creëer 3 tot 4 fasen in totaal (bijv. inhale, hold, exhale).";
            
            const exerciseResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: exercisePrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            phases: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING },
                                        duration: { type: Type.NUMBER },
                                        type: { type: Type.STRING, enum: ['inhale', 'hold', 'exhale'] }
                                    },
                                    required: ["text", "duration", "type"]
                                }
                            }
                        },
                        required: ["phases"]
                    }
                }
            });
            
            const exerciseData = JSON.parse(exerciseResponse.text);
            const phases: BreathingPhase[] = exerciseData.phases;
            const fullScript = phases.map(p => p.text).join('... ');

            const audioResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: fullScript }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                },
            });

            const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.start();
                audioSourceRef.current = source;
                setGuidedAudioState('playing');
                runExercisePhases(phases);
            } else {
                throw new Error("No audio data received");
            }

        } catch (error) {
            console.error("Failed to start guided exercise:", error);
            setGuidedAudioState('idle');
            setBreathingText('Oeps, er ging iets mis.');
        }
    };
    
    const handleSoundClick = (sound: string) => {
        if (activeSound === sound) {
            setActiveSound(null);
            // Here you would stop the actual audio playback
        } else {
            setActiveSound(sound);
            // Here you would start the audio playback for the selected sound
        }
    };

    const getGuidedButtonText = () => {
        switch (guidedAudioState) {
            case 'loading': return 'Voorbereiden...';
            case 'playing': return 'Stop Oefening';
            case 'finished': return 'Start Opnieuw';
            default: return 'Start Begeleide Oefening';
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card modal-content" onClick={(e) => e.stopPropagation()}>
                 <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '48px' }} role="img" aria-label="Lotus flower">🧘</span>
                    <h2 style={{ marginTop: '16px', color: 'var(--primary-color)' }}>Zen Zone</h2>
                    <p style={{ color: 'var(--subtle-text)', lineHeight: 1.6 }}>
                        Neem een moment om te ontspannen en je focus te hervinden.
                    </p>
                </div>
                
                <BreathingExercise text={breathingText} phase={currentPhase} />
                <div style={{textAlign: 'center', marginTop: '-16px'}}>
                    <button className="button-tertiary" onClick={handleStartGuidedExercise} disabled={guidedAudioState === 'loading'}>{getGuidedButtonText()}</button>
                </div>
                
                 <div className="focus-sounds-section">
                    <h3>Focusgeluiden</h3>
                    <div className="sound-buttons">
                        <button className={`button-tertiary ${activeSound === 'rain' ? 'active' : ''}`} onClick={() => handleSoundClick('rain')}>Regen</button>
                        <button className={`button-tertiary ${activeSound === 'forest' ? 'active' : ''}`} onClick={() => handleSoundClick('forest')}>Bos</button>
                        <button className={`button-tertiary ${activeSound === 'cafe' ? 'active' : ''}`} onClick={() => handleSoundClick('cafe')}>Café</button>
                    </div>
                </div>

                <div className="affirmation-section">
                    <h3>Positieve Affirmatie</h3>
                    <div className="affirmation-box">
                        {isGenerating ? 'Aan het denken...' : (affirmation || 'Klik op de knop voor een opkikker.')}
                    </div>
                    <button className="button button-secondary" onClick={onGenerateAffirmation} disabled={isGenerating}>
                        {isGenerating ? 'Genereren...' : 'Geef me een affirmatie'}
                    </button>
                </div>

                <div style={{marginTop: '24px'}}>
                     <button onClick={onClose} className="button">Ik ben klaar om door te gaan</button>
                </div>
            </div>
        </div>
    );
};

export default ZenZoneModal;
