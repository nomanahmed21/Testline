import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const phrases = ["Get Started", "Try a Demo Quiz", "Test Your Knowledge"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter Effect
  useEffect(() => {
    if (charIndex < phrases[phraseIndex].length) {
      setTimeout(() => {
        setText((prev) => prev + phrases[phraseIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
    } else {
      setTimeout(() => {
        setText("");
        setCharIndex(0);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 1500);
    }
  }, [charIndex]);

  return (
    <div className="home-container">
      <h1 className="title">Welcome to <span className="highlight">TestLine</span></h1>
      <p className="animated-text">
        <span className={phraseIndex === 0 ? "get-started" : ""}>{text}</span>
        <span className="cursor">|</span>
      </p>
      <button className="start-btn" onClick={() => navigate("/quiz")}>
        Start Quiz
      </button>
    </div>
  );
}

export default Home;
