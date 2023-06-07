import { boardRepository } from '$/repository/boardRespository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: boardRepository.turnColor() }),
}));
