import type { RoomId, UserId } from '$/commonTypesWithClient/branded';
import { UserIdParser } from '$/service/idParsers';
import { userOnRoomUsecase } from './userOnRoomUsecase';

interface Room {
  black: UserId | undefined;
  white: UserId | undefined;
}

const userColorDict: { [roomid: string]: Room } = {};

// const userColorDict: {
//   [roomid: RoomId]: { black: UserId | undefined; white: UserId | undefined };
// }[] = [];

export const userColorUsecase = {
  getUserColorByRoomId: async (userId: UserId, roomid: RoomId): Promise<number> => {
    const userOnRooms = await userOnRoomUsecase.getbyRoom(roomid);
    const user_black = userOnRooms?.reduce((a, b) => (a.in < b.in ? a : b));
    const user_white = userOnRooms?.reduce((a, b) => (a.in > b.in ? a : b));
    if (userColorDict[roomid] === undefined) {
      userColorDict[roomid] = { black: undefined, white: undefined };
    }
    if (userColorDict[roomid].black === userId) {
      console.log(userColorDict);
      return 1;
    } else if (userColorDict[roomid].white === userId) {
      console.log(userColorDict);
      return 2;
    }
    //undefinedの場合は、まだ誰も入っていないので、先に入った人が黒、後に入った人が白
    else if (userColorDict[roomid].black === undefined) {
      userColorDict[roomid].black = UserIdParser.parse(user_black?.firebaseId);
      console.log(userColorDict);
      return 1;
    } else {
      userColorDict[roomid].white = UserIdParser.parse(user_white?.firebaseId);
      console.log(userColorDict);
      return 2;
    }
  },
};
