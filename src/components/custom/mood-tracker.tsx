'use client';

import { Smile, Meh, Frown } from 'lucide-react';

interface MoodTrackerProps {
  currentMood?: string;
  energyLevel?: number;
  onMoodSelect?: (mood: string) => void;
}

const moods = [
  { value: 'excellent', label: 'Excelente', emoji: '😄', color: 'from-green-400 to-emerald-500' },
  { value: 'good', label: 'Bom', emoji: '🙂', color: 'from-teal-400 to-cyan-500' },
  { value: 'neutral', label: 'Neutro', emoji: '😐', color: 'from-yellow-400 to-orange-400' },
  { value: 'bad', label: 'Ruim', emoji: '😟', color: 'from-orange-400 to-red-400' },
  { value: 'terrible', label: 'Péssimo', emoji: '😢', color: 'from-red-400 to-pink-500' },
];

export default function MoodTracker({ currentMood, energyLevel, onMoodSelect }: MoodTrackerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Como você está hoje?
        </h3>
        <Smile className="w-6 h-6 text-teal-500" />
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodSelect?.(mood.value)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
              currentMood === mood.value
                ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Energy Level */}
      {energyLevel !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nível de Energia
            </span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
              {energyLevel}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${energyLevel * 10}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Ações rápidas para melhorar seu dia:
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors">
            🧘 Meditar 5min
          </button>
          <button className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors">
            🚶 Caminhar
          </button>
          <button className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
            💬 Conversar com IA
          </button>
        </div>
      </div>
    </div>
  );
}
