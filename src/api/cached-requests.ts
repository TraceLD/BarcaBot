import { get, getPaged } from "./api-football";
import { getAsync, set } from "../cache/redis";
import { Duration } from "luxon";

export async function getWithCache<T>(uri: string, ttl: Duration): Promise<T> {
  const cached: T | undefined = await getAsync<T>(uri);

  if (cached !== undefined) {
    return cached;
  } else {
    const fresh: T = await get<T>(uri);
    set<T>(uri, fresh, ttl);
    return fresh;
  }
}
