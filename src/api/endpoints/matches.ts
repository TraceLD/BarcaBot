import { Duration } from "luxon";
import { ids, IHATStatistics, ILeague, ITeam } from "../api-football";
import { getWithCache } from "../cached-requests";
import { apiFootballConfig } from "../../config.json";

export interface IMatch {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number;
      second: number;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number;
    };
  };
  league: ILeague & {
    round: string;
  };
  teams: {
    home: ITeam & {
      winner: boolean;
    };
    away: ITeam & {
      winner: boolean;
    };
  };
  goals: Omit<IHATStatistics, "total">;
}

export default {
  ttl: Duration.fromObject({ days: 1 }),
  async getLastWithCache(): Promise<IMatch[]> {
    return await getWithCache<IMatch[]>(
      `fixtures?team=${ids.barca}&season=${apiFootballConfig.season}&last=5`,
      this.ttl,
    );
  },
  async getUpcomingWithCache(): Promise<IMatch[]> {
    return await getWithCache<IMatch[]>(
      `fixtures?team=${ids.barca}&season=${apiFootballConfig.season}&next=5`,
      this.ttl,
    );
  },
};
