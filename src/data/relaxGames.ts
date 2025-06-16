import { RelaxGame } from '../types';

const words = [
  { word: 'happy', hint: 'Feeling of joy' },
  { word: 'smile', hint: 'Expression of happiness' },
  { word: 'peace', hint: 'State of tranquility' },
  { word: 'calm', hint: 'Free from agitation' },
  { word: 'relax', hint: 'To become less tense' },
  { word: 'dream', hint: 'Images in sleep' },
  { word: 'quiet', hint: 'Free from noise' },
  { word: 'gentle', hint: 'Mild and kind' },
  { word: 'serene', hint: 'Peaceful and untroubled' },
  { word: 'breath', hint: 'Take in air' }
];

function shuffleWord(word: string): string {
  const array = word.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

export function getRandomGame(): RelaxGame {
  const randomIndex = Math.floor(Math.random() * words.length);
  const { word, hint } = words[randomIndex];
  const scrambled = shuffleWord(word);
  return { word, scrambled, hint };
}