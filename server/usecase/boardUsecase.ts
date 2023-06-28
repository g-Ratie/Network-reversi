import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorUsecase } from './userColorUsecase';

export type BoardArray = number[][];

const board: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, -1, 0, 0, 0],
  [0, 0, 0, 1, 2, -1, 0, 0],
  [0, 0, -1, 2, 1, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

let turnColor: 1 | 2 = 1;
const CheckCanput = (x: number, y: number, color: number, board: number[][]) => {
  const playerColor = color;
  const enemyColor = color === 1 ? 2 : 1;
  let results: number[][] = [];
  const isVaildCell = (x: number, y: number) => {
    return isOutOfBounds(x, y) || isBlankCell(x, y);
  };

  const isOutOfBounds = (x: number, y: number) => {
    return x < 0 || x > 7 || y < 0 || y > 7;
  };

  const isBlankCell = (x: number, y: number) => {
    return board[y][x] === 0;
  };

  const isPlayerCell = (x: number, y: number) => {
    return board[y][x] === playerColor;
  };

  const isEnemyCell = (x: number, y: number) => {
    return board[y][x] === enemyColor;
  };

  function checkCell(x: number, y: number, dx: number, dy: number) {
    const tempCells: number[][] = [];
    const nextX = x + dx;
    const nextY = y + dy;

    if (isOutOfBounds(nextX, nextY) || !isEnemyCell(nextX, nextY)) return tempCells;

    tempCells.push([nextY, nextX]);
    return tempCells;
  }
  function checkNextCells(x: number, y: number, dx: number, dy: number, tempCells: number[][]) {
    for (let j = 0; j < 7; j++) {
      const nextX = x + dx * (j + 1);
      const nextY = y + dy * (j + 1);

      if (isVaildCell(nextX, nextY)) continue;

      if (isPlayerCell(nextX, nextY)) {
        return tempCells;
      } else if (isEnemyCell(nextX, nextY)) {
        tempCells.push([nextY, nextX]);
      }
    }
    return [];
  }

  directions.forEach(([dx, dy]) => {
    let tempCells = checkCell(x, y, dx, dy);
    if (tempCells.length > 0) {
      tempCells = checkNextCells(x, y, dx, dy, tempCells);
      results = results.concat(tempCells);
    }
  });

  return results;
};

const GetSuggestions = (board: number[][], color: number) => {
  const results: number[][] = [];

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (CheckCanput(x, y, color, board).length > 0) {
        results.push([y, x]);
      }
    });
  });
  return results;
};

const setSuggestions = (board: number[][], color: number) => {
  resetSuggestions(board);
  const suggestions = GetSuggestions(board, color);
  for (let i = 0; i < suggestions.length; i++) {
    if (board[suggestions[i][0]][suggestions[i][1]] === 0) {
      board[suggestions[i][0]][suggestions[i][1]] = -1;
    }
  }
};

const resetSuggestions = (board: number[][]) => {
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === -1) {
        board[y][x] = 0;
      }
    });
  });
};

export const clickBoard = (x: number, y: number, userid: UserId, board: BoardArray): BoardArray => {
  const userColor = userColorUsecase.getUserColor(userid);
  const enemyColor = userColor === 1 ? 2 : 1;
  const canPutCells = CheckCanput(x, y, userColor, board);

  if (canPutCells.length !== 0 && turnColor === userColor) {
    board[y][x] = userColor;
    canPutCells.forEach(([y, x]) => {
      board[y][x] = userColor;
    });
    turnColor = turnColor === 1 ? 2 : 1;
    setSuggestions(board, enemyColor);
  }
  return board;
};

export const boardUsecase = {
  getBoard: () => board,
  clickBoard: (x: number, y: number, userid: UserId): BoardArray => {
    const userColor = userColorUsecase.getUserColor(userid);
    const enemyColor = userColor === 1 ? 2 : 1;
    const canPutCells = CheckCanput(x, y, userColor, board);

    if (canPutCells.length !== 0 && turnColor === userColor) {
      board[y][x] = userColor;
      canPutCells.forEach(([y, x]) => {
        board[y][x] = userColor;
      });
      turnColor = turnColor === 1 ? 2 : 1;
      setSuggestions(board, enemyColor);
    }
    return board;
  },
  getTurnColor: () => turnColor,
};