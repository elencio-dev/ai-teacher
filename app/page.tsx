'use client';

import { useState } from 'react';
import Setup from '@/components/Setup';
import Chat from '@/components/Chat';
import Exercises from '@/components/Exercises';
import Vocabulary from '@/components/Vocabulary';
import { UserProfile, Stats } from '@/types';
import { MessageCircle, PenLine, BookOpen, Settings, BarChart3, Target, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'exercises' | 'vocabulary'>('chat');
  const [stats, setStats] = useState<Stats>({
    conversations: 0,
    exercises: 0,
    correctAnswers: 0,
    totalAnswers: 0,
  });

  const handleSetupComplete = (profile: UserProfile, key: string) => {
    setUserProfile(profile);
    setApiKey(key);
    setIsSetupComplete(true);
  };

  const updateConversationStats = () => {
    setStats(prev => ({ ...prev, conversations: prev.conversations + 1 }));
  };

  const updateExerciseStats = (correct: boolean) => {
    setStats(prev => ({
      ...prev,
      exercises: prev.exercises + 1,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));
  };

  if (!isSetupComplete || !userProfile) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  const accuracy = stats.totalAnswers > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
    : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const tabs = [
    { id: 'chat', label: 'Conversation', icon: MessageCircle },
    { id: 'exercises', label: 'Exercises', icon: PenLine },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="fixed font-handwriting left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="font-bold text-xl text-gray-900 font-sans">FluentAI</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex font-handwriting items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Stats Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Your Progress</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Conversations</span>
              <span className="font-semibold text-gray-900">{stats.conversations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Exercises</span>
              <span className="font-semibold text-gray-900">{stats.exercises}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Accuracy</span>
              <span className="font-semibold text-gray-900">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sky-600">
                {userProfile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{userProfile.name}</p>
              <p className="text-xs text-gray-500 capitalize">{userProfile.level} Level</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting()}, <span className="text-gray-400">{userProfile.name}</span>
              </h1>
              <p className="text-gray-500 mt-1">Ready to practice your English today?</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Daily Goal</p>
                  <p className="font-semibold text-gray-900">{stats.exercises}/5 exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Correct Answers</p>
                  <p className="font-semibold text-gray-900">{stats.correctAnswers}/{stats.totalAnswers}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ height: 'calc(100vh - 200px)' }}>
            {activeTab === 'chat' && (
              <Chat
                userProfile={userProfile}
                apiKey={apiKey}
                onStatsUpdate={updateConversationStats}
              />
            )}
            {activeTab === 'exercises' && (
              <Exercises
                userProfile={userProfile}
                apiKey={apiKey}
                onStatsUpdate={updateExerciseStats}
              />
            )}
            {activeTab === 'vocabulary' && (
              <Vocabulary
                userProfile={userProfile}
                apiKey={apiKey}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
