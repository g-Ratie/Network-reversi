import type { UserId } from '$/commonTypesWithClient/branded';
import type { UserOnRoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { userOnRoomRepository } from '../repository/userOnRoomRepository';
export const userOnRoomUsecase = {
  create: async (firebaseId: UserId, roomId: string) => {
    const userOnRoom: UserOnRoomModel = {
      firebaseId,
      in: new Date(),
      out: new Date(),
      roomId: roomIdParser.parse(roomId),
    };
    await userOnRoomRepository.save(userOnRoom);
  },
  //進行中のゲームがあるかどうか確かめる関数を用意する
  isInGame: async (firebaseId: string): Promise<UserOnRoomModel | null> => {
    const userOnRoom = await userOnRoomRepository.findLatestByUser(firebaseId);
    if (userOnRoom) {
      const room = await roomRepository.getRoom(userOnRoom.roomId);
      if (room && room.status === 'playing') {
        return userOnRoom;
      }
    }
    return null;
  },
};
