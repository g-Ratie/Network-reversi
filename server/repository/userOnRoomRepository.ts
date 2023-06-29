import type { UserOnRoomModel } from '$/commonTypesWithClient/models';
import { roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import type { UserOnRoom } from '@prisma/client';
import { z } from 'zod';

const toUserOnRoomModel = (prismaUserOnRoom: UserOnRoom): UserOnRoomModel => ({
  firebaseId: z.string().parse(prismaUserOnRoom.firebaseId),
  in: z.date().parse(prismaUserOnRoom.in),
  out: prismaUserOnRoom.out ? z.date().parse(prismaUserOnRoom.out) : null,
  roomId: roomIdParser.parse(prismaUserOnRoom.roomId),
});

export const userOnRoomRepository = {
  save: async (userOnRoom: UserOnRoom) => {
    await prismaClient.userOnRoom.upsert({
      where: {
        firebaseId_roomId: {
          firebaseId: userOnRoom.firebaseId,
          roomId: userOnRoom.roomId,
        },
      },
      create: {
        firebaseId: userOnRoom.firebaseId,
        in: userOnRoom.in,
        roomId: userOnRoom.roomId,
      },
      update: {
        out: userOnRoom.out,
      },
    });
    return userOnRoom && toUserOnRoomModel(userOnRoom);
  },
  findLatestByUser: async (firebaseid: string): Promise<UserOnRoomModel | null> => {
    const userOnRoom = await prismaClient.userOnRoom.findFirst({
      orderBy: { in: 'desc' },
      where: { firebaseId: firebaseid },
    });
    return userOnRoom && toUserOnRoomModel(userOnRoom);
  },
  findByRoom: async (roomid: string): Promise<UserOnRoomModel[]> => {
    const userOnRooms = await prismaClient.userOnRoom.findMany({
      where: { roomId: roomid },
    });
    return userOnRooms.map(toUserOnRoomModel);
  },
};
