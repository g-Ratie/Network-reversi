import type { UserId } from '$/commonTypesWithClient/branded';
import type { UserOnRoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { userOnRoomRepository } from '../repository/userOnRoomRepository';
import { roomUsecase } from './roomUsecase';
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
  //TODO 途中抜けされた相手側の処理が必要かも
  out: async (roomid: string) => {
    const userOnRooms = await userOnRoomRepository.findByRoom(roomid);
    userOnRooms.forEach(async (userOnRoom) => {
      userOnRoom.out = new Date();
      await userOnRoomRepository.save(userOnRoom);
    });
  },
  outWithRoom: async (roomid: string) => {
    await userOnRoomUsecase.out(roomid);
    await roomUsecase.out(roomid);
  },

  getbyRoom: async (roomid: string): Promise<UserOnRoomModel[] | null> => {
    const room = await roomRepository.getRoom(roomid);
    if (room) {
      const userOnRoomList = await userOnRoomRepository.findByRoom(roomid);
      return userOnRoomList;
    }
    return null;
  },
  getbyUser: async (firebaseid: string): Promise<UserOnRoomModel | null> => {
    const userOnRoom = await userOnRoomRepository.findLatestByUser(firebaseid);
    return userOnRoom;
  },
};
