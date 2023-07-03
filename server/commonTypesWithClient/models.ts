import type { RoomId, TaskId, UserId } from './branded';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export type TaskModel = {
  id: TaskId;
  label: string;
  done: boolean;
  created: number;
};

export type RoomModel = {
  id: RoomId;
  board: number[][];
  currentColor: 1 | 2;
  status: 'waiting' | 'playing' | 'ended';
  created: number;
};

export type UserOnRoomModel = {
  firebaseId: string;
  in: Date;
  out: Date | null;
  roomId: RoomId;
};
