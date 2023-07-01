import { userOnRoomRepository } from '$/repository/userOnRoomRepository';
import { roomIdParser } from '$/service/idParsers';
import { userOnRoomUsecase } from '$/usecase/userOnRoomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user }) => ({
    status: 200,
    body: await userOnRoomRepository.findLatestByUser(user.id),
  }),
  post: async ({ body }) => ({
    status: 200,
    body: await userOnRoomUsecase.create(body.firebaseid, body.roomid),
  }),
  delete: async ({ body }) => ({
    status: 200,
    body: await userOnRoomUsecase.outWithRoom(roomIdParser.parse(body.roomid)),
  }),
}));
