import React,  {useEffect, useState  }from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import '../styles/App.css';

function GameCell(props) {
  const [startTapHold, setStartTapHold] = useState(false);
  const [disableClick, setDisableClick] = useState(false);
  const [isMarkingCell, setIsMarkingCell] = useState(false)
  const ms = 1000;
  const {
    uncoverCell,
    markCell,
    row,
    col,
    mine,
    count,
    status,
    cell,
  } = props;

  useEffect(()=> {
    console.log(status)
  }, [row, col, mine, count, status,cell])

  useEffect(() => {
    let timerId;
    if (startTapHold && !disableClick) {
      timerId= setTimeout(() => {
        console.log('in callback' + row + ',' + col)
        if(startTapHold) markCellCallBack();
      }, ms);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [markCell, ms, startTapHold]);

  const markCellCallBack = () => {
    const newStatus = status === 'hidden' ? 'marked' : 'hidden';
    markCell(row, col, newStatus, isMarkingCell)
    setDisableClick(true);
    setTimeout(() => {setDisableClick(false);}, 500);
  }

  const handleCellClick = (event) => {
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
        if (!disableClick){
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
          className={`grid-cell${'-' + status}`}
        >
            {status === 'shown' && <div className='grid-cell-count'>{count}</div>}
            {status === 'marked' && <div className='grid-cell-count'><FontAwesomeIcon icon={faFlag} /></div>}
        </div>
      )
  }

  return (
    renderGridCell()
  );
}

export default GameCell;
