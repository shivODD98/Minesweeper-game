import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import GameCell from './GameCell';
import GameHeader from './GameHeader';

function GameContainer(props) {
  const [testVar, setTestVar] = useState(1);
  const [gameType, setGameType] = useState('easy');
  const [gameBoard, setGameBoard] = useState([]);
  const [numberOfUncoveredCells, setNumberOfUncoveredCells] = useState(0);
  const [numberOfMines, setNumberOfMines] = useState(10);
  const [exploded, setExploded] = useState(false)

  const easyGameBoard = {
      width: 10,
      height: 8,
      mines: 10,
  };

  const hardGameBoard = {
    width: 18,
    height: 14,
    mines: 40,
  };

  useEffect(()=> {
    // renderGameBoard();
  },[gameType, setGameType])

  useEffect(()=> {
      console.log(gameBoard)
  },[gameBoard, setGameBoard])

  const randomInt = (min, max) => {
    [min,max] = [Math.ceil(min), Math.floor(max)]
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  const validCoord = (row, col) => {
    const { width, height } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    return row >= 0 && row < width && col >= 0 && col < height;
}

  const count = (row, col) => {
    const c = (r,c) => (validCoord(r, c) && (gameBoard[r][c].mine ? 1 : 0));
    let res = 0;
    for( let dr = -1 ; dr <= 1 ; dr ++ )
        for( let dc = -1 ; dc <= 1 ; dc ++ )
            res += c(row+dr,col+dc);
    return res;
  }

  const sprinkleMines = () => {
    // prepare a list of allowed coordinates for mine placement
    console.log('sprinkling mines')
    const { width, height, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
    let allowed = [];
    for(let r = 0 ; r < width ; r ++ ) {
        for( let c = 0 ; c < height ; c ++ ) {
            if(Math.abs(width-r) > 2 || Math.abs(height-c) > 2) {
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
    // erase any marks (in case user placed them) and update counts
    for(let r = 0 ; r < width ; r ++ ) {
        console.log('setting count')
        for( let c = 0 ; c < height ; c ++ ) {
            console.log('pt 2')
            if(gameBoard[r][c].status === 'marked') {
                gameBoard[r][c].status = 'hidden';
            }
            gameBoard[r][c].count = count(r,c);
        }
    }
  }

  const uncoverCell = (row, col) => {
      if (numberOfUncoveredCells === 0) {
          sprinkleMines();
      }

      if( gameBoard[row][col].status !== 'hidden') return false;
      // floodfill all 0-count cells
      const ff = (r,c) => {
        if( ! validCoord(r,c)) return;
        if( gameBoard[r][c].status !== 'hidden') return;
        gameBoard[r][c].status = 'shown';
        setNumberOfUncoveredCells(numberOfUncoveredCells + 1)
        if( gameBoard[r][c].count !== 0) return;
        ff(r-1,c-1);ff(r-1,c);ff(r-1,c+1);
        ff(r  ,c-1);         ;ff(r  ,c+1);
        ff(r+1,c-1);ff(r+1,c);ff(r+1,c+1);
      };
      ff(row,col);
      // have we hit a mine?
      if( gameBoard[row][col].mine) {
        setExploded(true);
      }
      return true;
  }

  const createGameCells = (width, height) => {
    const gameCells = [];
    for(let i = 0; i < width; i = i + 1) {
        gameCells.push([])
        for(let j = 0; j < height; j = j + 1) {
            gameCells[i].push(
                <GameCell
                    uncoverCell={uncoverCell}
                    row={i}
                    col={j}
                    mine={gameBoard[i][j].mine}
                    status={gameBoard[i][j].status}
                    count={gameBoard[i][j].count}
                />
            )
        }
    }
    return gameCells;
  }

  const renderGameBoard = () => {
    const { width, height, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;

    for(let i = 0; i < width; i = i + 1) {
        gameBoard.push([])
        for(let j = 0; j < height; j = j + 1) {
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
    console.log(gameBoard)
    return (
        <div className={gameType + '-grid-container'}>
            {createGameCells(width, height)}
        </div>
      )
  }

  const playGame = () => {
      console.log(gameBoard)
      if(gameBoard.length === 0) {
          return renderGameBoard()
      }
      const { width, height, mines } = gameType === 'easy' ? easyGameBoard : hardGameBoard;
      return (
        <div className={gameType + '-grid-container'}>
            {createGameCells(width, height)}
        </div>
      )
  }

  return (
    <Fragment>
        <GameHeader
            gameType={gameType}
            setGameType={setGameType}
        />  
        {playGame()}
    </Fragment>
  );
}

export default GameContainer;
