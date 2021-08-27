import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { discordConfig } from "../config.json";

const command: ISlashCommand = {
  data: new SlashCommandBuilder().setName("invite").setDescription("Gives the bot's invite link."),

  execute: async (interaction: CommandInteraction) => {
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${discordConfig.clientId}&permissions=242666032192&scope=applications.commands%20bot`;

    await interaction.reply(
      `**Invite <@${discordConfig.clientId}> to your server:**\n${inviteLink}`,
    );
  },
};

export default command;
