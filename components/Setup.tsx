'use client';

import React from "react"

import { useState } from 'react';
import { UserProfile } from '@/types';
import { BookOpen, MessageCircle, Briefcase, Plane, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface SetupProps {
  onComplete: (profile: UserProfile, apiKey: string) => void;
}

export default function Setup({ onComplete }: SetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [goal, setGoal] = useState<'conversation' | 'business' | 'travel' | 'academic'>('conversation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const profile: UserProfile = { name, level, goal };
    onComplete(profile, apiKey);
  };

  const levels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', description: 'Know the basics' },
    { value: 'advanced', label: 'Advanced', description: 'Near fluent' },
  ];

  const goals = [
    { value: 'conversation', label: 'Conversation', icon: MessageCircle },
    { value: 'business', label: 'Business', icon: Briefcase },
    { value: 'travel', label: 'Travel', icon: Plane },
    { value: 'academic', label: 'Academic', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-amber-100 rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
        <span className="text-2xl">📚</span>
      </div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-emerald-500 rounded-xl shadow-lg flex items-center justify-center text-white">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="absolute bottom-20 left-20 w-14 h-14 bg-sky-500 rounded-xl shadow-lg flex items-center justify-center text-white">
        <Sparkles className="w-7 h-7" />
      </div>
      <div className="absolute bottom-32 right-10 w-24 h-24 bg-amber-200 rounded-2xl -rotate-6 shadow-lg p-3">
        <p className="text-xs text-amber-900 font-handwriting">Learn English the smart way!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">FluentAI</h1>
          </div>
          <p className="text-gray-500">Master English with AI-powered learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Groq API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Get it free at{' '}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
              >
                console.groq.com
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              English Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value as any)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    level === l.value
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="font-medium text-sm">{l.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{l.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Learning Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    goal === g.value
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <g.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-sky-500/25"
          >
            Start Learning
          </button>
        </form>
      </div>
    </div>
  );
}
