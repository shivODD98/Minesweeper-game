import React,  {useEffect, useState, useCallback  }from 'react';
import '../styles/App.css';

function GameCell(props) {
  const [startTapHold, setStartTapHold] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const ms = 300;
  const {
    uncoverCell,
    markCell,
    row,
    col,
    mine,
    count,
    status,
  } = props;

  useEffect(()=> {
  }, [mine])

  
  useEffect(() => {
    let timerId;
    if (startTapHold) {
      timerId = setTimeout(markCellCallBack, ms);
    } else {
      clearTimeout(timerId);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [markCell, ms, startTapHold]);

  const markCellCallBack = () => {
    const newStatus = status === 'hidden' ? 'marked' : 'hidden';
    markCell(row, col, newStatus)
    setDisableClick(true);
    setTimeout(() => {setDisableClick(false);}, 1000);
  }

  const handleCellClick = (event) => {
    console.log(event.type)
    switch(event.type) {
      case 'mousedown': {
        setStartTapHold(true);
        break;
      }
      case 'mouseup': {
        setStartTapHold(false);
        break;
      }
      case 'mouseleave': {
        setStartTapHold(false);
        break;
      }
      case 'touchstart': {
        setStartTapHold(true);
        break;
      }
      case 'touchend': {
        setStartTapHold(false);
        break;
      }
      case 'click': {
        if (!disableClick ){
          uncoverCell(row, col)
        }
        break;
      }
      case 'contextmenu': {
        event.preventDefault();
        markCellCallBack();
        break;
      }
      default: {
        break;
      }
    }
  }

  const renderGridCell = () => {
      return (
        <div 
          onClick={handleCellClick}
          onContextMenu={handleCellClick}
          onMouseDown={handleCellClick}
          onMouseUp={handleCellClick}
          onMouseLeave={handleCellClick}
          onTouchStart={handleCellClick}
          onTouchEnd={handleCellClick}
          className={`grid-cell${'-' + status}`}>
            <div>{mine === true ? 'mine' : ''}</div>
            <div>{count}</div>
        </div>
      )
  }

  return (
    renderGridCell()
  );
}

export default GameCell;
