import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "sk-Zy4IEUYaG3vLy2yJAqLqLZK2IMeTpkGJ",
  baseURL: "https://routerai.ru/api/v1",
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Ты шеф-повар с 30-летним опытом. Придумай 3 варианта блюда "${query}" с разными вариациями.
Для каждого рецепта верни все поля в JSON формате.
Верни ТОЛЬКО валидный JSON без markdown в следующем формате:
{
  "recipes": [
    {
      "id": "1",
      "name": "Название блюда",
      "description": "Описание блюда с кулинарными советами",
      "time": "30",
      "calories": "350",
      "servings": "2",
      "difficulty": "Легко",
      "match": 85,
      "ingredients": ["100г продукт1", "2 шт продукт2"],
      "steps": [
        "Подробный шаг 1",
        "Подробный шаг 2"
      ]
    }
  ]
}
Сложность ОБЯЗАТЕЛЬНО должна быть одним из значений: "Легко", "Средне", "Сложно".`,
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content || '';
    console.log('Search API response:', content);

    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return Response.json({ result: cleaned });
  } catch (error: any) {
    console.error('Search API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

