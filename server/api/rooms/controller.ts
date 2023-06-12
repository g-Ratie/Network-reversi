import { roomRepository } from '$/repository/roomsRepository';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomRepository.findLatest() }),
  post: async () => ({
    status: 201,
    body: await roomUsecase.create(),
  }),
}));
