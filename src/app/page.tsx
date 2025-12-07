'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/custom/navbar';
import MoodTracker from '@/components/custom/mood-tracker';
import ProgressCard from '@/components/custom/progress-card';
import { Target, Zap, TrendingUp, Award, Flame, Star, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getCurrentUser, getUserProfile } from '@/lib/supabase/auth';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [currentMood, setCurrentMood] = useState<string>('good');
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    habitsCompleted: 0,
    totalHabits: 0,
    currentStreak: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 1500,
    energyLevel: 7,
    weeklyProgress: 0,
  });
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);

      // Verificar se completou onboarding
      if (!userProfile.onboarding_completed) {
        router.push('/onboarding');
        return;
      }

      // Carregar estatísticas
      await loadStats(user.id);
      await loadTasks(user.id);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (userId: string) => {
    try {
      // Carregar hábitos de hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);

      // Calcular progresso semanal
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: weekCompletions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_at', weekAgo.toISOString());

      const weeklyProgress = habits && habits.length > 0
        ? Math.round(((weekCompletions?.length || 0) / (habits.length * 7)) * 100)
        : 0;

      setStats({
        habitsCompleted: completions?.length || 0,
        totalHabits: habits?.length || 0,
        currentStreak: profile?.current_streak || 0,
        level: profile?.level || 1,
        xp: profile?.xp || 0,
        nextLevelXp: (profile?.level || 1) * 1500,
        energyLevel: 7,
        weeklyProgress,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadTasks = async (userId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('due_date', today)
        .order('created_at', { ascending: true });

      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null,
        })
        .eq('id', taskId);

      if (error) throw error;

      // Atualizar XP se completou
      if (!completed && profile) {
        const task = tasks.find((t) => t.id === taskId);
        const newXp = profile.xp + (task?.xp_reward || 50);
        await supabase
          .from('profiles')
          .update({ xp: newXp })
          .eq('id', profile.id);

        toast.success(`+${task?.xp_reward || 50} XP!`);
      }

      // Recarregar dados
      loadUserData();
    } catch (error: any) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  const recommendations = [
    {
      title: 'Exercício de Respiração',
      description: 'Reduza a ansiedade com 5 minutos de respiração guiada',
      icon: '🌬️',
      action: '/breathing',
    },
    {
      title: 'Trilha de Foco',
      description: 'Continue sua jornada de produtividade',
      icon: '🎯',
      action: '/trails',
    },
    {
      title: 'Conversar com Coach IA',
      description: 'Compartilhe como está se sentindo hoje',
      icon: '💬',
      action: '/chat',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <span className="text-sm font-medium">Bem-vindo de volta!</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Olá, {profile?.full_name || 'Usuário'}! 👋
              </h1>
              <p className="text-teal-100 mb-4">
                Você está no nível {stats.level} com {stats.currentStreak} dias de sequência. Continue assim!
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Dispensar
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Hábitos Hoje"
            value={`${stats.habitsCompleted}/${stats.totalHabits}`}
            subtitle="Continue assim!"
            icon={Target}
            gradient="from-teal-400 to-cyan-500"
            progress={stats.totalHabits > 0 ? (stats.habitsCompleted / stats.totalHabits) * 100 : 0}
            trend="up"
          />
          <ProgressCard
            title="Sequência"
            value={`${stats.currentStreak} dias`}
            subtitle="Recorde pessoal"
            icon={Flame}
            gradient="from-orange-400 to-red-500"
            progress={85}
            trend="up"
          />
          <ProgressCard
            title="Nível"
            value={stats.level}
            subtitle={`${stats.xp}/${stats.nextLevelXp} XP`}
            icon={Star}
            gradient="from-purple-400 to-pink-500"
            progress={(stats.xp / stats.nextLevelXp) * 100}
            trend="neutral"
          />
          <ProgressCard
            title="Progresso Semanal"
            value={`${stats.weeklyProgress}%`}
            subtitle="Acima da média"
            icon={TrendingUp}
            gradient="from-green-400 to-emerald-500"
            progress={stats.weeklyProgress}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Tracker */}
          <div className="lg:col-span-1">
            <MoodTracker
              currentMood={currentMood}
              energyLevel={stats.energyLevel}
              onMoodSelect={setCurrentMood}
            />

            {/* Quick Stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Conquistas Recentes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Primeira Semana
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      7 dias consecutivos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Energia Máxima
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      3 dias com energia 9+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recomendações Personalizadas
                </h3>
                <Sparkles className="w-5 h-5 text-teal-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map((rec, index) => (
                  <Link
                    key={index}
                    href={rec.action}
                    className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="text-3xl mb-2">{rec.icon}</div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center text-teal-600 dark:text-teal-400 text-xs font-medium">
                      Começar <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tarefas de Hoje
              </h3>
              {tasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhuma tarefa para hoje. Que tal criar algumas?
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700'
                      }`}
                      onClick={() => handleTaskToggle(task.id, task.completed)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          readOnly
                        />
                        <span
                          className={`font-medium ${
                            task.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        +{task.xp_reward} XP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Progresso da Semana
              </h3>
              <div className="flex items-end justify-between h-32 space-x-2">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
                  const heights = [60, 80, 75, 90, 85, 70, 95];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-teal-400 to-cyan-500 rounded-t-lg transition-all duration-500 hover:from-teal-500 hover:to-cyan-600"
                        style={{ height: `${heights[index]}%` }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
