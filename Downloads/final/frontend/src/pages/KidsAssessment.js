"use client"

import { useState, useEffect } from "react"
import "./KidsAssessment.css"

// Sound imports
import correctSoundFile from "../assets/sounds/correct.mp3"
import wrongSoundFile from "../assets/sounds/wrong.mp3"
import celebrationSoundFile from "../assets/sounds/celebration.mp3"
import backgroundMusicFile from "../assets/sounds/background-music.mp3"

// Basic images
import catImg from "../assets/images/cat.png"
import numbersImg from "../assets/images/numbers.png"
import colorsImg from "../assets/images/colors.png"

// New images for dyslexia-specific questions
import lettersImg from "../assets/images/letters.png"
import mirroredLettersImg from "../assets/images/mirrored-letters.png"
import rhymingWordsImg from "../assets/images/rhyming-words.png"
import sequenceImg from "../assets/images/sequence.png"
import syllablesImg from "../assets/images/syllables.png"
import wordRecognitionImg from "../assets/images/word-recognition.png"
import memoryImg from "../assets/images/memory.png"
import directionImg from "../assets/images/direction.png"
import visualTrackingImg from "../assets/images/visual-tracking.png"
import phonemesImg from "../assets/images/phonemes.png"
import spellingImg from "../assets/images/spelling.png"
import rapidNamingImg from "../assets/images/rapid-naming.png"
import workingMemoryImg from "../assets/images/working-memory.png"
import visualDiscriminationImg from "../assets/images/visual-discrimination.png"

// Comprehensive question set targeting dyslexia indicators
const questions = [
  // Letter Recognition & Reversal
  {
    id: 1,
    text: "Which letter is 'b'?",
    img: lettersImg,
    options: ["d", "b", "p"],
    answer: "b",
    category: "letter-recognition",
  },
  {
    id: 2,
    text: "Which letter is NOT backwards?",
    img: mirroredLettersImg,
    options: ["ɘ", "b", "ꓒ"],
    answer: "b",
    category: "visual-processing",
  },

  // Phonological Awareness
  {
    id: 3,
    text: "Which word rhymes with 'cat'?",
    img: rhymingWordsImg,
    options: ["dog", "hat", "sun"],
    answer: "hat",
    category: "phonological-awareness",
  },
  {
    id: 4,
    text: "What sound does 'sh' make?",
    img: phonemesImg,
    options: ["sss", "hhh", "shh"],
    answer: "shh",
    category: "phonological-awareness",
  },

  // Sequencing
  {
    id: 5,
    text: "What comes next? A, B, C, _",
    img: sequenceImg,
    options: ["E", "D", "F"],
    answer: "D",
    category: "sequencing",
  },
  {
    id: 6,
    text: "What day comes after Monday?",
    img: sequenceImg,
    options: ["Sunday", "Tuesday", "Wednesday"],
    answer: "Tuesday",
    category: "sequencing",
  },

  // Syllable Awareness
  {
    id: 7,
    text: "How many syllables in 'elephant'?",
    img: syllablesImg,
    options: ["2", "3", "4"],
    answer: "3",
    category: "syllable-awareness",
  },

  // Word Recognition
  {
    id: 8,
    text: "Which is a real word?",
    img: wordRecognitionImg,
    options: ["tup", "cat", "fib"],
    answer: "cat",
    category: "word-recognition",
  },

  // Short-term Memory
  {
    id: 9,
    text: "Remember these numbers: 4, 7, 2. Which was the middle number?",
    img: memoryImg,
    options: ["4", "7", "2"],
    answer: "7",
    category: "memory",
  },

  // Directional Awareness
  {
    id: 10,
    text: "Which arrow points RIGHT?",
    img: directionImg,
    options: ["←", "→", "↑"],
    answer: "→",
    category: "directional-awareness",
  },

  // Visual Tracking
  {
    id: 11,
    text: "Follow the line. Where does it end?",
    img: visualTrackingImg,
    options: ["Star", "Circle", "Triangle"],
    answer: "Circle",
    category: "visual-tracking",
  },

  // Spelling
  {
    id: 12,
    text: "Which spelling is correct?",
    img: spellingImg,
    options: ["kat", "catt", "cat"],
    answer: "cat",
    category: "spelling",
  },

  // Rapid Naming
  {
    id: 13,
    text: "What color is this?",
    img: rapidNamingImg,
    options: ["Red", "Blue", "Green"],
    answer: "Red",
    category: "rapid-naming",
    timed: true,
  },

  // Working Memory
  {
    id: 14,
    text: "Remember these animals: Dog, Cat, Fish. Which was the last one?",
    img: workingMemoryImg,
    options: ["Dog", "Cat", "Fish"],
    answer: "Fish",
    category: "working-memory",
  },

  // Visual Discrimination
  {
    id: 15,
    text: "Which shape is different from the others?",
    img: visualDiscriminationImg,
    options: ["Circle", "Square", "Triangle"],
    answer: "Triangle",
    category: "visual-discrimination",
  },

  // Original questions
  {
    id: 16,
    text: "Which animal says 'Meow'?",
    img: catImg,
    options: ["Dog", "Cat", "Elephant"],
    answer: "Cat",
    category: "general-knowledge",
  },
  {
    id: 17,
    text: "Which number comes after 2?",
    img: numbersImg,
    options: ["1", "2", "3"],
    answer: "3",
    category: "sequencing",
  },
  {
    id: 18,
    text: "Find the color Red!",
    img: colorsImg,
    options: ["Blue", "Green", "Red"],
    answer: "Red",
    category: "visual-recognition",
  },
]

