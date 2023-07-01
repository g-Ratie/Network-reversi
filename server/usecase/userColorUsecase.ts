import type { RoomId, UserId } from '$/commonTypesWithClient/branded';
import { UserIdParser } from '$/service/idParsers';
import { userOnRoomUsecase } from './userOnRoomUsecase';

const userColorDict: { black?: UserId; white?: UserId } = {};

export const userColorUsecase = {
  getUserColor: (userId: UserId): number => {
    if (userColorDict.black === userId) {
      return 1;
    } else if (userColorDict.white === userId) {
      return 2;
    } else if (userColorDict.black === undefined) {
      userColorDict.black = userId;
      return 1;
    } else {
      userColorDict.white = userId;
      return 2;
    }
  },
  getUserColorByRoomId: async (userId: UserId, roomid: RoomId): Promise<number> => {
    const userOnRooms = userOnRoomUsecase.getbyRoom(roomid);
    const resolvedUserOnRooms = await userOnRooms;
    const user_black = resolvedUserOnRooms?.reduce((a, b) => (a.in < b.in ? a : b));
    const user_white = resolvedUserOnRooms?.reduce((a, b) => (a.in > b.in ? a : b));
    if (userColorDict.black === userId) {
      return 1;
    } else if (userColorDict.white === userId) {
      return 2;
    }
    //undefinedの場合は、まだ誰も入っていないので、先に入った人が黒、後に入った人が白
    else if (userColorDict.black === undefined) {
      userColorDict.black = UserIdParser.parse(user_black?.firebaseId);
      return 1;
    } else {
      userColorDict.white = UserIdParser.parse(user_white?.firebaseId);
      return 2;
    }
  },
};
