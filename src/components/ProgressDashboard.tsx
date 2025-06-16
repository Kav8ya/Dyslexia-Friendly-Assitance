import React from 'react';
import { ProgressStats } from '../types';

interface ProgressDashboardProps {
  stats: ProgressStats;
  onClose: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <p><strong>Current Batch:</strong> {stats.currentBatch}</p>
        <p><strong>Exercises Completed:</strong> {stats.completed}</p>
        <p><strong>Correct Answers:</strong> {stats.correct}</p>
        <p><strong>Accuracy:</strong> {stats.accuracy.toFixed(1)}%</p>
        <div className="mt-4">
          <h3 className="text-lg">Recent History</h3>
          <ul className="max-h-40 overflow-y-auto">
            {stats.history.slice(-5).map((entry, index) => (
              <li key={index} className={entry.isCorrect ? 'text-green-600' : 'text-red-600'}>
                Exercise {entry.exerciseId}: {entry.isCorrect ? 'Correct' : 'Incorrect'} 
                ({new Date(entry.timestamp).toLocaleTimeString()})
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};