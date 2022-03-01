export interface User {
  _id?: string;
  authId: string;
  name?: string;
}

export interface HTTPBody {
  [key: string]: any;
}
