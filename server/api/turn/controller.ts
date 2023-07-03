import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: roomUsecase.getTurnColor() }),
  post: () => ({ status: 200, body: roomUsecase.passTurnColor() }),
}));
