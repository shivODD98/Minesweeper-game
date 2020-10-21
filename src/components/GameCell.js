import React,  {useEffect, useState }from 'react';
import '../styles/App.css';
import { Fragment } from 'react';

function GameCell(props) {
  const {
    uncoverCell,
    row,
    col,
    mine,
    count,
    status,
  } = props;

  useEffect(()=> {
      console.log(mine)
  }, [mine])


  const renderGridCell = () => {
      return (
        <div onClick={() => uncoverCell(row, col)}className={`grid-cell${'-' + status}`}>
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
