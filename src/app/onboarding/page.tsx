'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Target, Heart, Brain, Zap, Moon, ArrowRight, ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    goals: [] as string[],
    challenges: [] as string[],
    sleepHours: 7,
    exerciseFrequency: 'sometimes',
    stressLevel: 5,
    focusAreas: [] as string[],
    preferredTime: 'morning',
  });

  const totalSteps = 5;

  const goalOptions = [
    { value: 'reduce-stress', label: 'Reduzir Estresse', icon: '🧘' },
    { value: 'improve-sleep', label: 'Melhorar Sono', icon: '😴' },
    { value: 'increase-energy', label: 'Aumentar Energia', icon: '⚡' },
    { value: 'build-habits', label: 'Criar Hábitos', icon: '🎯' },
    { value: 'self-esteem', label: 'Autoestima', icon: '💪' },
    { value: 'focus', label: 'Foco e Produtividade', icon: '🎯' },
  ];

  const challengeOptions = [
    { value: 'anxiety', label: 'Ansiedade', icon: '😰' },
    { value: 'procrastination', label: 'Procrastinação', icon: '⏰' },
    { value: 'low-energy', label: 'Baixa Energia', icon: '🔋' },
    { value: 'insomnia', label: 'Insônia', icon: '🌙' },
    { value: 'stress', label: 'Estresse', icon: '😓' },
    { value: 'lack-focus', label: 'Falta de Foco', icon: '🎯' },
  ];

  const focusAreaOptions = [
    { value: 'physical', label: 'Saúde Física', icon: '💪' },
    { value: 'mental', label: 'Saúde Mental', icon: '🧠' },
    { value: 'emotional', label: 'Bem-estar Emocional', icon: '❤️' },
    { value: 'productivity', label: 'Produtividade', icon: '📈' },
    { value: 'relationships', label: 'Relacionamentos', icon: '👥' },
    { value: 'spirituality', label: 'Espiritualidade', icon: '🙏' },
  ];

  const toggleSelection = (field: 'goals' | 'challenges' | 'focusAreas', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleComplete = async () => {
    // Salvar dados do onboarding
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(formData));
    
    // Aqui você pode chamar a API de IA para gerar o plano personalizado
    // const plan = await generateWellnessPlan(formData);
    
    router.push('/');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Bem-vindo ao WellnessAI! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vamos criar seu plano personalizado de bem-estar e alta performance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quais são seus principais objetivos?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleSelection('goals', goal.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.goals.includes(goal.value)
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{goal.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Seus Desafios
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Identificar desafios nos ajuda a criar soluções personalizadas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quais desafios você enfrenta?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {challengeOptions.map((challenge) => (
                  <button
                    key={challenge.value}
                    onClick={() => toggleSelection('challenges', challenge.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.challenges.includes(challenge.value)
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{challenge.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {challenge.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Nível de estresse atual (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>Baixo</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{formData.stressLevel}</span>
                <span>Alto</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Áreas de Foco
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Onde você quer concentrar sua energia?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Selecione suas prioridades
              </label>
              <div className="grid grid-cols-2 gap-3">
                {focusAreaOptions.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => toggleSelection('focusAreas', area.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.focusAreas.includes(area.value)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{area.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {area.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Seus Hábitos Atuais
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Entender sua rotina nos ajuda a criar recomendações realistas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quantas horas você dorme por noite?
              </label>
              <input
                type="range"
                min="4"
                max="12"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>4h</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{formData.sleepHours}h</span>
                <span>12h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Com que frequência você se exercita?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'never', label: 'Nunca' },
                  { value: 'rarely', label: 'Raramente (1x/semana)' },
                  { value: 'sometimes', label: 'Às vezes (2-3x/semana)' },
                  { value: 'often', label: 'Frequentemente (4-5x/semana)' },
                  { value: 'daily', label: 'Diariamente' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, exerciseFrequency: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      formData.exerciseFrequency === option.value
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Preferências Pessoais
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Quando você prefere realizar suas atividades?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Melhor período do dia para você
              </label>
              <div className="space-y-2">
                {[
                  { value: 'morning', label: 'Manhã (6h - 12h)', icon: '🌅' },
                  { value: 'afternoon', label: 'Tarde (12h - 18h)', icon: '☀️' },
                  { value: 'evening', label: 'Noite (18h - 22h)', icon: '🌙' },
                  { value: 'flexible', label: 'Flexível', icon: '🔄' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, preferredTime: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center space-x-3 ${
                      formData.preferredTime === option.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                🎉 Tudo pronto!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vamos criar seu plano personalizado de bem-estar com base nas suas respostas.
                Nossa IA vai gerar recomendações específicas para você!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Passo {step} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <span>Finalizar</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
