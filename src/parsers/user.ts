import type { Tag } from "./tag.ts";

export interface User extends Tag {
  name: string;
  url: string;
}
