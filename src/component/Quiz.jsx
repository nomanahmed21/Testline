import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

function Quiz() {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quiz")
      .then((response) => {
        const shuffledQuestions = shuffleArray(response.data.questions);
        const updatedQuestions = shuffledQuestions.map((question) => {
          return {
            ...question,
            options: shuffleArray(question.options),
          };
        });
        setData({ ...response.data, questions: updatedQuestions });
        setTimeLeft(response.data.duration * 60);
      })
      .catch((error) => setError("Error fetching data: " + error.message));
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleFinishQuiz();
    } else if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setLoading(true);
    setProgress(0); // Reset progress bar

    const correct_answer_marks = parseInt(data.correct_answer_marks, 10);
    const negative_marks = parseInt(data.negative_marks, 10);

    if (data.questions[currentIndex].options[index].is_correct) {
      setScore((prevScore) => prevScore + correct_answer_marks);
      setCorrectCount((prevCorrect) => prevCorrect + 1);
      setFeedback("✅ Correct!");
    } else {
      setScore((prevScore) => prevScore - negative_marks);
      setWrongCount((prevWrong) => prevWrong + 1);
      setFeedback("❌ Incorrect!");
    }

    let progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 50);

    setTimeout(() => {
      setLoading(false);
      setFeedback("");
      setSelectedAnswer(null);
      if (currentIndex < data.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleFinishQuiz();
      }
    }, 2000);
  };

  const handleFinishQuiz = () => {
    navigate("/results", {
      state: {
        score: score,
        correctCount: correctCount,
        wrongCount: wrongCount,
        totalQuestions: data.questions.length,
        timeLeft: timeLeft,
      },
    });
  };

  const handleEndTest = () => {
    navigate("/results", {
      state: {
        score: score,
        correctCount: correctCount,
        wrongCount: wrongCount,
        totalQuestions: data.questions.length,
        timeLeft: timeLeft,
      },
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    if (currentIndex === data.questions.length - 1) {
      handleFinishQuiz();
    }
  };
  
  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const question = data.questions[currentIndex];
  const options = question.options;

  return (
    <div id="quiz-container">
      <h2>{question.description}</h2>
      <p className="timer">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</p>
      <ul>
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`option ${selectedAnswer === index ? option.is_correct ? "selected-correct" : "selected-wrong" : ""}`}
          >
            {option.description}
          </li>
        ))}
      </ul>
      {feedback && <p className={`feedback ${feedback.includes("✅") ? "correct" : "incorrect"}`}>{feedback}</p>}
      <div className="next-btn-container">
      <button id="next-btn" className={loading ? "progressing in-progress" : ""}onClick={handleNext}>Next</button>


    
      </div>
      <button id="end-test-btn" onClick={handleEndTest}>End Test</button>
    </div>
  );
}

export default Quiz;
