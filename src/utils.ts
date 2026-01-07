import "@std/dotenv/load";
import { type Option, Some, None } from "@joyful/option";

export function env(key: string): Option<string> {
  const res = Deno.env.get(key);
  return res !== undefined ? new Some(res) : None;
}
