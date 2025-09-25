import React, { useState, useEffect, useRef } from "react";
import "./memory-game.css";

const shuffleCards = () => {
  const images = [
    'c.png', 'CSS.jpg', 'html.jpg', 'java.jpg',
    'javascript.png', 'python.png', 'nodejs.png', 'react.jpg'
  ];
  const cards = [...images, ...images];
  return cards.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [cards, setCards] = useState(shuffleCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(
    localStorage.getItem("best") ? parseInt(localStorage.getItem("best")) : null
  );
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [i, j] = flipped;
      if (cards[i] === cards[j]) {
        setMatched((m) => [...m, cards[i]]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (matched.length === cards.length / 2) {
      clearInterval(timerRef.current);
      if (!best || time < best) {
        setBest(time);
        localStorage.setItem("best", time);
      }
    }
  }, [matched, cards, time, best]);

  const flipCard = (i) => {
    if (flipped.length < 2 && !flipped.includes(i) && !matched.includes(cards[i])) {
      setFlipped([...flipped, i]);
    }
  };

  const restartClick = () => {
    setCards(shuffleCards());
    setFlipped([]);
    setMatched([]);
    setTime(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  };

  return (
    <div className="game-container">
      <h2>Memory Game</h2>
      <p className="time-box">Time: {time}s | Best: {best ?? "0"}s</p>

      <div className="cards-grid">
        {cards.map((val, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(val);
          return (
            <div
              key={i}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => flipCard(i)}
            >
              {isFlipped ? (
                <img src={`/images/${val}`} alt="card" />
              ) : (
                "?"
              )}
            </div>
          );
        })}
      </div>

      <button id="restart" onClick={restartClick}>Restart Game</button>
    </div>
  );
};

export default MemoryGame;