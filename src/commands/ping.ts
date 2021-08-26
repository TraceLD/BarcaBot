import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("test").setDescription("Tests options").setRequired(true),
    )
    .setDescription("Replies with pong"),

  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  },
};

export default command;
