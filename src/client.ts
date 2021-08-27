import fs from "fs";
import logger from "./logger";
import { Client, ClientOptions, Collection } from "discord.js";
import { ISlashCommand } from "./slashCommand";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";

export class SlashCommandsClient extends Client<boolean> {
  commands: Collection<string, ISlashCommand>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection<string, ISlashCommand>();
  }

  setUpCommands(token: string, clientId: string, developmentGuildId: string): void {
    const commandFiles: string[] = fs
      .readdirSync("./commands")
      .filter((file) => file.match(".[jt]s$"));
    let commandsJson: {
      name: string;
      description: string;
      options: APIApplicationCommandOption[];
    }[] = [];

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: ISlashCommand = require(`./commands/${file}`).default;

      this.commands.set(command.data.name, command);
      commandsJson = [...commandsJson, command.data.toJSON()];
    }

    const rest = new REST({ version: "9" }).setToken(token);

    (async () => {
      try {
        logger.info(`Detected ${commandsJson.length} slash command(s).`);
        logger.info("Started refreshing slash commands.");

        if (process.env.NODE_ENV === "DEVELOPMENT") {
          await rest.put(Routes.applicationGuildCommands(clientId, developmentGuildId), {
            body: commandsJson,
          });

          logger.log({
            level: "info",
            message: "Successfully reloaded development guild slash commands.",
            guildId: developmentGuildId,
          });
        } else {
          await rest.put(Routes.applicationCommands(clientId), { body: commandsJson });

          logger.info("Successfully reloaded global slash commands.");
        }
      } catch (error) {
        logger.error(error);
      }
    })();
  }
}
