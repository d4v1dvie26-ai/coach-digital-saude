// Integração com IA para análise e recomendações

import { MoodEntry, OnboardingData, WellnessPlan, ChatMessage } from './types';

// Configuração da API de IA (OpenAI)
const AI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
const AI_MODEL = 'gpt-4o';

export async function analyzeEmotionalDiary(entry: Partial<MoodEntry>): Promise<{
  analysis: string;
  recommendations: string[];
}> {
  try {
    const prompt = `
Você é um coach de bem-estar empático e acolhedor. Analise este registro emocional:

Humor: ${entry.mood}
Energia: ${entry.energy}/10
Estresse: ${entry.stress}/10
Notas: ${entry.notes || 'Nenhuma nota adicional'}
Emoções: ${entry.emotions?.join(', ') || 'Não especificadas'}

Forneça:
1. Uma análise breve e acolhedora (2-3 frases)
2. 3 recomendações práticas e personalizadas

Seja empático, positivo e motivacional.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um coach de bem-estar empático, acolhedor e motivacional.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse da resposta
    const lines = content.split('\n').filter((line: string) => line.trim());
    const analysis = lines.slice(0, 3).join(' ');
    const recommendations = lines.slice(3).filter((line: string) => line.includes('-') || line.match(/^\d\./));

    return {
      analysis,
      recommendations: recommendations.slice(0, 3),
    };
  } catch (error) {
    console.error('Erro ao analisar diário emocional:', error);
    return {
      analysis: 'Obrigado por compartilhar seus sentimentos. Continue registrando para acompanharmos sua jornada.',
      recommendations: [
        'Pratique 5 minutos de respiração profunda',
        'Faça uma caminhada ao ar livre',
        'Conecte-se com alguém que você gosta',
      ],
    };
  }
}

export async function generateWellnessPlan(data: OnboardingData): Promise<WellnessPlan> {
  try {
    const prompt = `
Crie um plano de bem-estar personalizado baseado nestes dados:

Objetivos: ${data.goals.join(', ')}
Desafios: ${data.challenges.join(', ')}
Horas de sono: ${data.sleepHours}
Frequência de exercício: ${data.exerciseFrequency}
Nível de estresse: ${data.stressLevel}/10
Áreas de foco: ${data.focusAreas.join(', ')}
Horário preferido: ${data.preferredTime}

Forneça em formato JSON:
{
  "goals": ["objetivo 1", "objetivo 2", "objetivo 3"],
  "dailyRoutine": {
    "morning": ["atividade 1", "atividade 2"],
    "afternoon": ["atividade 1", "atividade 2"],
    "evening": ["atividade 1", "atividade 2"]
  },
  "habits": ["hábito 1", "hábito 2", "hábito 3"],
  "trails": ["trilha recomendada 1", "trilha recomendada 2"],
  "aiInsights": "insights personalizados sobre o usuário"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em bem-estar e alta performance. Crie planos personalizados em JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    const aiData = await response.json();
    const plan = JSON.parse(aiData.choices[0].message.content);

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'temp',
      generatedAt: new Date(),
      ...plan,
    };
  } catch (error) {
    console.error('Erro ao gerar plano de bem-estar:', error);
    // Plano padrão em caso de erro
    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'temp',
      generatedAt: new Date(),
      goals: ['Melhorar qualidade do sono', 'Reduzir estresse', 'Aumentar energia'],
      dailyRoutine: {
        morning: ['Meditação 10min', 'Exercício leve 20min', 'Café da manhã saudável'],
        afternoon: ['Pausa ativa 15min', 'Hidratação', 'Alongamento'],
        evening: ['Reflexão do dia', 'Leitura 20min', 'Rotina de sono'],
      },
      habits: ['Meditar diariamente', 'Exercitar 3x/semana', 'Dormir 8h'],
      trails: ['Ansiedade', 'Foco', 'Sono'],
      aiInsights: 'Seu perfil indica necessidade de equilíbrio entre produtividade e descanso.',
    };
  }
}

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: `Você é um coach de bem-estar empático, acolhedor e motivacional. 
Seu tom é calmo, positivo e encorajador. 
Você ajuda com: ansiedade, foco, sono, autoestima, autocuidado, disciplina.
Seja breve (2-4 frases), prático e sempre termine com uma pergunta ou ação.`,
          },
          ...formattedMessages,
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro no chat com IA:', error);
    return 'Estou aqui para te apoiar. Como posso te ajudar hoje?';
  }
}

export async function generateDailyTasks(
  userGoals: string[],
  recentMood: string,
  habits: string[]
): Promise<string[]> {
  try {
    const prompt = `
Gere 3 tarefas diárias personalizadas para um usuário com:
Objetivos: ${userGoals.join(', ')}
Humor recente: ${recentMood}
Hábitos atuais: ${habits.join(', ')}

Tarefas devem ser:
- Específicas e acionáveis
- Alinhadas aos objetivos
- Adaptadas ao humor
- Variadas (física, mental, emocional)

Retorne apenas as 3 tarefas, uma por linha.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em produtividade e bem-estar.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const tasks = data.choices[0].message.content
      .split('\n')
      .filter((line: string) => line.trim())
      .slice(0, 3);

    return tasks;
  } catch (error) {
    console.error('Erro ao gerar tarefas:', error);
    return [
      'Pratique 10 minutos de meditação',
      'Faça uma caminhada de 20 minutos',
      'Escreva 3 coisas pelas quais é grato',
    ];
  }
}
