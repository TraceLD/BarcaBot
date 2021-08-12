import fs from "fs";
import { Client, Collection, Intents, Interaction } from "discord.js";
import { CommandsClient } from "./barcabot";
import { Command, registerCommands } from "./commandsFramework";
import { token } from "./config.json";

console.log(`Environment: ${process.env.NODE_ENV}`);

const client: CommandsClient = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

// set up commands;
client.commands = new Collection<string, Command>();

const commandFiles: string[] = fs.readdirSync("./commands").filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const command: Command = require(`./commands/${file}`).default;
  client.commands.set(command.data.name, command);
}

registerCommands(client.commands);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand() || client.commands === undefined || !client.commands.has(interaction.commandName)) {
    return;
  }

  try {
    const command: Command = client.commands.get(interaction.commandName);
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
  }
});

client.login(token);
