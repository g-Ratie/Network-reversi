import { roomRepository } from '$/repository/roomsRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomRepository.getWaitingRoomList() }),
}));
