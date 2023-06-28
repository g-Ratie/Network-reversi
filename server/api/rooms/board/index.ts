import type { RoomModel } from '$/commonTypesWithClient/models';

export type Methods = {
  post: {
    reqBody: { x: number; y: number; roomid: string };
    resBody: RoomModel;
  };
};
