import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { inviteLink } from "../helpers/invite-link";
import buttonEmojis from "../helpers/button-emojis";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Shows an invite link for BarcaBot"),

  execute: async (interaction: CommandInteraction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite BarcaBot to your server")
        .setStyle("LINK")
        .setURL(inviteLink)
        .setEmoji(buttonEmojis.discordLogo),
    );

    await interaction.reply({ content: ".", components: [row] });
  },
};

export default command;
