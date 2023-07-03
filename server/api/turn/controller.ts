import { roomIdParser } from '$/service/idParsers';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await roomUsecase.getTurnColor(roomIdParser.parse(query.roomid)),
  }),
  post: async ({ body }) => ({
    status: 200,
    body: await roomUsecase.passTurnColor(roomIdParser.parse(body.roomid)),
  }),
}));
