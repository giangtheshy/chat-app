export type TypeCall = {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: any;
  avatar: string;
  uid: string;
};

export type User = {
  _id: string;
  email: string;
  avatar: string;
  name: string;
  role: number;
  socket: string;
  online: boolean;
  createdAt: string;
  updatedAt: string;
};
