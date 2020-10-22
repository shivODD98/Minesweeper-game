import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import GameCell from './GameCell';
import GameHeader from './GameHeader';

function GameContainer(props) {
  const [gameType, setGameType] = useState('easy');
  const [gameBoard, setGameBoard] = useState([]);
  const [numberOfUncoveredCells, setNumberOfUncoveredCells] = useState(0);
  const [numberOfMarkedCells, setNumberOfMarkedCells] = useState(0);
  const [numberOfMines, setNumberOfMines] = useState(10);
  const [exploded, setExploded] = useState(false);
  const [win, setWin] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const easyGameBoard = {
    cols: 10,
    rows: 8,
    mines: 10,
  };

  const hardGameBoard = {
    cols: 18,
    rows: 14,
    mines: 40,
  };

  useEffect(()=> {
  },[startGame, setStartGame])

  useEffect(()=> {
  },[gameType, setGameType])

  useEffect(()=> {
},[numberOfUncoveredCells, setNumberOfUncoveredCells])

  useEffect(()=> {
},[numberOfMarkedCells, setNumberOfMarkedCells])

  useEffect(()=> {
    if (exploded) {
        endGame('lost')
    }
  },[exploded, setExploded])

  useEffect(()=> {
    if (win) {
        endGame('won')
    }
  },[win, setWin])

  useEffect(()=> {
  },[gameBoard, setGameBoard])

  const randomInt = (min, max) => {
    [min,max] = [Math.ceil(min), Math.floor(max)]
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  const validCoord = (row, col) => {
    const { rows, cols } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

  const count = (row, col) => {
    const c = (r,c) => {
        return (validCoord(r, c) && (gameBoard[r][c].mine ? 1 : 0))};
    let res = 0;
    for( let dr = -1 ; dr <= 1 ; dr ++ )
        for( let dc = -1 ; dc <= 1 ; dc ++ )
            res += c(row+dr,col+dc);

    return res;
  }

  const sprinkleMines = (row, col) => {
    const { rows, cols, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    let allowed = [];
    for(let r = 0 ; r < rows ; r ++ ) {
        for( let c = 0 ; c < cols ; c ++ ) {
            if(Math.abs(row-r) > 2 || Math.abs(col-c) > 2) {
            allowed.push([r,c]);
            }
        }
    }
    setNumberOfMines(Math.min(numberOfMines, allowed.length))
    for( let i = 0 ; i < numberOfMines ; i ++ ) {
        let j = randomInt(i, allowed.length-1);
        [allowed[i], allowed[j]] = [allowed[j], allowed[i]];
        let [r,c] = allowed[i];
        gameBoard[r][c].mine=true;
    }
    for(let r = 0 ; r < rows ; r ++ ) {
        for( let c = 0 ; c < cols ; c ++ ) {
            if(gameBoard[r][c].status === 'marked') {
                gameBoard[r][c].status = 'hidden';
            }
            gameBoard[r][c].count = count(r,c);
        }
    }
  }

  const countGameBoardShownCells = () => {
    const { rows, cols, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    let count = 0;
    for(let i = 0; i < rows; i = i + 1) {
      for(let j = 0; j < cols; j = j + 1) {
        if (gameBoard[i][j].status === 'shown') {
          count++;
        }
      }
    }
    return count;
  }

  const uncoverCell = (row, col) => {
      if (numberOfUncoveredCells === 0) {
          sprinkleMines(row, col);
          setStartGame(true);
      }
      if( gameBoard[row][col].status !== 'hidden') return false;
      let cellsUncovered = 0;
      const ff = (r,c, count) => {
        if( ! validCoord(r,c)) return;
        if( gameBoard[r][c].status !== 'hidden') return;
        gameBoard[r][c].status = 'shown';
        setNumberOfUncoveredCells(numberOfUncoveredCells + 1);
        if( gameBoard[r][c].count !== 0) return;
        ff(r-1,c-1,count);ff(r-1,c,count);ff(r-1,c+1,count);
        ff(r  ,c-1,count);         ;ff(r  ,c+1,count);
        ff(r+1,c-1,count);ff(r+1,c, count);ff(r+1,c+1, count);
      };
      ff(row,col, cellsUncovered);
      if( gameBoard[row][col].mine) {
        setExploded(true);
      }
      const { rows, cols, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
      const shownCells = countGameBoardShownCells()
      if((shownCells + numberOfMines) === (rows*cols)){
        setWin(true)
      }
      return true;
  }

  const markCell = (row, col, newStatus) => {
    if( ! validCoord(row,col)) return false;
    if( gameBoard[row][col].status === 'shown') return false;
    gameBoard[row][col].status = newStatus;
    setNumberOfMarkedCells( numberOfMarkedCells + (gameBoard[row][col].status == 'marked' ? 1 : -1));
    return true;
  }

  const createGameCells = (rows, cols) => {
    const gameCells = [];
    let key = 0;
    for(let i = 0; i < rows; i = i + 1) {
        gameCells.push([])
        for(let j = 0; j < cols; j = j + 1) {
            gameCells[i].push(
                <GameCell
                    key={key}
                    uncoverCell={uncoverCell}
                    markCell={markCell}
                    row={i}
                    col={j}
                    mine={gameBoard[i][j].mine}
                    status={gameBoard[i][j].status}
                    count={gameBoard[i][j].count}
                    cell={gameBoard[i][j]}
                />
            )
            key++;
        }
    }
    return gameCells;
  }

  const endGame = (winOrLose) => {
    setGameBoard(winOrLose === 'lost' ? 
    (<div onClick={() => restartGame()} className="end-game">You Lost!!! ;( Click here to play again.</div>) : 
    (<div className="end-game" onClick={() => restartGame()}>You WON!!! AHHH XD Click here to play again.</div>))
  }

  const renderGameBoard = () => {
    const { rows, cols, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    for(let i = 0; i < rows; i = i + 1) {
        gameBoard.push([])
        for(let j = 0; j < cols; j = j + 1) {
            gameBoard[i].push(
                {
                    row: i,
                    col: j,
                    mine: false,
                    status: 'hidden',
                    count: 0,
                }
            )
        }
    }
    return (
        <div className={gameType + '-grid-container'}>
            {createGameCells(rows, cols)}
        </div>
      )
  }

  const handleGameTypeChange = (type) => {
    const { mines } = type === 'easy' ? easyGameBoard : hardGameBoard;
    restartGame();
    setGameType(type)
    setNumberOfMines(mines);
  }

  const restartGame = () => {
    setExploded(false);
    setWin(false);
    setNumberOfMarkedCells(0)
    setNumberOfUncoveredCells(0);
    setGameBoard([]);
    renderGameBoard();
  }

  const playGame = () => {
    if ((exploded || win) && gameBoard && gameBoard.type === 'div') {
      return gameBoard;
    }
    if(gameBoard.length === 0) {
        return renderGameBoard()
    }
    const { rows, cols, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    return (
      <div className={gameType + '-grid-container'}>
          {createGameCells(rows, cols)}
      </div>
    )
  }

  return (
    <Fragment>
      { (!win && !exploded) &&       
        <GameHeader
            gameType={gameType}
            setGameType={handleGameTypeChange}
            flagsLeft={numberOfMines - numberOfMarkedCells}
            startGame={startGame}
        />  
      }
        {playGame()}
    </Fragment>
  );
}

export default GameContainer;
