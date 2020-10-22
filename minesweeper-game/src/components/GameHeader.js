import React,  {useEffect, useState }from 'react';
import '../styles/App.css';

function GameHeader(props) {
  const [timer, setTimer] = useState(false);
  const [time, setTime] = useState(0);
  let t = 0;
  const {
    gameType,
    setGameType,
    flagsLeft,
    startGame,
  } = props;

  useEffect(()=> {
    if(startGame) {
        start();
    } else {
        stop();
    }
  }, [startGame])

  useEffect(()=> {
  }, [time])

  const start = () => {
    setTimer(setInterval(function(){
      t++;
      setTime(t);
    }, 1000));  
  }

  const stop = () => {
    if(timer) window.clearInterval(timer);
  }

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
      <div className="game-header-flags">Flags:{' ' + flagsLeft}</div>
    )
  }

  const renderTime = () => {
    return (
      <div className="game-header-time">Time:{' ' + ('000' + time).substr(-3)}</div>
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
