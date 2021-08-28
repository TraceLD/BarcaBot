import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../slashCommand";
import { discordConfig } from "../config.json";
import { inviteLink } from "../helpers/invite-link";
import buttonEmojis from "../helpers/button-emojis";

const command: ISlashCommand = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Shows information about BarcaBot"),

  execute: async (interaction: CommandInteraction) => {
    const text = `<@${discordConfig.clientId}> is a FC Barcelona themed Discord bot created by <@303570168372789250>.`;
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Website")
        .setStyle("LINK")
        .setURL("https://traceld.github.io/BarcaBot/")
        .setEmoji(buttonEmojis.barcaLogo),
      new MessageButton()
        .setLabel("Invite BarcaBot to your server")
        .setStyle("LINK")
        .setURL(inviteLink)
        .setEmoji(buttonEmojis.discordLogo),
      new MessageButton()
        .setLabel("GitHub")
        .setStyle("LINK")
        .setURL("https://github.com/TraceLD/BarcaBot")
        .setEmoji(buttonEmojis.githubLogo),
    );

    await interaction.reply({ content: text, components: [row] });
  },
};

export default command;
