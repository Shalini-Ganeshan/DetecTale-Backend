import { GoogleGenerativeAI } from '@google/generative-ai';  

export async function handler(event) {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
     return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ story: text }),
  };
}
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const { objects, language } = JSON.parse(event.body);

    if (!Array.isArray(objects) || objects.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://detectale-by-shalini.netlify.app',
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'An array of objects is required' }),
      };
    }

    if (!language) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'https://detectale-by-shalini.netlify.app',
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Language parameter is required' }),
      };
    }

    const prompt = `Write a complete story in ${language} including the objects ${objects.join(', ')}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://detectale-by-shalini.netlify.app',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ story: text }),
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://detectale-by-shalini.netlify.app',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Error generating content' }),
    };
  }
}
