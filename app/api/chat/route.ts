import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, userProfile, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const systemPrompt = {
      role: 'system',
      content: `You are FluentAI, an encouraging and patient English teacher. 
      The student's name is ${userProfile.name}, their level is ${userProfile.level}, 
      and they want to focus on ${userProfile.goal}.
      
      Guidelines:
      - Always respond in English
      - Keep responses conversational and natural (2-4 sentences)
      - Provide gentle corrections when needed
      - Encourage practice and progress
      - Ask follow-up questions to keep conversation flowing
      - If you notice grammar/vocabulary mistakes, correct them kindly
      - Adapt complexity to the student's level`
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
        max_tokens: 500,
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
      message: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
