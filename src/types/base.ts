export interface Login {
  username: string;
  password: string;
}

export interface UserInfo {
  id?: number;
  username: string;
  userLink: string;
  pseuds?: string[];
  joined?: Date;
}
