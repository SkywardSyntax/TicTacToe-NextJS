import { useState, useEffect } from 'react';
import styles from '../styles/home.module.css';

function Square({ value, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      className={`${styles.square} ${value === 'X' ? styles.x : value === 'O' ? styles.o : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {value === 'X' ? <div className={styles.x}></div> : null}
    </button>
  );
}

function Board({ isDarkMode, scores, setScores, incrementGameCount }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [scoreUpdated, setScoreUpdated] = useState(false);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function handleMouseEnter(i) {
    setHoverIndex(i);
  }

  function handleMouseLeave() {
    setHoverIndex(null);
  }

  function renderSquare(i) {
    return (
      <Square
        value={squares[i] || (hoverIndex === i ? (xIsNext ? 'X' : 'O') : null)}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
      />
    );
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner.player;
  } else if (squares.every((square) => square !== null)) {
    status = "It's a tie!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  useEffect(() => {
    if (winner && !scoreUpdated) {
      setWinningLine(winner.line);
      setScores((prevScores) => ({
        ...prevScores,
        [winner.player]: prevScores[winner.player] + 1,
      }));
      setScoreUpdated(true);
      incrementGameCount();
    } else if (!winner && squares.every((square) => square !== null) && !scoreUpdated) {
      setScoreUpdated(true);
      incrementGameCount();
    } else if (!winner) {
      setWinningLine(null);
      setScoreUpdated(false);
    }
  }, [winner, setScores, scoreUpdated, incrementGameCount, squares]);

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
    setScoreUpdated(false);
  }

  // Calculate SVG line coordinates
  const squareSize = 106;
  const boardSize = 320;
  const lineCoordinates = winningLine
    ? [
        [(winningLine[0] % 3) * squareSize + squareSize / 2, Math.floor(winningLine[0] / 3) * squareSize + squareSize / 2], // Start point
        [(winningLine[1] % 3) * squareSize + squareSize / 2, Math.floor(winningLine[1] / 3) * squareSize + squareSize / 2], // End point
      ]
    : null;

  // Extend the line coordinates beyond the board
  const extendedLineCoordinates = lineCoordinates
    ? [
        [
          lineCoordinates[0][0] - (lineCoordinates[1][0] - lineCoordinates[0][0]) * 0.1,
          lineCoordinates[0][1] - (lineCoordinates[1][1] - lineCoordinates[0][1]) * 0.1,
        ],
        [
          lineCoordinates[1][0] + (lineCoordinates[1][0] - lineCoordinates[0][0]) * 0.1,
          lineCoordinates[1][1] + (lineCoordinates[1][1] - lineCoordinates[0][1]) * 0.1,
        ],
      ]
    : null;

  return (
    <div>
      <div className={`${styles.status} ${styles.frostedGlass}`}>{status}</div>
      <div className={styles.grid}>
        <div className={`${styles.gridLine} ${styles.horizontal}`}></div>
        <div className={`${styles.gridLine} ${styles.horizontal}`}></div>
        <div className={`${styles.gridLine} ${styles.vertical}`}></div>
        <div className={`${styles.gridLine} ${styles.vertical}`}></div>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}

        {/* SVG for the winning line */}
        {winningLine && (
          <svg className={styles.winningLine} width="320" height="320">
            <line 
              x1={extendedLineCoordinates[0][0]} 
              y1={extendedLineCoordinates[0][1]} 
              x2={extendedLineCoordinates[1][0]} 
              y2={extendedLineCoordinates[1][1]} 
              stroke={isDarkMode ? 'white' : 'black'} 
              strokeWidth="4" 
            />
          </svg>
        )}
      </div>
      <button
        className={`${styles.resetButton} ${winner || squares.every((square) => square !== null) ? `${styles.red} ${styles.pulsate}` : ''}`}
        onClick={resetGame}
        disabled={!winner && !squares.every((square) => square !== null)}
      >
        🔄 Reset
      </button>
    </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, c] };
    }
  }
  return null;
}

function ModeSwitcher({ isDarkMode, toggleDarkMode }) {
  return (
    <div
      className={`${styles.modeSwitcher} ${isDarkMode ? styles.darkMode : ''}`}
      onClick={toggleDarkMode}
    >
      <div className={styles.icon}></div>
    </div>
  );
}

function ScoreBoard({ scores }) {
  return (
    <div className={styles.scoreBoardContainer}>
      <div className={`${styles.scoreBoard} ${styles.frostedGlass}`}>
        <div>Player X: {scores.X}</div>
      </div>
      <div className={`${styles.scoreBoard} ${styles.frostedGlass}`}>
        <div>Player O: {scores.O}</div>
      </div>
    </div>
  );
}

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const incrementGameCount = () => {
    setGameCount((prevCount) => prevCount + 1);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.frostedGlass}>Tic Tac Toe</h1>
      <div className={styles.frostedGlass}>
        <Board isDarkMode={isDarkMode} scores={scores} setScores={setScores} incrementGameCount={incrementGameCount} /> 
      </div>
      <ScoreBoard scores={scores} />
      <div className={`${styles.scoreBoard} ${styles.frostedGlass}`}>
        <div>Games Played: {gameCount}</div>
      </div>
      <ModeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </main>
  );
}

export default Home;
