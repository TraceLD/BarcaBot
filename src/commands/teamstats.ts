import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../slashCommand";
import team, { ITeam } from "../api/endpoints/team";

const teamstats: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("teamstats")
    .setDescription("Shows FC Barcelona statistics"),

  execute: async (i: CommandInteraction) => {
    const res: ITeam = await team.getWithCache();
    const embed: MessageEmbed = new MessageEmbed()
      .setTitle(`FCB Team Statistics | ${res.league.name}`)
      .setDescription(`FC Barcelona statistics in ${res.league.name}`)
      .setColor("DARK_PURPLE")
      .setThumbnail(res.team.logo)
      .setTimestamp()
      .setFooter(`This statistic updates every ${team.ttl.as("days").toLocaleString()} day(s).`)
      .addField("Form", res.form, false)
      .addField(
        "Fixtures",
        `Played: ${res.fixtures.played.total}\nWins: ${res.fixtures.wins.total}\nDraws: ${res.fixtures.draws.total}\nLosses: ${res.fixtures.loses.total}`,
        false,
      )
      .addField(
        "Goals scored",
        `${res.goals.for.total.total} (avg. ${res.goals.for.average.total} per game)`,
        false,
      )
      .addField(
        "Goals conceded",
        `${res.goals.against.total.total} (avg. ${res.goals.against.average.total} per game)`,
        false,
      )
      .addField("Clean sheets", res.clean_sheet.total.toString(), false);

    await i.reply({ embeds: [embed] });
  },
};

export default teamstats;
