import type { BoardArray } from '$/repository/boardRespository';

export type Methods = {
  get: {
    resBody: { board: number[][] };
  };
  post: {
    reqBody: { x: number; y: number };
    resBody: { board: BoardArray };
  };
};
