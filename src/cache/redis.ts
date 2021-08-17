import logger from "../logger";
import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { redisPassword } from "../config.json";
import { Duration } from "luxon";

const redisClient: RedisClient = redis.createClient({
  password: redisPassword,
});
const getRawAsync = promisify(redisClient.get).bind(redisClient);

redisClient.on("ready", () => {
  logger.info("Redis connection established and ready.");

  redisClient.dbsize((err: Error | null, n: number) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info(`Redis DB size: ${n}`);
    }
  });
});

redisClient.on("error", (err: Error) => {
  logger.error(err);
});

async function getAsync<T>(key: string): Promise<T | undefined> {
  const response: string | null = await getRawAsync(key);

  logger.log({
    level: "debug",
    message: "Obtained cached value",
    context: { key: key, value: response },
  });

  return response === null ? undefined : JSON.parse(response);
}

function set<T>(key: string, value: T, ttl: Duration): boolean {
  const json: string = JSON.stringify(value);
  const ttlInSeconds: number = ttl.as("seconds");
  const setRes: boolean = redisClient.set(key, json, "EX", ttlInSeconds);

  logger.log({
    level: "debug",
    message: "Set a new cache value",
    context: {
      key: key,
      value: value,
      ttl: {
        seconds: ttlInSeconds,
        object: ttl.toObject(),
      },
    },
    setRes: setRes,
  });

  return setRes;
}

export { redisClient, getAsync, set };
