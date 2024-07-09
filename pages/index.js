import { useState } from 'react';
import styles from '../styles/home.module.css';

function Square({ value, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <button
      className={`${styles.square} ${value === 'X' ? styles.x : value === 'O' ? styles.o : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {value}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

  function handleClick(i) {
    const newSquares = squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
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
    status = 'Winner: ' + winner;
  } else if (squares.every(square => square !== null)) {
    status = 'It\'s a tie!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div>
      <div className={`${styles.status} ${styles.frostedGlass}`}>{status}</div>
      <div className={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button
        className={`${styles.resetButton} ${winner || squares.every(square => square !== null) ? styles.red : ''}`}
        onClick={resetGame}
        disabled={!winner && !squares.every(square => square !== null)}
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
      return squares[a];
    }
  }
  return null;
}

function Home() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
  }

  return (
    <main className={`${styles.main} ${darkMode ? styles.dark : styles.light}`}>
      <h1 className={styles.frostedGlass}>Tic Tac Toe</h1>
      <div className={styles.frostedGlass}>
        <Board />
      </div>
      <div className={styles.modeSwitch}>
        <button
          className={`${styles.modeButton} ${darkMode ? styles.selected : ''}`}
          onClick={toggleDarkMode}
        >
          🌜
        </button>
        <button
          className={`${styles.modeButton} ${!darkMode ? styles.selected : ''}`}
          onClick={toggleDarkMode}
        >
          🌞
        </button>
      </div>
    </main>
  );
}

export default Home;
