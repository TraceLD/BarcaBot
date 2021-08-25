import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import players from "../api/endpoints/players";
import logger from "../logger";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("test").setDescription("Tests options").setRequired(true),
    )
    .setDescription("Replies with pong"),

  execute: async (interaction: CommandInteraction) => {
    const ps = await players.get();
    logger.debug(JSON.stringify(ps));
    await interaction.reply("Hi");
  },
};

export default command;
