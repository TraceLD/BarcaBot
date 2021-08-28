import { ids, IGoalStatistics, IHATStatistics, ILeague, ITeam } from "../api-football";
import { getWithCache } from "../cached-requests";
import { apiFootballConfig } from "../../config.json";
import { Duration } from "luxon";

export interface ITeamStatistics {
  league: ILeague;
  team: ITeam;
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
  async getWithCache(): Promise<ITeamStatistics> {
    return await getWithCache<ITeamStatistics>(
      `teams/statistics?league=${ids.laLiga}&team=${ids.barca}&season=${apiFootballConfig.season}`,
      this.ttl,
    );
  },
};
