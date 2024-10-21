import { Music } from "./musicModel";

export interface User {
  id: string;
  email: string;
  user_name: string;
  password: string;
  subscriptions?: string[]; // Array of music IDs
  subscriptionsData?: Music[];
}