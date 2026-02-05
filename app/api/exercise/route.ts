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

    const prompt = `Create a ${userProfile.level} level English exercise for someone learning ${userProfile.goal}.

Format your response EXACTLY like this (no additional text):
QUESTION: [write a clear question here]
A) [option A]
B) [option B]
C) [option C]
D) [option D]
CORRECT: [A, B, C, or D - just the letter]
EXPLANATION: [brief explanation in Portuguese explaining why this is correct]

Make the question relevant to ${userProfile.goal} context.`;

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
            content: 'You are an English teacher creating exercises. Follow the format exactly as specified.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 600,
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
    const content = data.choices[0].message.content;

    // Parse the response
    const questionMatch = content.match(/QUESTION:\s*(.+?)(?=\n[A-D]\))/s);
    const optionsMatch = content.match(/([A-D]\))\s*(.+?)(?=\n[A-D]\)|CORRECT:|$)/gs);
    const correctMatch = content.match(/CORRECT:\s*([A-D])/);
    const explanationMatch = content.match(/EXPLANATION:\s*(.+?)$/s);

    if (!questionMatch || !optionsMatch || !correctMatch) {
      return NextResponse.json(
        { error: 'Failed to parse exercise format' },
        { status: 500 }
      );
    }

    const exercise = {
      question: questionMatch[1].trim(),
      options: optionsMatch.map(opt => opt.trim().replace(/^[A-D]\)\s*/, '')),
      correctAnswer: correctMatch[1].charCodeAt(0) - 65, // Convert A-D to 0-3
      explanation: explanationMatch ? explanationMatch[1].trim() : ''
    };

    return NextResponse.json({ exercise });

  } catch (error) {
    console.error('Exercise API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
