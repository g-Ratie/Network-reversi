export type Methods = {
  get: {
    query: {
      roomid: string;
    };
    resBody: number;
  };
  post: {
    reqBody: {
      roomid: string;
    };
    resBody: number;
  };
};
