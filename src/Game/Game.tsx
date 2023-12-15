import React, { useState, useEffect } from 'react';
import './Game.css';
import DropDown from '../DropDown/DropDown';

interface Mode {
  name: string;
  field: number;
  id: string;
}

interface SquarePosition {
  row: number;
  col: number;
}

const Game: React.FC = () => {
  const [modes, setModes] = useState<Mode[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [squares, setSquares] = useState<boolean[]>([]);
  const [hoveredSquares, setHoveredSquares] = useState<SquarePosition[]>([]);
  const [lastThreeHovered, setLastThreeHovered] = useState<SquarePosition[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    fetch('https://60816d9073292b0017cdd833.mockapi.io/modes')
      .then(response => response.json())
      .then(data => setModes(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (selectedOption && modes.length > 0) {
      const mode = modes.find(mode => mode.name === selectedOption);
      if (mode) {
        setSelectedMode(mode);
        setSquares(new Array(mode.field ** 2).fill(false));
        setHoveredSquares([]);
        setLastThreeHovered([]);
      }
    }
  }, [selectedOption, modes]);

  const getRowColFromIndex = (index: number): SquarePosition => {
    const row = Math.floor(index / (selectedMode?.field || 1)) + 1;
    const col = (index % (selectedMode?.field || 1)) + 1;
    return { row, col };
  };

  const toggleSquare = (index: number) => {
    setSquares(squares => squares.map((val, idx) => idx === index ? !val : val));
    const pos = getRowColFromIndex(index);

    setLastThreeHovered(prevLastThreeHovered =>
      prevLastThreeHovered.length === 3
        ? [...prevLastThreeHovered.slice(1), pos]
        : [...prevLastThreeHovered, pos]
    );

    setHoveredSquares(prevHoveredSquares =>
      prevHoveredSquares.some(p => p.row === pos.row && p.col === pos.col)
        ? prevHoveredSquares.filter(p => p.row !== pos.row || p.col !== pos.col)
        : [...prevHoveredSquares, pos]
    );
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const clearGame = () => {
    setGameStarted(false);
    setSelectedMode(null);
    setSquares([]);
    setHoveredSquares([]);
    setLastThreeHovered([]);
  };

  return (
    <div>
      <div className='container_navigate'>
        <DropDown
          options={modes.map(mode => mode.name)}
          onChange={(selectedOption) => setSelectedOption(selectedOption)}
        />
        <button className='btn_start btn_navigate' onClick={startGame} disabled={!selectedOption || gameStarted}>
          Start Game
        </button>
        <button className='btn_clear btn_navigate' onClick={clearGame} disabled={!selectedMode && !gameStarted}>
          Clear Game
        </button>
        <div className='history_points'>
          <h3>Hover Squares: </h3>
          {lastThreeHovered.map((pos, idx) => (
            <p className='history_points-point' key={idx}>Last row: {pos.row} col: {pos.col}</p>
          ))}
        </div>
      </div>
      {gameStarted && (
        <div style={{ display: 'grid', justifyContent: 'center', gridTemplateColumns: `repeat(${selectedMode?.field || 1}, 50px)` }}>
          {squares.map((isBlue, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                backgroundColor: isBlue ? 'blue' : 'white',
              }}
              onMouseEnter={() => toggleSquare(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Game;
