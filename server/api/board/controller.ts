import { defineController } from './$relay';
import { boardRepository } from './../../repository/boardRespository';

export default defineController(() => ({
  get: () => ({ status: 200, body: { board: boardRepository.getBoard() } }),
  post: async ({ body, user }) => ({
    status: 201,
    body: { board: boardRepository.clickBoard(body.x, body.y, user.id) },
  }),
}));
