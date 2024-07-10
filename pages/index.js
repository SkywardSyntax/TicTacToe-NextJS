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

function Board({ isDarkMode }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [winningLine, setWinningLine] = useState(null);

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
    if (winner) {
      setWinningLine(winner.line);
    } else {
      setWinningLine(null);
    }
  }, [winner]); 

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
  }

  function drawWinningLine(line) {
    if (!line) return null;

    const [start, end] = line;
    const startRow = Math.floor(start / 3);
    const startCol = start % 3;
    const endRow = Math.floor(end / 3);
    const endCol = end % 3;

    const startX = (startCol * 106) + 53; 
    const startY = (startRow * 106) + 53; 
    const endX = (endCol * 106) + 53; 
    const endY = (endRow * 106) + 53; 

    const length = Math.sqrt(((endX - startX) ** 2) + ((endY - startY) ** 2));
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    return (
      <div
        className={`${styles.animatedLine} ${isDarkMode ? styles.darkModeLine : ''}`}
        style={{
          width: `${length}px`,
          transform: `translate(${startX}px, ${startY}px) rotate(${angle}deg)`, 
        }}
      ></div>
    );
  }

  return (
    <div>
      <div className={`${styles.status} ${styles.frostedGlass}`}>
        {status}
      </div>
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
        {drawWinningLine(winningLine)} 
      </div>
      <button
        className={`${styles.resetButton} ${
          winner || squares.every((square) => square !== null) ? styles.red : ''
        }`}
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

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <main className={styles.main}>
      <h1 className={styles.frostedGlass}>Tic Tac Toe</h1>
      <div className={styles.frostedGlass}>
        <Board isDarkMode={isDarkMode} /> {/* Pass isDarkMode here */}
      </div>
      <ModeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </main>
  );
}

export default Home;
