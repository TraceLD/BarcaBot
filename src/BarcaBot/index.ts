import { Intents, Interaction } from "discord.js";
import { SlashCommandsClient } from "./client";
import { Command } from "./commandsFramework";
import { token, clientId, developmentGuildId } from "./config.json";

console.log(`Environment: ${process.env.NODE_ENV}`);

const client: SlashCommandsClient = new SlashCommandsClient({
  intents: [Intents.FLAGS.GUILDS],
});

client.setUpCommands(token, clientId, developmentGuildId);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand() || client.commands === undefined || !client.commands.has(interaction.commandName)) {
    return;
  }

  try {
    const command: Command | undefined = client.commands.get(interaction.commandName);

    if (command === undefined) {
      return interaction.reply({ content: "Could not find a matching command." });
    }

    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(token);
