import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../commandsFramework";

const command: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  },
};

export default command;
