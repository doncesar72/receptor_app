import OpenAI from 'openai';
import { AI_CONFIG } from '@/config/ai-config';

const openai = new OpenAI({
  apiKey: "sk-Zy4IEUYaG3vLy2yJAqLqLZK2IMeTpkGJ",
  baseURL: "https://routerai.ru/api/v1",
});

export async function POST(req: Request) {
  console.log('API CALLED', new Date())
  // Отключаем кэширование
  const headers = new Headers({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  })

  try {
    const { image, profile } = await req.json();

    if (!image) {
      return Response.json(
        { error: 'No image provided' },
        { status: 400 },
      );
    }

    const profilePrompt = profile ? `
Персональные настройки пользователя (ОБЯЗАТЕЛЬНО учитывай):
- Цель питания: ${profile.goal === 'loss' ? 'похудение' : profile.goal === 'gain' ? 'набор массы' : 'поддержание веса'}
- Тип питания: ${profile.diet === 'halal' ? 'халяль (без свинины и алкоголя)' : profile.diet === 'vegetarian' ? 'вегетарианство (без мяса)' : profile.diet === 'vegan' ? 'веганство (без животных продуктов)' : profile.diet === 'glutenfree' ? 'без глютена' : 'обычное'}
- Аллергии: ${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'нет'}
- Дневная норма калорий: ${profile.calories} ккал
- Количество порций: ${profile.portions}
Подбирай рецепты строго под эти параметры.
Для каждого рецепта указывай примерные калории на порцию и БЖУ (белки/жиры/углеводы в граммах).
` : ''

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        { 
          role: "system", 
          content: AI_CONFIG.prompts.analyzePhoto + profilePrompt
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text", 
              text: "Проанализируй содержимое этого холодильника и предложи рецепты"
            }
          ]
        }
      ]
    });

    const content = response.choices[0].message.content || '';
    console.log('API response FULL:', JSON.stringify(content));

    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return Response.json(parsed);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', cleaned);
      return Response.json({ 
        error: 'Failed to parse AI response',
        rawContent: cleaned,
        recipes: [],
        products: []
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
