'use client';

import { LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export default function ProgressCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  progress,
  trend,
}: ProgressCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            {trend === 'up' && (
              <>
                <span className="text-green-500 text-xs">↗</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Melhorando
                </span>
              </>
            )}
            {trend === 'down' && (
              <>
                <span className="text-red-500 text-xs">↘</span>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Precisa atenção
                </span>
              </>
            )}
            {trend === 'neutral' && (
              <>
                <span className="text-gray-500 text-xs">→</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Estável
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
