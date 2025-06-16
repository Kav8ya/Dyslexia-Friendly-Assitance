// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { compareTwoStrings } from 'string-similarity';
import Confetti from 'react-confetti';
import { Bot, Send, Mic, Volume2 } from 'lucide-react';
import { exerciseLevels } from './data/exercises';
import { getRandomGame } from './data/relaxGames';
import { ChatMessage } from './components/ChatMessage';
import { Message, Exercise, ExerciseLevel, RelaxGame, CheatDetection } from './types';
import { analyzeResponse } from './config/gemini';
import { CheatDetectionManager } from './utils/CheatDetectionManager';
import { db } from './config/firebase'; // Remove auth if not needed
import { doc, setDoc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { Link, Routes, Route } from 'react-router-dom';
import Progress from './Progress/Progress';

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    text: 'Hello! I\'m your Dyslexia Learning Assistant. What’s your name?'
  }]);
  const [input, setInput] = useState('');
  const [currentLevel, setCurrentLevel] = useState<ExerciseLevel | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentGame, setCurrentGame] = useState<RelaxGame | null>(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const cheatDetectionManager = useRef<CheatDetectionManager>(CheatDetectionManager.getInstance());

  // Fetch or initialize user data based on name
  useEffect(() => {
    if (!userName) return;
    const userDocRef = doc(db, 'users', userName.toLowerCase()); // Use name as doc ID
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompletedExercises(data.completedExercises || 0);
        setCurrentExerciseIndex(data.currentExerciseIndex || 0);
        if (data.currentLevel) {
          const level = exerciseLevels.find(l => l.range === data.currentLevel);
          if (level && !currentLevel) {
            setCurrentLevel(level);
            setCurrentExercise(level.exercises[data.currentExerciseIndex || 0]);
            if (messages.length === 1) { // Only on first load
              setMessages(prev => [...prev, {
                type: 'bot',
                text: `Welcome back, ${userName}! Let’s continue with your exercises. Here’s the next one:\n\n${level.exercises[data.currentExerciseIndex || 0].question}`
              }]);
            }
          }
        } else if (messages.length === 1) { // Only on first load
          setMessages(prev => [...prev, {
            type: 'bot',
            text: `Hi ${userName}! Please enter your severity level (1-100) to get started with exercises tailored for you.`
          }]);
        }
      } else {
        console.log('Initializing new user document for:', userName);
        setDoc(userDocRef, {
          name: userName,
          sessions: [],
          attempts: [],
          currentLevel: null,
          currentExerciseIndex: 0,
          completedExercises: 0
        }).catch((error) => {
          console.error('Firestore Init Error:', error);
          setMessages(prev => [...prev, { type: 'bot', text: 'Failed to initialize data. Please try again.' }]);
        });
      }
    });
    return () => unsubscribe();
  }, [userName]);

  useEffect(() => {
    cheatDetectionManager.current.setOnTabSwitchCallback(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Hey, I noticed you switched tabs! Please stay focused on the task.'
      }]);
    });
  }, []);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.current.onerror = () => setIsListening(false);
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (currentExercise) {
      cheatDetectionManager.current.startExercise();
    }
  }, [currentExercise]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognition.current) return;
    if (isListening) recognition.current.stop();
    else recognition.current.start();
    setIsListening(!isListening);
  };

  const startRelaxGame = () => {
    const game = getRandomGame();
    setCurrentGame(game);
    setIsPlayingGame(true);
    setGamesPlayed(0);
    setMessages(prev => [...prev, {
      type: 'bot',
      text: `Let's take a short break with a fun word game!\nUnscramble this word: ${game.scrambled}\nHint: ${game.hint}`
    }]);
  };

  const returnToExercise = () => {
    setIsPlayingGame(false);
    setCurrentGame(null);
    if (pendingExercise) {
      setTimeout(() => {
        setCurrentExercise(pendingExercise);
        setPendingExercise(null);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `Now, let's return to our exercise:\n\n${pendingExercise.question}`
        }]);
      }, 1500);
    }
  };

  const handleGameAnswer = (answer: string) => {
    if (!currentGame) return;
    let feedbackMessage = '';

    if (answer.toLowerCase() === currentGame.word.toLowerCase()) {
      feedbackMessage = 'Great job! You unscrambled the word correctly!';
      setMessages(prev => [...prev, { type: 'bot', text: feedbackMessage, isCorrect: true }]);
      const nextGamesPlayed = gamesPlayed + 1;
      setGamesPlayed(nextGamesPlayed);
      if (nextGamesPlayed < 2) {
        setTimeout(() => {
          const nextGame = getRandomGame();
          setCurrentGame(nextGame);
          setMessages(prev => [...prev, {
            type: 'bot',
            text: `Here's another word to unscramble: ${nextGame.scrambled}\nHint: ${nextGame.hint}`
          }]);
        }, 1500);
      } else {
        returnToExercise();
      }
    } else {
      if (!currentGame.hint2) {
        feedbackMessage = `Not quite right. Here's another hint: The word starts with "${currentGame.word[0]}"`;
        setMessages(prev => [...prev, { type: 'bot', text: feedbackMessage, isCorrect: false }]);
        setCurrentGame({ ...currentGame, hint2: true });
      } else {
        feedbackMessage = `The correct word was: ${currentGame.word}`;
        setMessages(prev => [...prev, { type: 'bot', text: feedbackMessage, isCorrect: false }]);
        const nextGamesPlayed = gamesPlayed + 1;
        setGamesPlayed(nextGamesPlayed);
        if (nextGamesPlayed < 2) {
          setTimeout(() => {
            const nextGame = getRandomGame();
            setCurrentGame(nextGame);
            setMessages(prev => [...prev, {
              type: 'bot',
              text: `Here's another word to unscramble: ${nextGame.scrambled}\nHint: ${nextGame.hint}`
            }]);
          }, 1500);
        } else {
          returnToExercise();
        }
      }
    }
  };

  const moveToNextExercise = async () => {
    if (!currentLevel || !userName) return;
    const nextIndex = currentExerciseIndex + 1;
    const newCompleted = completedExercises + 1;
    setCompletedExercises(newCompleted);

    const userDocRef = doc(db, 'users', userName.toLowerCase());
    const sessionDate = new Date().toISOString().split('T')[0];
    const session = { level: currentLevel.range, date: sessionDate, completedExercises: newCompleted, timestamp: Date.now() };

    if (nextIndex < 3) {
      setCurrentExerciseIndex(nextIndex);
      setCurrentExercise(currentLevel.exercises[nextIndex]);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `Let's try the next exercise:\n\n${currentLevel.exercises[nextIndex].question}`
      }]);
      await setDoc(userDocRef, {
        currentExerciseIndex: nextIndex,
        completedExercises: newCompleted,
        sessions: arrayUnion(session)
      }, { merge: true });
    } else {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Congratulations! You\'ve completed all 3 exercises for this level. Take a new assessment next time!'
      }]);
      setCurrentLevel(null);
      setCurrentExercise(null);
      setCurrentExerciseIndex(0);
      await setDoc(userDocRef, {
        currentLevel: null,
        currentExerciseIndex: 0,
        completedExercises: 0,
        sessions: arrayUnion(session)
      }, { merge: true });
    }
    setAttempts(0);
  };

  const handleSignIn = async (name: string) => {
    try {
      setUserName(name);
      const userDocRef = doc(db, 'users', name.toLowerCase());
      await setDoc(userDocRef, { name }, { merge: true }); // Ensure name is set
      console.log('Sign-in successful for:', name);
    } catch (error) {
      console.error('SignIn Error:', error);
      setMessages(prev => [...prev, { type: 'bot', text: 'Something went wrong. Please try again.' }]);
    }
  };

  const handleSeverityLevel = async (level: string) => {
    if (!userName) return;

    if (level.toLowerCase() === 'yes' && currentLevel) {
      setCurrentExercise(currentLevel.exercises[0]);
      setCurrentExerciseIndex(0);
      setCompletedExercises(0);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: `Great! Let's repeat the exercises for level ${currentLevel.range}:\n\n${currentLevel.exercises[0].question}`
      }]);
      const userDocRef = doc(db, 'users', userName.toLowerCase());
      await setDoc(userDocRef, { currentExerciseIndex: 0, completedExercises: 0 }, { merge: true });
      return;
    }

    const numLevel = parseInt(level);
    if (numLevel >= 1 && numLevel <= 100) {
      const matchingLevel = exerciseLevels.find(l => {
        const [min, max] = l.range.split('-').map(Number);
        return numLevel >= min && numLevel <= max;
      });

      if (matchingLevel) {
        setCurrentLevel(matchingLevel);
        setCurrentExercise(matchingLevel.exercises[0]);
        setCurrentExerciseIndex(0);
        setCompletedExercises(0);
        setMessages(prev => [...prev, {
          type: 'bot',
          text: `Great! Let's start with exercises for level ${matchingLevel.range}: ${matchingLevel.description}\n\n${matchingLevel.exercises[0].question}`
        }]);
        const userDocRef = doc(db, 'users', userName.toLowerCase());
        const sessionDate = new Date().toISOString().split('T')[0];
        const newSession = { level: matchingLevel.range, date: sessionDate, completedExercises: 0, timestamp: Date.now() };
        await setDoc(userDocRef, {
          currentLevel: matchingLevel.range,
          currentExerciseIndex: 0,
          completedExercises: 0,
          sessions: arrayUnion(newSession)
        }, { merge: true });
      }
    } else if (level.toLowerCase() !== 'yes') {
      setMessages(prev => [...prev, { type: 'bot', text: 'Thank you for practicing! Have a great day!' }]);
    }
  };

  const checkAnswer = (input: string, exercise: Exercise): boolean => {
    if (exercise.type === 'email' && exercise.question.toLowerCase().includes('reorder')) {
      return input.replace(/\s+/g, '') === exercise.expectedAnswer.replace(/\s+/g, '');
    }
    if (exercise.question.toLowerCase().includes('fill in the blank') ||
        exercise.type === 'matching' ||
        exercise.type === 'prioritization') {
      return input.toLowerCase().replace(/\s+/g, '') === exercise.expectedAnswer.toLowerCase().replace(/\s+/g, '');
    }
    return compareTwoStrings(input.toLowerCase(), exercise.expectedAnswer.toLowerCase()) >= 0.8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userInput }]);

    if (!userName) {
      await handleSignIn(userInput);
    } else if (isPlayingGame && currentGame) {
      handleGameAnswer(userInput);
    } else if (!currentLevel) {
      await handleSeverityLevel(userInput);
    } else if (currentExercise) {
      let isCorrect = false;
      let feedback = '';

      try {
        const analysis = await analyzeResponse(userInput, currentExercise.expectedAnswer, currentExercise.type);
        isCorrect = analysis.isCorrect;
        feedback = analysis.feedback;
      } catch (error) {
        console.warn('Falling back to string similarity:', error);
        isCorrect = checkAnswer(userInput, currentExercise);
        feedback = isCorrect ? 'Excellent work!' : 'Not quite right. Try again.';
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const attemptData = {
        level: currentLevel.range,
        exerciseId: currentExerciseIndex,
        isCorrect,
        attemptNumber: newAttempts,
        timestamp: Date.now()
      };
      const userDocRef = doc(db, 'users', userName.toLowerCase());
      await updateDoc(userDocRef, { attempts: arrayUnion(attemptData) });

      if (isCorrect) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setMessages(prev => [...prev, { type: 'bot', text: feedback, isCorrect: true }]);
        setTimeout(() => moveToNextExercise(), 2000);
      } else {
        if (newAttempts < 3) {
          const hint = currentExercise.hints[attempts];
          setMessages(prev => [...prev, { type: 'bot', text: `${feedback}\n\nHint: ${hint}`, isCorrect: false }]);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: `${feedback}\n\nCorrect answer: ${currentExercise.expectedAnswer}`,
            isCorrect: false
          }]);
          setPendingExercise(currentExercise);
          setTimeout(() => startRelaxGame(), 2000);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={
          <>
            {showConfetti && <Confetti />}
            <div className="max-w-3xl mx-auto p-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-4 flex items-center gap-3">
                  <Bot className="w-8 h-8 text-white" />
                  <h1 className="text-xl font-semibold text-white">Dyslexia Learning Assistant</h1>
                  {userName && <Link to="/progress" className="ml-auto text-white hover:underline">View Progress</Link>}
                </div>
                <div className="h-[600px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={index} 
                      message={message} 
                      onPlayAudio={() => message.type === 'bot' && speak(message.text)}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={userName ? "Type your response..." : "Enter your name..."}
                    />
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`px-4 py-2 ${isListening ? 'bg-red-600' : 'bg-gray-600'} text-white rounded-lg hover:opacity-90`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        } />
        <Route path="/progress" element={userName ? <Progress userId={userName.toLowerCase()} /> : null} />
      </Routes>
    </div>
  );
}

export default App;