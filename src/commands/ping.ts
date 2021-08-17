import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { SlashCommand } from "../slashCommand";
import { getAsync, set } from "../data/redis";

interface ITest {
  name: string;
  msg: string;
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName("test").setDescription("Tests options").setRequired(true),
    )
    .setDescription("Replies with pong"),
  execute: async (interaction: CommandInteraction) => {
    const test: ITest = {
      name: "Trace",
      msg: "Hello",
    };

    if (interaction.options.getString("test", true) === "c") {
      set<ITest>("ping", test, 60);
    }

    const value = await getAsync<ITest>("ping");

    if (value === undefined) {
      await interaction.reply("not cached");
    } else {
      await interaction.reply(`[${value.name}]: ${value.msg}`);
    }
  },
};

export default command;
