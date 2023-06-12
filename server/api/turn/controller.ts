import { boardUsecase } from '$/usecase/boardUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: boardUsecase.getTurnColor() }),
}));
