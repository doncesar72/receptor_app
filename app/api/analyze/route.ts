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
    const { image } = await req.json();

    if (!image) {
      return Response.json(
        { error: 'No image provided' },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        { 
          role: "system", 
          content: AI_CONFIG.prompts.analyzePhoto 
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
    console.log('API response:', content);

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
        rawContent: cleaned 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 },
    );
  }
}
