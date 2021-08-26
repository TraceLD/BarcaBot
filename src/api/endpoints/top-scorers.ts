import { Duration } from "luxon";
import { getWithCache } from "../cached-requests";
import { IPlayer } from "./players";
import { apiFootballSeason } from "../../config.json";

export default {
  ttl: Duration.fromObject({ days: 1 }),
  async get(leagueId: number): Promise<IPlayer[]> {
    return await getWithCache<IPlayer[]>(
      `players/topscorers?season=${apiFootballSeason}&league=${leagueId}`,
      this.ttl,
    );
  },
};
