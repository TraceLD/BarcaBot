import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { SlashCommand } from "../slashCommand";
import { match } from "ts-pattern";
import { StatsConverter } from "../utils/stats-converter";
import playersApi, { ICombinedPlayer } from "../api/endpoints/players";
import stringUtils from "../utils/string-utils";
import { barcaLogo } from "../api/api-football";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("player")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("name").setDescription("Name of the player").setRequired(true),
    )
    .setDescription("Shows information and statistics for a FCB player"),

  execute: async (i: CommandInteraction) => {
    const name = i.options.getString("name", true);
    const players = await playersApi.get();
    const matchedPlayer: ICombinedPlayer | undefined = players.find((p) =>
      stringUtils.sanitiseAccents(p.player.name.toLowerCase()).includes(name.toLowerCase()),
    );

    if (matchedPlayer === undefined) {
      const notFoundEmbed = new MessageEmbed()
        .setTitle(":x: Player not found")
        .setDescription(`Could not find a FC Barcelona player with name \`${name}\``)
        .setColor("RED")
        .setTimestamp()
        .setFooter(
          `This statistic updates every ${playersApi.ttl.as("days").toLocaleString()} day(s).`,
        );

      i.reply({ embeds: [notFoundEmbed] });
      return;
    }

    if (matchedPlayer.statistics === undefined) {
      const noStatsEmbed = new MessageEmbed()
        .setTitle(":x: Statistics not found")
        .setDescription(
          `Could not find statistics for the matched FC Barcelona player - \`${matchedPlayer.player.name}\``,
        )
        .setColor("RED")
        .setThumbnail(matchedPlayer.player.photo ?? barcaLogo)
        .setTimestamp()
        .setFooter(
          `This statistic updates every ${playersApi.ttl.as("days").toLocaleString()} day(s).`,
        );

      i.reply({ embeds: [noStatsEmbed] });
      return;
    }

    const stats = matchedPlayer.statistics;
    const converter = new StatsConverter(matchedPlayer.statistics.games.minutes);
    let embed = new MessageEmbed()
      .setTitle(matchedPlayer.player.name)
      .setDescription(
        `Position: ${stats.games.position}\nAge: ${matchedPlayer.player.age}\nHeight: ${matchedPlayer.player.height}\nWeight: ${matchedPlayer.player.weight}`,
      )
      .setColor("DARK_PURPLE")
      .setThumbnail(matchedPlayer.player.photo ?? barcaLogo)
      .setTimestamp()
      .setFooter(
        `This statistic updates every ${playersApi.ttl.as("days").toLocaleString()} day(s).`,
      )
      .addField("Games played", stats.games.appearences.toString(), true)
      .addField("Goals", stats.goals.total.toString(), true)
      .addField(
        "Rating",
        stats.games.rating !== undefined ? (+stats.games.rating).toFixed(2).toString() : "N/A",
        true,
      );

    const addShots = function (e: MessageEmbed): MessageEmbed {
      const total = converter.toPer90(stats.shots.total);
      const onTarget = converter.toPer90(stats.shots.on);
      const percentOnTarget = (onTarget / total) * 100;

      return e.addField(
        "Shots per 90 minutes",
        `Total: ${total.toFixed(2)}, On target: ${onTarget.toFixed(2)} (${percentOnTarget.toFixed(
          2,
        )}%)`,
      );
    };
    const addPasses = function (e: MessageEmbed): MessageEmbed {
      const total = converter.toPer90(stats.passes.total);
      const key = converter.toPer90(stats.passes.key);

      return e.addField(
        "Passes per 90 minutes",
        `Total: ${total.toFixed(2)}, Key passes: ${key.toFixed(2)}`,
      );
    };
    const addDribbles = function (e: MessageEmbed): MessageEmbed {
      const attempted = converter.toPer90(stats.dribbles.attempts);
      const successful = converter.toPer90(stats.dribbles.success);
      const percentageSuccessful = (successful / attempted) * 100;

      return e.addField(
        "Dribbles per 90 minutes",
        `Attempted: ${attempted.toFixed(2)}, Successful: ${successful.toFixed(
          2,
        )} (${percentageSuccessful.toFixed(2)}%)`,
      );
    };
    const addTackles = function (e: MessageEmbed): MessageEmbed {
      const tackles = converter.toPer90(stats.tackles.total);
      const interceptions = converter.toPer90(stats.tackles.interceptions ?? 0);
      const blocks = converter.toPer90(stats.tackles.blocks ?? 0);

      return e.addField(
        "Tackles per 90 minutes",
        `Tackles: ${tackles.toFixed(2)}, Interceptions: ${interceptions.toFixed(
          2,
        )}, Blocks: ${blocks.toFixed(2)}`,
      );
    };
    const addGoalsConceded = function (e: MessageEmbed): MessageEmbed {
      return e.addField("Goals conceded", stats.goals.conceded.toLocaleString());
    };

    embed = match(matchedPlayer.statistics.games.position)
      .with("Attacker", (): MessageEmbed => {
        let e = addShots(embed);
        e = addPasses(e);
        e = addDribbles(e);
        return e;
      })
      .with("Midfielder", (): MessageEmbed => {
        let e = addPasses(embed);
        e = addDribbles(e);
        e = addTackles(e);
        return e;
      })
      .with("Defender", (): MessageEmbed => {
        let e = addTackles(embed);
        e = addPasses(e);
        return e;
      })
      .with("Goalkeeper", (): MessageEmbed => {
        let e = addGoalsConceded(embed);
        e = addPasses(e);
        return e;
      })
      .otherwise(() => {
        throw new Error("Position out of range");
      });

    await i.reply({ embeds: [embed] });
    return;
  },
};

export default command;
