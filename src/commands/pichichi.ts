import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { IPlayer } from "../api/endpoints/players";
import { barcaLogo, ids } from "../api/api-football";
import topScorersApi from "../api/endpoints/top-scorers";
import { getFlagEmoji } from "../utils/country-codes";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("pichichi")
    .setDescription("Shows the Pichichi Trophy race (given to the top scorer of LaLiga)."),

  execute: async (i: CommandInteraction) => {
    const res: IPlayer[] = await topScorersApi.get(ids.laLiga);
    const embed = new MessageEmbed()
      .setTitle("Pichichi Trophy Race")
      .setDescription(
        "Shows the top scorers of LaLiga Santander. The top scorer at the end of the season will be awarded the Pichichi Trophy.",
      )
      .setColor("YELLOW")
      .setThumbnail(res[0].statistics[0].league.logo ?? barcaLogo)
      .setTimestamp()
      .setFooter(
        `This statistic updates every ${topScorersApi.ttl.as("days").toLocaleString()} day(s).`,
      );

    for (let i = 0; i < 5; i++) {
      const player = res[i].player;
      const laLigaStats = res[i].statistics[0];
      const title = `${i + 1}. ${player.firstname} ${player.lastname}, ${laLigaStats.goals.total}`;
      const emoji: string | undefined = getFlagEmoji(player.nationality);
      const desc = `${emoji ?? ""}, ${laLigaStats.team.name}`;

      embed.addField(title, desc);
    }

    await i.reply({ embeds: [embed] });
  },
};

export default command;
