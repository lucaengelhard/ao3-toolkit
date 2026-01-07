import "@std/dotenv/load";
import { type Option, Some, None } from "@joyful/option";
import type { Element, HTMLDocument } from "@b-fuze/deno-dom";
import { Err, Ok, type Result } from "@joyful/result";

export function env(key: string): Option<string> {
  const res = Deno.env.get(key);
  return res !== undefined ? new Some(res) : None;
}

export type QueryAble = {
  querySelector: HTMLDocument["querySelector"];
  querySelectorAll: HTMLDocument["querySelectorAll"];
};

export function optionQuerySelector(
  doc: QueryAble,
  ...args: Parameters<HTMLDocument["querySelector"]>
): Option<Element> {
  const res = doc.querySelector(...args);
  if (res === null) return None;

  return new Some(res);
}

export function optionQuerySelectorAll(
  doc: QueryAble,
  ...args: Parameters<HTMLDocument["querySelectorAll"]>
): Option<Array<Element>> {
  const res = doc.querySelectorAll(...args);
  if (res === null) return None;

  return new Some(Array.from(res));
}

export function reduceResultObj<
  TObj extends Record<string, Result<unknown, E>>,
  E
>(
  obj: TObj
): Result<
  { [K in keyof TObj]: TObj[K] extends Result<infer U, unknown> ? U : never },
  E
> {
  const res: any = {};

  for (const key in obj) {
    const el = obj[key];
    if (el.err()) return new Err(el.error);
    res[key] = el.value;
  }

  return new Ok(res);
}
