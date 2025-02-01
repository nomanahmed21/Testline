import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score, correctCount, wrongCount, totalQuestions, timeLeft } = location.state || {};

  return (
    <div className="result-container">
      <h2>Quiz Completed 🎉</h2>

      <div className="result-grid">
        <div className="result-card score-card">
          <span className="label">Score</span>
          <span className="value">{score}</span>
        </div>

        <div className="result-card correct-card">
          <span className="label">Correct</span>
          <span className="value">{correctCount}</span>
        </div>

        <div className="result-card wrong-card">
          <span className="label">Wrong</span>
          <span className="value">{wrongCount}</span>
        </div>

        <div className="result-card total-card">
          <span className="label">Total Questions</span>
          <span className="value">{totalQuestions}</span>
        </div>

        <div className="result-card time-card">
          <span className="label">Time Left</span>
          <span className="value">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>
      </div>

      <button className="restart-btn" onClick={() => navigate("/")}>
        Try Again
      </button>
    </div>
  );
}

export default Result;
