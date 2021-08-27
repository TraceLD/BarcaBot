import { Duration } from "luxon";
import { getWithCache } from "../cached-requests";
import { IPlayer } from "./players";
import { apiFootballConfig } from "../../config.json";

export default {
  ttl: Duration.fromObject({ days: 1 }),
  async get(leagueId: number): Promise<IPlayer[]> {
    return await getWithCache<IPlayer[]>(
      `players/topscorers?season=${apiFootballConfig.season}&league=${leagueId}`,
      this.ttl,
    );
  },
};
