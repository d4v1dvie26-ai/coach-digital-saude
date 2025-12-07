'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    challenges: '',
    currentHabits: '',
    sleepHours: '',
    stressLevel: 5,
    energyLevel: 5,
  });

  const goalOptions = [
    { id: 'ansiedade', label: 'Reduzir Ansiedade', icon: '🧘' },
    { id: 'foco', label: 'Melhorar Foco', icon: '🎯' },
    { id: 'sono', label: 'Dormir Melhor', icon: '😴' },
    { id: 'autoestima', label: 'Aumentar Autoestima', icon: '💪' },
    { id: 'energia', label: 'Mais Energia', icon: '⚡' },
    { id: 'disciplina', label: 'Desenvolver Disciplina', icon: '🔥' },
  ];

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const generatePersonalizedPlan = async () => {
    try {
      const prompt = `
Você é um coach de bem-estar especializado. Com base nas informações do usuário, crie um plano personalizado:

Objetivos: ${formData.goals.join(', ')}
Desafios: ${formData.challenges}
Hábitos atuais: ${formData.currentHabits}
Horas de sono: ${formData.sleepHours}
Nível de estresse: ${formData.stressLevel}/10
Nível de energia: ${formData.energyLevel}/10

Crie:
1. 3-5 hábitos diários personalizados (formato: título, descrição, categoria)
2. 3 tarefas iniciais para hoje
3. Recomendação de trilha de bem-estar

Responda em JSON:
{
  "habits": [{"title": "", "description": "", "category": "", "icon": ""}],
  "tasks": [{"title": "", "description": "", "xp_reward": 50}],
  "recommendedTrail": "categoria da trilha"
}
`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      const plan = JSON.parse(response.choices[0].message.content || '{}');
      return plan;
    } catch (error) {
      console.error('Erro ao gerar plano:', error);
      return null;
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Gerar plano personalizado com IA
      toast.info('Gerando seu plano personalizado com IA...');
      const plan = await generatePersonalizedPlan();

      if (plan) {
        // Criar hábitos
        const habitsToInsert = plan.habits.map((habit: any) => ({
          user_id: user.id,
          title: habit.title,
          description: habit.description,
          category: habit.category,
          icon: habit.icon || '✨',
          frequency: 'daily',
          is_active: true,
        }));

        await supabase.from('habits').insert(habitsToInsert);

        // Criar tarefas iniciais
        const today = new Date().toISOString().split('T')[0];
        const tasksToInsert = plan.tasks.map((task: any) => ({
          user_id: user.id,
          title: task.title,
          description: task.description,
          xp_reward: task.xp_reward || 50,
          due_date: today,
        }));

        await supabase.from('daily_tasks').insert(tasksToInsert);
      }

      // Atualizar perfil
      await updateUserProfile(user.id, {
        onboarding_completed: true,
        wellness_goals: formData.goals,
      });

      toast.success('Plano personalizado criado com sucesso!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao completar onboarding:', error);
      toast.error('Erro ao criar plano personalizado');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quais são seus objetivos?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Selecione um ou mais objetivos que deseja alcançar
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {goalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.goals.includes(goal.id)
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{goal.icon}</div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {goal.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Conte-nos mais sobre você
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Isso nos ajudará a personalizar sua experiência
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Quais são seus maiores desafios atualmente?</Label>
                <Textarea
                  value={formData.challenges}
                  onChange={(e) =>
                    setFormData({ ...formData, challenges: e.target.value })
                  }
                  placeholder="Ex: Tenho dificuldade para dormir, me sinto ansioso no trabalho..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Quais hábitos você já pratica?</Label>
                <Textarea
                  value={formData.currentHabits}
                  onChange={(e) =>
                    setFormData({ ...formData, currentHabits: e.target.value })
                  }
                  placeholder="Ex: Faço exercícios 3x por semana, medito pela manhã..."
                  className="h-24"
                />
              </div>

              <div>
                <Label>Quantas horas você dorme por noite?</Label>
                <Input
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    setFormData({ ...formData, sleepHours: e.target.value })
                  }
                  placeholder="Ex: 7"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Como você está se sentindo?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Avalie seu estado atual
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <Label className="mb-4 block">
                  Nível de Estresse: {formData.stressLevel}/10
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stressLevel: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Relaxado</span>
                  <span>Muito Estressado</span>
                </div>
              </div>

              <div>
                <Label className="mb-4 block">
                  Nível de Energia: {formData.energyLevel}/10
                </Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energyLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      energyLevel: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Exausto</span>
                  <span>Energizado</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Passo {step} de 3
            </span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 mb-6 mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && formData.goals.length === 0}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              >
                {loading ? (
                  'Criando plano...'
                ) : (
                  <>
                    Finalizar
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
