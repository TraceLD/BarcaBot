import { CommandInteraction, Formatters, MessageEmbed } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { SlashCommand } from "../slashCommand";
import matchesApi, { IMatch } from "../api/endpoints/matches";
import { match } from "ts-pattern";
import { ids, barcaLogo, ITeam } from "../api/api-football";

const getMatchDescription = function (match: IMatch): string {
  const stadium: string =
    match.fixture.venue.name === null || match.fixture.venue.name === undefined
      ? "Unknown"
      : `${match.fixture.venue.name}, ${match.fixture.venue.city}`;
  const date = Formatters.time(match.fixture.timestamp, "F");
  return `:trophy: ${match.league.name} (${match.league.round})\n:stadium: ${stadium} \n:clock1: ${date}`;
};
const getResultEmoji = function (match: IMatch): string {
  const winner: ITeam & {
    winner: boolean;
  } = match.teams.home.winner ? match.teams.home : match.teams.away;
  const isBarcaWin: boolean = winner.id === ids.barca;

  return isBarcaWin ? ":regional_indicator_w:" : ":regional_indicator_l:";
};
const getHomeOrAwayEmoji = function (match: IMatch): string {
  const isHome: boolean = match.teams.home.id === ids.barca;

  return isHome ? ":house:" : ":airplane:";
};
const getLast = async function (): Promise<MessageEmbed> {
  const res: IMatch[] = await matchesApi.getLastWithCache();
  const embed = new MessageEmbed()
    .setTitle("Last FC Barcelona matches")
    .setColor("DARK_PURPLE")
    .setThumbnail(barcaLogo)
    .setTimestamp()
    .setFooter(
      `This statistic updates every ${matchesApi.ttl.as("days").toLocaleString()} day(s).`,
    );

  if (res.length === 0) {
    return embed.setDescription("No matches found.");
  }

  for (const matchObj of res) {
    const emoji: string = getResultEmoji(matchObj);
    const title = `${emoji} ${matchObj.teams.home.name} ${matchObj.goals.home}-${matchObj.goals.away} ${matchObj.teams.away.name}`;
    const desc: string = getMatchDescription(matchObj);

    embed.addField(title, desc, false);
  }

  return embed;
};
const getUpcoming = async function (): Promise<MessageEmbed> {
  const res: IMatch[] = await matchesApi.getUpcomingWithCache();
  const embed = new MessageEmbed()
    .setTitle("Upcoming FC Barcelona matches")
    .setColor("DARK_PURPLE")
    .setThumbnail(barcaLogo)
    .setTimestamp()
    .setFooter(
      `This statistic updates every ${matchesApi.ttl.as("days").toLocaleString()} day(s).`,
    );

  if (res.length === 0) {
    return embed.setDescription("No matches found.");
  }

  for (const matchObj of res) {
    const emoji = getHomeOrAwayEmoji(matchObj);
    const title = `${emoji} ${matchObj.teams.home.name} - ${matchObj.teams.away.name}`;
    const desc: string = getMatchDescription(matchObj);

    embed.addField(title, desc, false);
  }

  return embed;
};

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("matches")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("type")
        .setDescription("Matches type")
        .addChoice("Last", "last")
        .addChoice("Upcoming", "upcoming")
        .setRequired(true),
    )
    .setDescription("Shows FC Barcelona matches"),

  execute: async (i: CommandInteraction) => {
    const selectedMode: string = i.options.getString("type", true);
    const embedPromise: Promise<MessageEmbed> = match(selectedMode)
      .with("last", async () => await getLast())
      .with("upcoming", async () => await getUpcoming())
      .otherwise(() => {
        throw new Error("Input out of range.");
      });
    const embed = await embedPromise;

    await i.reply({ embeds: [embed] });
  },
};

export default command;
