'use client';

import { useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { BookOpen, Sparkles, Send, Mic, Smile, Meh, Frown, Heart, Zap, Cloud } from 'lucide-react';

export default function DiaryPage() {
  const [mood, setMood] = useState<string>('');
  const [energy, setEnergy] = useState<number>(5);
  const [stress, setStress] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const moods = [
    { value: 'excellent', label: 'Excelente', emoji: '😄', color: 'from-green-400 to-emerald-500' },
    { value: 'good', label: 'Bom', emoji: '🙂', color: 'from-teal-400 to-cyan-500' },
    { value: 'neutral', label: 'Neutro', emoji: '😐', color: 'from-yellow-400 to-orange-400' },
    { value: 'bad', label: 'Ruim', emoji: '😟', color: 'from-orange-400 to-red-400' },
    { value: 'terrible', label: 'Péssimo', emoji: '😢', color: 'from-red-400 to-pink-500' },
  ];

  const emotionOptions = [
    { value: 'happy', label: 'Feliz', emoji: '😊' },
    { value: 'anxious', label: 'Ansioso', emoji: '😰' },
    { value: 'calm', label: 'Calmo', emoji: '😌' },
    { value: 'tired', label: 'Cansado', emoji: '😴' },
    { value: 'motivated', label: 'Motivado', emoji: '💪' },
    { value: 'stressed', label: 'Estressado', emoji: '😓' },
    { value: 'grateful', label: 'Grato', emoji: '🙏' },
    { value: 'frustrated', label: 'Frustrado', emoji: '😤' },
  ];

  const toggleEmotion = (emotion: string) => {
    setEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (!mood || !notes.trim()) {
      alert('Por favor, selecione seu humor e escreva algo sobre seu dia.');
      return;
    }

    setIsAnalyzing(true);

    // Simular análise da IA (em produção, chamar API real)
    setTimeout(() => {
      setAiAnalysis(
        'Percebo que você está passando por um momento desafiador. É completamente normal ter dias assim. O importante é que você está se permitindo sentir e expressar suas emoções, o que já é um grande passo.'
      );
      setAiRecommendations([
        '🧘 Pratique 10 minutos de meditação guiada para acalmar a mente',
        '🚶 Faça uma caminhada ao ar livre para renovar suas energias',
        '💬 Converse com alguém de confiança sobre como está se sentindo',
        '📝 Escreva 3 coisas pelas quais você é grato hoje',
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Diário Emocional
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registre seus sentimentos e receba insights personalizados da IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Como você está se sentindo?
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
                      mood === m.value
                        ? `bg-gradient-to-br ${m.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-3xl mb-2">{m.emoji}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy & Stress Levels */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Nível de Energia</span>
                    </label>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      {energy}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Cloud className="w-4 h-4 text-orange-500" />
                      <span>Nível de Estresse</span>
                    </label>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {stress}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={(e) => setStress(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Emotions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Que emoções você está sentindo?
              </h3>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => toggleEmotion(emotion.value)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      emotions.includes(emotion.value)
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-2">{emotion.emoji}</span>
                    <span className="text-sm font-medium">{emotion.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Como foi seu dia?
                </h3>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva sobre seus pensamentos, sentimentos e experiências do dia..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notes.length} caracteres
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>Analisando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Analisar com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - AI Analysis */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Resumo de Hoje
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Humor</span>
                  <span className="text-2xl">
                    {mood ? moods.find((m) => m.value === mood)?.emoji : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energia</span>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                    {energy}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estresse</span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {stress}/10
                  </span>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Análise da IA
                  </h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{aiAnalysis}</p>

                {aiRecommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Recomendações:
                    </h4>
                    {aiRecommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-purple-600 dark:text-purple-400">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">7 dias</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sequência atual</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue registrando seus sentimentos diariamente! 🎉
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
