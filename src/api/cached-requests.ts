import { get, getPaged } from "./api-football";
import { getAsync, set } from "../cache/redis";

export async function getWithCache<T>(uri: string, ttlInSeconds: number): Promise<T> {
  const cached: T | undefined = <T>await getAsync<T>(uri);

  if (cached !== undefined) {
    return cached;
  } else {
    const fresh: T = await get<T>(uri);
    set<T>(uri, fresh, ttlInSeconds);
    return fresh;
  }
}
