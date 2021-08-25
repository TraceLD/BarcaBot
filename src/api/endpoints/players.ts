import { Duration } from "luxon";
import { ids, ILeague, ITeam } from "../api-football";
import { getPagedWithCache } from "../cached-requests";
import { apiFootballSeason } from "../../config.json";
import Enumerable from "linq";

export type ICombinedPlayer = Omit<IPlayer, "statistics"> & {
  statistics?: Omit<IPlayerStatistics, "league">;
};

export interface IPlayerStatistics {
  team: ITeam;
  league: ILeague;
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    number?: number;
    position: "Attacker" | "Midfielder" | "Defender" | "Goalkeeper";
    rating?: string;
    captain: boolean;
  };
  substitutes: {
    in: number;
    out: number;
    bench: number;
  };
  shots: {
    total: number;
    on: number;
  };
  goals: {
    total: number;
    conceded: number;
    assists: number;
    saves?: number;
  };
  passes: {
    total: number;
    key: number;
    accuracy: number;
  };
  tackles: {
    total: number;
    blocks?: number;
    interceptions?: number;
  };
  duels: {
    total: number;
    won: number;
  };
  dribbles: {
    attempts: number;
    success: number;
  };
  fouls: {
    drawn: number;
    committed: number;
  };
  cards: {
    yellow: number;
    yellowred: number;
    red: number;
  };
}

export interface IPlayer {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string;
      country: string;
    };
    nationality: string;
    height: string;
    weight: string;
    injured: boolean;
    photo?: string;
  };
  statistics: IPlayerStatistics[];
}

export default {
  ttl: Duration.fromObject({ days: 1 }),
  async get(): Promise<ICombinedPlayer[]> {
    const data: IPlayer[] = await getPagedWithCache<IPlayer>(
      `players?team=${ids.barca}&season=${apiFootballSeason}`,
      true,
      this.ttl,
    );
    let combinedPlayers: ICombinedPlayer[] = [];

    for (const player of data) {
      const newStatistics: Omit<IPlayerStatistics, "league"> | undefined = Enumerable.from(
        player.statistics,
      )
        .where((s) => s.league.id !== null)
        .groupBy(() => 1)
        .select(
          (
            g: Enumerable.IGrouping<number, IPlayerStatistics>,
          ): Omit<IPlayerStatistics, "league"> => {
            return {
              team: g.first().team,
              games: {
                appearences: g.sum((p) => p.games.appearences),
                lineups: g.sum((p) => p.games.lineups),
                minutes: g.sum((p) => p.games.minutes),
                number: g.first().games.number,
                position: g.first().games.position,
                rating: g.firstOrDefault((e) => e.league.id === ids.laLiga)?.games.rating,
                captain: g.first().games.captain,
              },
              substitutes: {
                in: g.sum((p) => p.substitutes.in),
                out: g.sum((p) => p.substitutes.out),
                bench: g.sum((p) => p.substitutes.bench),
              },
              shots: {
                total: g.sum((p) => p.shots.total),
                on: g.sum((p) => p.shots.on),
              },
              goals: {
                total: g.sum((p) => p.goals.total),
                conceded: g.sum((p) => p.goals.conceded),
                assists: g.sum((p) => p.goals.assists),
                saves: g.sum((p) => p.goals.saves ?? 0),
              },
              passes: {
                total: g.sum((p) => p.passes.total),
                key: g.sum((p) => p.passes.key),
                accuracy: g.average((p) => p.passes.accuracy),
              },
              tackles: {
                total: g.sum((p) => p.tackles.total),
                blocks: g.sum((p) => p.tackles.blocks ?? 0),
                interceptions: g.sum((p) => p.tackles.interceptions ?? 0),
              },
              duels: {
                total: g.sum((p) => p.duels.total),
                won: g.sum((p) => p.duels.won),
              },
              dribbles: {
                attempts: g.sum((p) => p.dribbles.attempts),
                success: g.sum((p) => p.dribbles.success),
              },
              fouls: {
                drawn: g.sum((p) => p.fouls.drawn),
                committed: g.sum((p) => p.fouls.committed),
              },
              cards: {
                yellow: g.sum((p) => p.cards.yellow),
                yellowred: g.sum((p) => p.cards.yellowred),
                red: g.sum((p) => p.cards.red),
              },
            };
          },
        )
        .firstOrDefault();

      const combinedPlayer: ICombinedPlayer = {
        player: {
          age: player.player.age,
          birth: player.player.birth,
          firstname: player.player.firstname,
          height: player.player.height,
          id: player.player.id,
          injured: player.player.injured,
          lastname: player.player.lastname,
          name: player.player.name,
          nationality: player.player.nationality,
          photo: player.player.photo,
          weight: player.player.weight,
        },
        statistics: newStatistics,
      };

      combinedPlayers = [...combinedPlayers, combinedPlayer];
    }

    return combinedPlayers;
  },
};
