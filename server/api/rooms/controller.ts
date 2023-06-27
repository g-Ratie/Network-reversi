import { roomRepository } from '$/repository/roomsRepository';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: await roomUsecase.create(),
  }),
  post: async ({ body }) => ({
    status: 200,
    body: await roomRepository.getroom(body.roomid),
  }),
}));
