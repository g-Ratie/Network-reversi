import type { RoomModel } from '$/commonTypesWithClient/models';
import { prismaClient } from '$/service/prismaClient';
import type { Room } from '@prisma/client';
import { z } from 'zod';
import { roomIdParser } from './../service/idParsers';

const toRoomModel = (prismaRoom: Room): RoomModel => ({
  id: roomIdParser.parse(prismaRoom.roomId),
  board: z.array(z.array(z.number())).parse(prismaRoom.board),
  status: z.enum(['waiting', 'playing', 'ended']).parse(prismaRoom.status),
  created: prismaRoom.createdAt.getTime(),
  //currentcolorは 0<currentColor<=2 であることを保証する
  currentColor: z.number().min(1).max(2).parse(prismaRoom.currentColor) as 1 | 2,
});

export const roomRepository = {
  save: async (room: RoomModel) => {
    await prismaClient.room.upsert({
      where: { roomId: room.id },
      update: { status: room.status, board: room.board, currentColor: room.currentColor },
      create: {
        roomId: room.id,
        board: room.board,
        status: room.status,
        currentColor: room.currentColor,
        createdAt: new Date(room.created),
      },
    });
  },
  findLatest: async (): Promise<RoomModel | null> => {
    const room = await prismaClient.room.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return room && toRoomModel(room);
  },
  getRoom: async (roomid: string): Promise<RoomModel | null> => {
    const roomId = roomIdParser.parse(roomid);
    const room = await prismaClient.room.findUnique({
      where: { roomId },
    });
    return room && toRoomModel(room);
  },
  getWaitingRoomList: async (): Promise<RoomModel[]> => {
    const rooms = await prismaClient.room.findMany({
      where: { status: 'waiting' },
    });
    const roomModels = rooms.map(toRoomModel);
    return roomModels;
  },
};
