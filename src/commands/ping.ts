import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";

const command: ISlashCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with pong"),

  execute: async (interaction: CommandInteraction) => {
    await interaction.reply("Pong!");
  },
};

export default command;
