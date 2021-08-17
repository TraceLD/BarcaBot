import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { SlashCommand } from "../slashCommand";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("test").setDescription("Tests options").setRequired(true),
    )
    .setDescription("Replies with pong"),

  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Hi");
  },
};

export default command;
