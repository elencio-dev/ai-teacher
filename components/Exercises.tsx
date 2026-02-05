'use client';

import { useState } from 'react';
import { UserProfile, Exercise } from '@/types';
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface ExerciseProps {
  userProfile: UserProfile;
  apiKey: string;
  onStatsUpdate: (correct: boolean) => void;
}

export default function Exercises({ userProfile, apiKey, onStatsUpdate }: ExerciseProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateExercise = async () => {
    setIsLoading(true);
    setExercise(null);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const response = await fetch('/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, apiKey }),
      });

      const data = await response.json();
      
      if (data.exercise) {
        setExercise(data.exercise);
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === exercise?.correctAnswer;
    onStatsUpdate(isCorrect);
  };

  return (
    <div className="p-6 h-full flex items-center justify-center">
      {!exercise && !isLoading && (
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Practice Exercises</h3>
          <p className="text-gray-500 mb-6">Test your English skills with AI-generated exercises</p>
          <button
            onClick={generateExercise}
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate Exercise
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">Generating exercise...</p>
        </div>
      )}

      {exercise && (
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Exercise</h3>
            </div>
            
            <p className="text-lg text-gray-800 mb-6 leading-relaxed">{exercise.question}</p>

            <div className="space-y-3">
              {exercise.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === exercise.correctAnswer;
                
                let buttonClass = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium flex items-center gap-3 ';
                
                if (!showResult) {
                  buttonClass += 'border-gray-200 hover:border-sky-500 hover:bg-sky-50 text-gray-700';
                } else {
                  if (isCorrect) {
                    buttonClass += 'border-emerald-500 bg-emerald-50 text-emerald-900';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-500 bg-red-50 text-red-900';
                  } else {
                    buttonClass += 'border-gray-200 bg-gray-50 opacity-60 text-gray-500';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => checkAnswer(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className={`mt-6 p-4 rounded-xl ${
                selectedAnswer === exercise.correctAnswer
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === exercise.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-emerald-700">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-red-700">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{exercise.explanation}</p>
              </div>
            )}
          </div>

          {showResult && (
            <button
              onClick={generateExercise}
              className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
            >
              Next Exercise
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
