import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { getPlayerStatsPlot } from "../charts/player-stats";
import playersApi, { ICombinedPlayer } from "../api/endpoints/players";
import stringUtils from "../utils/string-utils";
import { Readable } from "stream";

const toBuffer = function toBuffer(ab: ArrayBuffer): Buffer {
  const buf = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
};
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
        stringUtils.sanitiseAccents(p.player.name.toLowerCase()).includes(n.toLowerCase()),
      );

      if (!matchedPlayer) {
        const notFoundEmbed = new MessageEmbed()
          .setTitle(":x: Player not found")
          .setDescription(`Could not find a FC Barcelona player with name \`${name}\`.`)
          .setColor("RED")
          .setTimestamp()
          .setFooter(
            `This statistic updates every ${playersApi.ttl.as("days").toLocaleString()} day(s).`,
          );

        i.reply({ embeds: [notFoundEmbed] });
        return;
      }

      matchedPlayers = [...matchedPlayers, matchedPlayer];
    }

    const chart = await getPlayerStatsPlot(matchedPlayers);
    const stream = Readable.from(toBuffer(chart));

    await i.reply({ content: "Stats", files: [stream] });
  },
};

export default command;
