import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Sparkles, X, Heart, Trash2, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import {
  SOUNDS,
  speakSpanish,
  testLucyVoiceSample,
  getLatinAmericanVoice,
  getAvailableFemaleVoices,
  getPreferredVoiceName,
  setPreferredVoiceName,
} from '../utils/audio';
import { GAME_IMAGES } from '../utils/assets';

interface VoiceChatModalProps {
  onClose: () => void;
}

export const VoiceChatModal: React.FC<VoiceChatModalProps> = ({ onClose }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<'Lucy' | 'Happy' | 'Fede'>('Lucy');
  const [modelType, setModelType] = useState<'general' | 'fast' | 'complex'>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedVoiceName, setDetectedVoiceName] = useState<string>('Voz Latina Neutra');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(getPreferredVoiceName());

  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; speaker?: string; text: string }[]>([
    {
      role: 'model',
      speaker: 'Lucy',
      text: '¡Hola amiguito! Soy Lucy. Me encanta jugar en el parque con Happy y Fede y aprender palabras mágicas. ¿De qué te gustaría platicar hoy?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    const updateVoiceList = () => {
      const femaleVoices = getAvailableFemaleVoices();
      setAvailableVoices(femaleVoices);
      const v = getLatinAmericanVoice();
      if (v) {
        setDetectedVoiceName(v.name);
        if (!selectedVoiceName) {
          setSelectedVoiceName(v.name);
        }
      }
    };

    updateVoiceList();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
  }, [selectedVoiceName]);

  const handleVoiceChange = (voiceName: string) => {
    SOUNDS.tap();
    setSelectedVoiceName(voiceName);
    setPreferredVoiceName(voiceName);
    setDetectedVoiceName(voiceName);
    speakSpanish('¡Hola! Ahora hablo con esta voz latina dulce y alegre.', { pitch: 1.34, rate: 0.98 });
  };

  const quickQuestions = [
    '¿Cuál es tu juego favorito con Happy y Fede?',
    '¿Qué letras podemos aprender hoy en el parque?',
    '¡Te quiero mucho, Lucy!',
    '¿Cómo podemos cuidar a los animalitos del lago?',
    '¿Qué palabra empieza con la letra M?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    SOUNDS.tap();
    const userMsg = textToSend.trim();
    setInputMessage('');

    // Append to local history
    const updatedHistory = [...chatHistory, { role: 'user' as const, text: userMsg }];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      // Send conversation history to backend for true multi-turn context
      const res = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          speaker: selectedSpeaker,
          modelType,
          history: updatedHistory.slice(-8), // Send recent context turns
        }),
      });

      const data = await res.json();
      const reply = data.reply || '¡Qué lindo jugar contigo! Te mando un abrazo.';

      setChatHistory((prev) => [
        ...prev,
        { role: 'model', speaker: selectedSpeaker, text: reply },
      ]);

      // Speak using sweet neutral Latin American young girl voice
      const voicePitch = selectedSpeaker === 'Lucy' ? 1.35 : selectedSpeaker === 'Happy' ? 1.45 : 1.18;
      speakSpanish(reply, { pitch: voicePitch, rate: 0.98 });
    } catch (e) {
      const fallbackReply = '¡Guau guau! ¡Nos alegra mucho ser tus amigos y jugar juntos!';
      setChatHistory((prev) => [
        ...prev,
        { role: 'model', speaker: selectedSpeaker, text: fallbackReply },
      ]);
      speakSpanish(fallbackReply, { pitch: 1.35, rate: 0.98 });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speakSpanish('Tu navegador no soporta micrófono directo. ¡Puedes escribir o tocar las preguntas rápidas!');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-419'; // Neutral Latin American Spanish
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    SOUNDS.tap();
    setChatHistory([
      {
        role: 'model',
        speaker: 'Lucy',
        text: '¡Conversación reiniciada! ¿Qué aventura jugaremos ahora?',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-sky-50 rounded-3xl border-4 border-sky-300 shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-5 py-3 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <img
              src={GAME_IMAGES.lucyAvatar}
              alt="Lucy"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-2xl object-contain p-0.5 bg-white/30 border-2 border-white/90 shadow-xs"
            />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Chatbot Multiturno: El Mundo de Lucy
              </h2>
              <span className="text-xs text-rose-100 font-medium">
                Voz latina de niña con acento neutro · Gemini AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Limpiar conversación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                SOUNDS.tap();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice & Model Config Bar */}
        <div className="bg-white/95 px-4 py-2.5 border-b border-sky-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Active Voice Tag & Test Button */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1.5 shadow-2xs">
              <span className="text-sm">👧</span>
              <span>Voz Latina de Niña Joven</span>
              <span className="text-[10px] bg-rose-200/70 text-rose-800 px-1.5 py-0.2 rounded font-black">Acento Neutro</span>
            </span>

            {/* If browser has multiple female voices, allow switching */}
            {availableVoices.length > 1 && (
              <select
                value={selectedVoiceName}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="bg-white border border-rose-200 text-rose-900 text-xs font-bold rounded-xl px-2 py-1 cursor-pointer focus:outline-rose-400"
                title="Seleccionar entre voces femeninas detectadas"
              >
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={testLucyVoiceSample}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black px-2.5 py-1 rounded-xl border border-amber-300 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs active:scale-95"
              title="Escuchar muestra de voz de Lucy"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Probar Voz</span>
            </button>
          </div>

          {/* Model Selector (Gemini 3.5 Flash / Flash-Lite / Pro) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                SOUNDS.tap();
                setModelType('fast');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                modelType === 'fast' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
              title="gemini-3.1-flash-lite (Rápido)"
            >
              ⚡ Rápido
            </button>
            <button
              onClick={() => {
                SOUNDS.tap();
                setModelType('general');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                modelType === 'general' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
              title="gemini-3.5-flash (General)"
            >
              🧠 General
            </button>
            <button
              onClick={() => {
                SOUNDS.tap();
                setModelType('complex');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                modelType === 'complex' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
              title="gemini-3.1-pro-preview (Avanzado)"
            >
              🌟 Avanzado
            </button>
          </div>
        </div>

        {/* Speaker Role Selector Tabs */}
        <div className="bg-sky-100/70 p-2 border-b border-sky-200 flex items-center justify-center gap-2">
          {(['Lucy', 'Happy', 'Fede'] as const).map((spk) => {
            const avatarImg =
              spk === 'Happy'
                ? GAME_IMAGES.happyAvatar
                : spk === 'Fede'
                ? GAME_IMAGES.fedeAvatar
                : GAME_IMAGES.lucyAvatar;

            return (
              <button
                key={spk}
                onClick={() => {
                  SOUNDS.tap();
                  setSelectedSpeaker(spk);
                  speakSpanish(`Ahora hablas con ${spk}`, { pitch: 1.34, rate: 0.98 });
                }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  selectedSpeaker === spk
                    ? 'bg-rose-500 text-white shadow-xs scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <img
                  src={avatarImg}
                  alt={spk}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-white/80"
                />
                <span>
                  {spk === 'Lucy'
                    ? 'Lucy'
                    : spk === 'Happy'
                    ? 'Happy'
                    : 'Federica'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-sky-50/50 to-white">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-rose-300 shrink-0 shadow-xs bg-rose-50 flex items-center justify-center">
                  <img
                    src={
                      msg.speaker === 'Happy'
                        ? GAME_IMAGES.happyAvatar
                        : msg.speaker === 'Fede'
                        ? GAME_IMAGES.fedeAvatar
                        : GAME_IMAGES.lucyAvatar
                    }
                    alt={msg.speaker || 'Lucy'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-0.5 filter drop-shadow-xs"
                  />
                </div>
              )}
              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium shadow-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border-2 border-rose-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="text-[10px] font-black text-rose-600 uppercase tracking-wider mb-1">
                    {msg.speaker || 'Lucy'}
                  </div>
                )}
                <p>{msg.text}</p>
                {msg.role === 'model' && (
                  <button
                    onClick={() =>
                      speakSpanish(msg.text, {
                        pitch: msg.speaker === 'Lucy' ? 1.35 : msg.speaker === 'Happy' ? 1.45 : 1.18,
                        rate: 0.98,
                      })
                    }
                    className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Escuchar con voz latina de niña</span>
                  </button>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                  🌟
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs font-bold text-rose-700 bg-white p-3 rounded-2xl border-2 border-rose-200 w-fit shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
              <span>{selectedSpeaker} está pensando su respuesta con voz dulce...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-white/80 border-t border-sky-100 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-bold bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-sky-200 flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
            title="Hablar por micrófono con acento latino"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            placeholder={`Escríbele a ${selectedSpeaker} en español...`}
            className="flex-1 p-2.5 text-xs sm:text-sm font-medium border-2 border-rose-200 rounded-2xl focus:outline-rose-500 bg-rose-50/30"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-2xl shadow-sm cursor-pointer transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