const KidsAssessment = () => {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [categoryScores, setCategoryScores] = useState({})
  const [finished, setFinished] = useState(false)
  const [message, setMessage] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5)
  const [backgroundMusic, setBackgroundMusic] = useState(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  // Preload audio
  const correctAudio = new Audio(correctSoundFile)
  const wrongAudio = new Audio(wrongSoundFile)
  const celebrationAudio = new Audio(celebrationSoundFile)

  // Initialize background music
  useEffect(() => {
    const bgMusic = new Audio(backgroundMusicFile)
    bgMusic.loop = true
    setBackgroundMusic(bgMusic)

    return () => {
      if (bgMusic) {
        bgMusic.pause()
        bgMusic.currentTime = 0
      }
    }
  }, [])

  // Toggle background music
  const toggleMusic = () => {
    if (backgroundMusic) {
      if (isMusicPlaying) {
        backgroundMusic.pause()
      } else {
        backgroundMusic.play()
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  // Timer for timed questions
  useEffect(() => {
    let timer
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timerActive && timeRemaining === 0) {
      handleAnswer("Time's up!")
    }

    return () => clearTimeout(timer)
  }, [timerActive, timeRemaining])

  // Set up timed question if needed
  useEffect(() => {
    if (!finished && questions[currentQ]?.timed) {
      setTimerActive(true)
      setTimeRemaining(5)
    } else {
      setTimerActive(false)
    }
  }, [currentQ, finished])

  const handleAnswer = (selected) => {
    setTimerActive(false)

    const currentQuestion = questions[currentQ]
    const isCorrect = selected === currentQuestion.answer

    // Update category scores
    const category = currentQuestion.category
    setCategoryScores((prev) => ({
      ...prev,
      [category]: (prev[category] || 0) + (isCorrect ? 1 : 0),
    }))

    if (isCorrect) {
      setScore(score + 1)
      setMessage("🎉 Correct! 🎉")
      correctAudio.play()
      setShowAnimation(true)
    } else {
      setMessage("❌ Try again! ❌")
      wrongAudio.play()
    }

    setTimeout(() => {
      setMessage("")
      setShowAnimation(false)
      if (currentQ === questions.length - 1) {
        setFinished(true)
        celebrationAudio.play()
      } else {
        setCurrentQ(currentQ + 1)
      }
    }, 1500)
  }

  const calculateSeverity = (score) => {
    const scorePercentage = (score / questions.length) * 100

    // Calculate category-specific scores
    const letterRecognitionScore = categoryScores["letter-recognition"] || 0
    const phonologicalScore = categoryScores["phonological-awareness"] || 0
    const sequencingScore = categoryScores["sequencing"] || 0
    const memoryScore = categoryScores["memory"] || 0 + (categoryScores["working-memory"] || 0)
    const visualProcessingScore =
      categoryScores["visual-processing"] ||
      0 + (categoryScores["visual-tracking"] || 0) + (categoryScores["visual-discrimination"] || 0)

    // Weighted analysis for dyslexia indicators
    let dyslexiaRisk = "Low"

    // Key dyslexia indicators have lower scores
    if (letterRecognitionScore === 0 || phonologicalScore === 0 || sequencingScore < 1) {
      dyslexiaRisk = "High"
    } else if (letterRecognitionScore < 2 && phonologicalScore < 2 && (memoryScore < 1 || visualProcessingScore < 2)) {
      dyslexiaRisk = "Medium"
    }

    // Overall score interpretation
    let overallMessage
    if (scorePercentage >= 85) {
      overallMessage = "Excellent job!"
    } else if (scorePercentage >= 70) {
      overallMessage = "Good work!"
    } else if (scorePercentage >= 50) {
      overallMessage = "Keep practicing!"
    } else {
      overallMessage = "Let's try again!"
    }

    return {
      overall: overallMessage,
      risk: dyslexiaRisk,
      details: {
        letterRecognition: letterRecognitionScore,
        phonological: phonologicalScore,
        sequencing: sequencingScore,
        memory: memoryScore,
        visualProcessing: visualProcessingScore,
      },
    }
  }

  const restartGame = () => {
    setFinished(false)
    setCurrentQ(0)
    setScore(0)
    setCategoryScores({})
  }

  return (
    <div className="kids-container">
      {/* Animated background elements */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>

      <div className="rainbow"></div>

      <div className="star star1"></div>
      <div className="star star2"></div>
      <div className="star star3"></div>

      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>

      {showAnimation && (
        <>
          <div className="confetti confetti1"></div>
          <div className="confetti confetti2"></div>
          <div className="confetti confetti3"></div>
          <div className="confetti confetti4"></div>
          <div className="confetti confetti5"></div>
          <div className="confetti confetti6"></div>
          <div className="firework firework1"></div>
          <div className="firework firework2"></div>
        </>
      )}

      <div className="sound-wave"></div>
      <div className="floating-character"></div>

      <button className="music-toggle" onClick={toggleMusic}>
        {isMusicPlaying ? "🔇 Mute" : "🔊 Play Music"}
      </button>

      {finished ? (
        <div className="score-screen">
          <h1 className="bouncing-text">
            Your Score: {score} / {questions.length}
          </h1>

          <div className="results-container">
            <h2 className="result-heading">Assessment Results</h2>

            <div className="result-card">
              <h3>Overall Performance</h3>
              <p>{calculateSeverity(score).overall}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(score / questions.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="result-card highlight">
              <h3>Dyslexia Risk Level</h3>
              <p className={`risk-level risk-${calculateSeverity(score).risk.toLowerCase()}`}>
                {calculateSeverity(score).risk}
              </p>
            </div>

            <div className="result-card">
              <h3>Skill Breakdown</h3>
              <ul className="skills-list">
                <li>
                  Letter Recognition:{" "}
                  <span className="skill-score">{calculateSeverity(score).details.letterRecognition}</span>
                </li>
                <li>
                  Phonological Awareness:{" "}
                  <span className="skill-score">{calculateSeverity(score).details.phonological}</span>
                </li>
                <li>
                  Sequencing: <span className="skill-score">{calculateSeverity(score).details.sequencing}</span>
                </li>
                <li>
                  Memory: <span className="skill-score">{calculateSeverity(score).details.memory}</span>
                </li>
                <li>
                  Visual Processing:{" "}
                  <span className="skill-score">{calculateSeverity(score).details.visualProcessing}</span>
                </li>
              </ul>
            </div>
          </div>

          <button className="restart-btn pulse-animation" onClick={restartGame}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="game-screen">
          <div className="progress-indicator">
            Question {currentQ + 1} of {questions.length}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentQ / questions.length) * 100}%` }}></div>
            </div>
          </div>

          <h2 className="question-text">{questions[currentQ].text}</h2>

          {timerActive && (
            <div className="timer">
              <div className="timer-circle">
                <span className="timer-number">{timeRemaining}</span>
              </div>
            </div>
          )}

          <div className="image-container">
            <img
              className="question-img wobble-animation"
              src={questions[currentQ].img || "/placeholder.svg"}
              alt="question"
            />
          </div>

          <div className="options">
            {questions[currentQ].options.map((option, idx) => (
              <button
                key={idx}
                className="option-btn pop-animation"
                onClick={() => handleAnswer(option)}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                {option}
              </button>
            ))}
          </div>

          {message && <div className="message scale-animation">{message}</div>}
        </div>
      )}
    </div>
  )
}

export default KidsAssessment

