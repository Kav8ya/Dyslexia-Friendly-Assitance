import React from 'react';
import { MessageCircle, Bot, Volume2 } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onPlayAudio: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPlayAudio }) => {
  const isBot = message.type === 'bot';
  
  return (
    <div className={`flex items-start gap-4 ${isBot ? 'bg-gray-50' : ''} p-4 rounded-lg`}>
      {isBot ? (
        <Bot className="w-8 h-8 text-blue-500" />
      ) : (
        <MessageCircle className="w-8 h-8 text-gray-500" />
      )}
      <div className="flex-1">
        <div className="flex items-start gap-2">
          <p className={`text-sm ${isBot ? 'text-gray-800' : 'text-gray-600'}`}>
            {message.text}
          </p>
          {isBot && (
            <button
              onClick={onPlayAudio}
              className="p-1 text-gray-500 hover:text-blue-500 focus:outline-none"
              title="Play audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {message.isCorrect !== undefined && (
          <div className={`mt-2 text-sm ${message.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {message.isCorrect ? '✓ Correct!' : '✗ Try again'}
          </div>
        )}
      </div>
    </div>
  );
};