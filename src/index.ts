import logger from "./logger";
import { Intents, Interaction } from "discord.js";
import { BarcaBotClient } from "./client";
import { ISlashCommand } from "./slashCommand";
import { discordConfig } from "./config.json";
import { jsErrorToEmbed } from "./embeds/error-embeds";

logger.log({ level: "info", message: "Environment", environment: process.env.NODE_ENV });

const client = new BarcaBotClient({
  intents: [Intents.FLAGS.GUILDS],
});

client.setUpCommands(discordConfig.token, discordConfig.clientId, discordConfig.developmentGuildId);

client.once("ready", () => {
  logger.info("Bot ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (
    !interaction.isCommand() ||
    !client.commands ||
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

    if (!command) {
      scopedLogger.error("Could not find a matching command");
      return interaction.reply({ content: "Could not find a matching command." });
    }

    await command.execute(interaction);
  } catch (err) {
    scopedLogger.error(err);

    return interaction.reply({
      embeds: [jsErrorToEmbed(err)],
    });
  }
});

client.login(discordConfig.token);
