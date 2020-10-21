import React,  {useEffect, useState }from 'react';
import '../styles/App.css';

function GameHeader(props) {
  const [testVar, setTestVar] = useState(1);
  const {
    gameType,
    setGameType,
  } = props;

  useEffect(()=> {
  }, [])

  const handleDifficultyChange = (event) => {
    setGameType(event.target && event.target.value)
  }

  const renderDifficultyDropDown = () => {
    return (
      <div className="game-header-dificulty">
        <select className="game-header-difficulty-dropdown" value={gameType} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    )
  }

  const renderNumberOfFlags = () => {
    return (
      <div className="game-header-flags">10</div>
    )
  }

  const renderTime = () => {
    return (
      <div className="game-header-time">000</div>
    )
  }

  const renderGameHeader = () => {
      return (
        <div className="game-header">
          {renderDifficultyDropDown()}
          {renderNumberOfFlags()}
          {renderTime()}
        </div>
      )
  }

  return (
    renderGameHeader()
  );
}

export default GameHeader;
