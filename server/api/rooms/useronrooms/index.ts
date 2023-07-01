import type { UserId } from '$/commonTypesWithClient/branded';
import type { UserOnRoomModel } from './../../../commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: UserOnRoomModel | null;
  };
  post: {
    reqBody: { roomid: string; firebaseid: UserId };
  };
  delete: { reqBody: { roomid: string } };
};
