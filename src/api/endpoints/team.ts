import { ids, IGoalStatistics, IHATStatistics } from "../api-football";
import { getWithCache } from "../cached-requests";
import { apiFootballSeason } from "../../config.json";
import { Duration } from "luxon";

export interface ITeam {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  form: string;
  fixtures: {
    played: IHATStatistics;
    wins: IHATStatistics;
    draws: IHATStatistics;
    loses: IHATStatistics;
  };
  goals: {
    for: IGoalStatistics;
    against: IGoalStatistics;
  };
  clean_sheet: IHATStatistics;
}

export default {
  ttl: Duration.fromObject({ days: 1 }),
  async getWithCache(): Promise<ITeam> {
    return await getWithCache<ITeam>(
      `teams/statistics?league=${ids.laLiga}&team=${ids.barca}&season=${apiFootballSeason}`,
      this.ttl.as("seconds"),
    );
  },
};
