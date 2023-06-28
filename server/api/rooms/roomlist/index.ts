import type { RoomModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: RoomModel[];
  };
  post: {
    reqBody: { roomid: string };
    resBody: RoomModel;
  };
};
