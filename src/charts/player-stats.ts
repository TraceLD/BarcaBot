import { ICombinedPlayer } from "../api/endpoints/players";
import { StatsConverter } from "../utils/stats-converter";
import { defaultLayout, getPlot } from "./plotly";

export async function getPlayerStatsPlot(players: ICombinedPlayer[]): Promise<ArrayBuffer> {
  const chart = {
    figure: {
      data: [] as any[],
      layout: defaultLayout,
    },
    height: 500,
    width: 1000,
  };
  const x = [
    "Shots",
    "Shots on Target",
    "Key Passes",
    "Tackles",
    "Blocks",
    "Interceptions",
    "Duels Won",
    "Dribbles Attempted",
    "Dribbles Won",
    "Fouls Drawn",
    "Fouls Committed",
  ];

  for (const p of players) {
    const stats = p.statistics;

    if (!stats) {
      throw new Error(`No statistics found for player ${p.player.name}`);
    }

    const converter = new StatsConverter(stats.games.minutes);
    const y = [
      converter.toPer90(stats.shots.total),
      converter.toPer90(stats.shots.on),
      converter.toPer90(stats.passes.key),
      converter.toPer90(stats.tackles.total),
      converter.toPer90(stats.tackles.blocks ?? 0),
      converter.toPer90(stats.tackles.interceptions ?? 0),
      converter.toPer90(stats.duels.won),
      converter.toPer90(stats.dribbles.attempts),
      converter.toPer90(stats.dribbles.success),
      converter.toPer90(stats.fouls.drawn),
      converter.toPer90(stats.fouls.committed),
    ];
    const trace = {
      type: "bar",
      x: x,
      y: y,
      name: p.player.name,
    };

    chart.figure.data.push(trace);
  }

  if (players.length === 1) {
    chart.figure.layout.title.text = `${players[0].player.name} per 90 statistics`;
    chart.figure.layout.showLegend = false;
  } else {
    chart.figure.layout.title.text = "Per 90 statistics comparison";
    chart.figure.layout.showLegend = true;
  }

  return await getPlot(chart);
}
