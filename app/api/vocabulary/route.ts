import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userProfile, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const prompt = `Create a list of 10 useful ${userProfile.level} level English words for ${userProfile.goal}.

For each word provide:
1. The word in English
2. Phonetic pronunciation (IPA or simple)
3. Portuguese translation
4. Example sentence in English

Format each word like this:
[NUMBER]. [WORD] - [pronunciation]
Translation: [Portuguese]
Example: [English sentence]

Make it relevant to ${userProfile.goal} context.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an English teacher creating vocabulary lists. Be clear and educational.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Groq API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      vocabulary: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Vocabulary API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
