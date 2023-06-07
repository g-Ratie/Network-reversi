import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorRepository } from './userColorRepository';

export type BoardArray = number[][];

const board: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

let turnColor: 1 | 2 = 1;
const CheckCanput = (x: number, y: number, color: number, board: number[][]) => {
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

export const boardRepository = {
  getBoard: () => board,
  clickBoard: (x: number, y: number, userid: UserId): BoardArray => {
    const userColor = userColorRepository.getUserColor(userid);
    const canPutCells = CheckCanput(x, y, userColor, board);
    if (canPutCells.length !== 0 && turnColor === userColor) {
      canPutCells.forEach(([y, x]) => {
        board[y][x] = userColor;
      });
      board[y][x] = userColor;
      turnColor = turnColor === 1 ? 2 : 1;
    }

    return board;
  },
  turnColor: () => turnColor,
};
