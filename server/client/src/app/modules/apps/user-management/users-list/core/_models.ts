import { ID, Response } from "../../../../../../_metronic/helpers";
export type User = {
  _id?: ID;
  name?: string;
  avatar?: string;
  email?: string;
  position?: string;
  role?: string;
  initials?: {
    label: string;
    state: string;
  };
  [key: string]: any;
};

export type UsersQueryResponse = Response<Array<User>>;

export const initialUser: User = {
  avatar: "",
  position: "Art Director",
  role: "Administrator",
  name: "",
  email: "",
};
