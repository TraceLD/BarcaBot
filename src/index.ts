import logger from "./logger";
import { Intents, Interaction } from "discord.js";
import { SlashCommandsClient } from "./client";
import { ISlashCommand } from "./slashCommand";
import { token, clientId, developmentGuildId } from "./config.json";

logger.log({ level: "info", message: "Environment", environment: process.env.NODE_ENV });

const client = new SlashCommandsClient({
  intents: [Intents.FLAGS.GUILDS],
});

client.setUpCommands(token, clientId, developmentGuildId);

client.once("ready", () => {
  logger.info("Bot ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (
    !interaction.isCommand() ||
    client.commands === undefined ||
    !client.commands.has(interaction.commandName)
  ) {
    return;
  }

  const scopedLogger = logger.child({
    interactionId: interaction.id,
    commandId: interaction.commandId,
    commandName: interaction.commandName,
  });

  try {
    const command: ISlashCommand | undefined = client.commands.get(interaction.commandName);

    if (command === undefined) {
      scopedLogger.error("Could not find a matching command");
      return interaction.reply({ content: "Could not find a matching command." });
    }

    await command.execute(interaction);
  } catch (error) {
    scopedLogger.error(error);

    return interaction.reply({
      content: "There was an error while executing this command!",
    });
  }
});

client.login(token);
