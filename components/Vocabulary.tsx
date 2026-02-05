'use client';

import { useState } from 'react';
import { UserProfile } from '@/types';
import { BookOpen, RefreshCw, Sparkles } from 'lucide-react';

interface VocabularyProps {
  userProfile: UserProfile;
  apiKey: string;
}

export default function Vocabulary({ userProfile, apiKey }: VocabularyProps) {
  const [vocabulary, setVocabulary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateVocabulary = async () => {
    setIsLoading(true);
    setVocabulary('');

    try {
      const response = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, apiKey }),
      });

      const data = await response.json();
      
      if (data.vocabulary) {
        setVocabulary(data.vocabulary);
      }
    } catch (error) {
      console.error('Error generating vocabulary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex items-center justify-center">
      {!vocabulary && !isLoading && (
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
            <BookOpen className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Learn New Words</h3>
          <p className="text-gray-500 mb-6">Expand your vocabulary with personalized word lists</p>
          <button
            onClick={generateVocabulary}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate Vocabulary
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Generating vocabulary...</p>
        </div>
      )}

      {vocabulary && (
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">New Vocabulary</h3>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl text-sm">
                {vocabulary}
              </pre>
            </div>
          </div>

          <button
            onClick={generateVocabulary}
            className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Generate New Words
          </button>
        </div>
      )}
    </div>
  );
}
