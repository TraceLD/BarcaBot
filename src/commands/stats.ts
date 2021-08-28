import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { getPlayerStatsPlot } from "../api/endpoints/charts/player-stats";
import playersApi, { ICombinedPlayer } from "../api/endpoints/players";
import { sanitiseAccents } from "../utils/string-utils";
import { getErrorEmbed } from "../embeds/error-embeds";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("player1").setDescription("Name of the first player").setRequired(true),
    )
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("player2").setDescription("Name of the second player").setRequired(false),
    )
    .setDescription("Shows statistics chart for given player(s)."),

  execute: async (i: CommandInteraction) => {
    const player2: string | null = i.options.getString("player2", false);
    const playerNames: string[] = !player2
      ? [i.options.getString("player1", true)]
      : [i.options.getString("player1", true), player2];

    const players = await playersApi.get();
    let matchedPlayers: ICombinedPlayer[] = [];

    for (const n of playerNames) {
      const matchedPlayer: ICombinedPlayer | undefined = players.find((p) =>
        sanitiseAccents(p.player.name.toLowerCase()).includes(n.toLowerCase()),
      );

      if (!matchedPlayer) {
        const notFoundEmbed = getErrorEmbed(
          ":x: Player not found",
          `Could not find a FC Barcelona player with name \`${n}\`.`,
        );

        i.reply({ embeds: [notFoundEmbed] });
        return;
      }

      matchedPlayers = [...matchedPlayers, matchedPlayer];
    }

    const chart: Buffer = await getPlayerStatsPlot(matchedPlayers);

    await i.reply({ files: [chart] });
  },
};

export default command;
