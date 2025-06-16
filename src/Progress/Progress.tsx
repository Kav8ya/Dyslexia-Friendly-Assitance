// src/Progress/Progress.tsx
import React, { useState, useEffect } from 'react';
import { exerciseLevels } from '../data/exercises';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Progress.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Session {
  level: string;
  date: string;
  completedExercises: number;
  timestamp: number;
}

interface Attempt {
  level: string;
  exerciseId: number;
  isCorrect: boolean;
  attemptNumber: number;
  timestamp: number;
}

interface ProgressProps {
  userId: string;
}

const Progress: React.FC<ProgressProps> = ({ userId }) => {
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attemptsHistory, setAttemptsHistory] = useState<Attempt[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastCompletedLevel, setLastCompletedLevel] = useState<string | null>(null);

  useEffect(() => {
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || 'User');
        setCurrentLevel(data.currentLevel || null);
        setCompletedExercises(data.completedExercises || 0);
        setSessions(data.sessions || []);
        setLastCompletedLevel(
          data.currentLevel ||
          (data.sessions?.length > 0 ? data.sessions[data.sessions.length - 1]?.level : null)
        );
        setAttemptsHistory(data.attempts || []);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const getLevelIndex = (level: string) => {
    return exerciseLevels.findIndex((l) => l.range === level);
  };

  const getChartData = () => {
    const sortedSessions = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
    const validSessions = sortedSessions.filter((s) => s.completedExercises > 0);
    if (currentLevel && completedExercises === 3) {
      validSessions.push({
        level: currentLevel,
        date: new Date().toISOString().split('T')[0],
        completedExercises,
        timestamp: Date.now(),
      });
    }
    const labels = validSessions.map((s) => s.date);
    const data = validSessions.map((s) => {
      const index = getLevelIndex(s.level);
      return (exerciseLevels.length - 1 - index) * 20 + 20;
    });
    return {
      labels,
      datasets: [
        {
          label: 'Level Progress',
          data,
          borderColor: '#4682b4',
          backgroundColor: 'rgba(70, 130, 180, 0.2)',
          pointRadius: 5,
          pointBackgroundColor: '#4682b4',
          fill: false,
        },
      ],
    };
  };

  const getAvgAttempts = () => {
    const correctAttempts = attemptsHistory.filter((a) => a.isCorrect);
    if (!correctAttempts.length) return 0;
    const totalAttempts = correctAttempts.reduce((sum, a) => sum + a.attemptNumber, 0);
    return (totalAttempts / correctAttempts.length).toFixed(1);
  };

  const trend =
  sessions.length >= 2
    ? getLevelIndex(currentLevel || lastCompletedLevel || '') >
      getLevelIndex(sessions[sessions.length - 2].level)
      ? 'Deterioration 😟'
      : getLevelIndex(currentLevel || lastCompletedLevel || '') <
        getLevelIndex(sessions[sessions.length - 2].level)
      ? 'Improvement 🎉'
      : 'Stable 🙂'
    : 'First Session 🚀';

  const progressPercentage = currentLevel ? (completedExercises / 3) * 100 : 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, font: { family: 'Comic Sans MS', size: 18 } },
      },
      x: { ticks: { font: { family: 'Comic Sans MS', size: 18 } } },
    },
    height: 100,
  };

  return (
    <div className="progress-container relative min-h-screen bg-underwater flex items-center justify-center p-6 overflow-hidden">
      {/* Bubbles */}
      <div className="bubble bubble1" />
      <div className="bubble bubble2" />
      <div className="bubble bubble3" />
      <div className="bubble bubble4" />
      <div className="bubble bubble5" />

      {/* Sea Plants */}
      <div className="seaweed seaweed1" />
      <div className="seaweed seaweed2" />

      <div className="bg-white rounded-2xl border-2 border-gray-300 max-w-2xl w-full p-8 shadow-xl transform transition-all duration-300 hover:shadow-2xl z-10">
        {/* Header */}
        <div className="bg-[#fbcb1d] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h1 className="text-3xl font-comic-sans font-bold text-white-300 drop-shadow-md">
            {userName ? `${userName}'s Progress` : 'Progress'}
          </h1>
          <Link
            to="/"
            className="text-xl font-comic-sans text-white underline hover:text-yellow-200 transition-colors"
          >
            Back to Chat
          </Link>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Current Level Section */}
          <div className="border-b-2 border-gray-200 pb-6">
            {currentLevel && completedExercises < 3 ? (
              <>
                <p className="text-2xl font-comic-sans text-gray-900">
                <strong style={{ color: '#0c69cd' }}>Level:</strong> {currentLevel}                (
                  {exerciseLevels.find((l) => l.range === currentLevel)?.description || 'Unknown'})
                </p>
                <p className="text-2xl font-comic-sans text-gray-900">
                  <strong className="text-blue-600" style={{ color: '#0c69cd' }}>Exercises Done:</strong> {completedExercises}/3
                </p>
                <div className="w-full bg-gray-300 rounded-full h-8 mt-4">
                  <div
                    className="bg-green-500 h-8 rounded-full transition-all duration-1000 ease-in-out flex items-center"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <span className="text-white font-comic-sans text-lg pl-4">
                      {completedExercises === 3 ? 'Great Job! 🎉' : 'Keep Going! 🚀'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-2xl font-comic-sans text-gray-900" style={{ color: '#0c69cd' }}>All exercises completed 🎯</p>
            )}
          </div>

          {/* Chart Section */}
          <div className="h-64">
            <Line data={getChartData()} options={chartOptions} />
          </div>

          {/* Trend Info */}
          <div className="text-xl font-comic-sans text-gray-700">
          <p className="text-xl font-comic-sans">
  <strong style={{ color: '#0c69cd' }}>Progress Trend:</strong>{' '}
  <span className="font- trend-text"style={{ color: '#0d416b' }}>{trend}</span>
</p>
          </div>

          {/* Average Attempts */}
          <div className="text-xl font-comic-sans text-gray-700">
            <strong className="text-purple-600" style={{ color: '#0c69cd' }}>Average Attempts per Correct Answer:</strong> 
            <span className="font- trend-text"style={{ color: '#0d416b' }}> {getAvgAttempts()}</span>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
