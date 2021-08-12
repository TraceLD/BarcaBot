import fs from "fs";
import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "./commandsFramework";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";

export class SlashCommandsClient extends Client<boolean> {
  commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection<string, Command>();
  }

  setUpCommands(token: string, clientId: string, developmentGuildId: string): void {
    const commandFiles: string[] = fs.readdirSync("./commands").filter((file) => file.endsWith(".ts"));
    let commandsJson: {
      name: string;
      description: string;
      options: APIApplicationCommandOption[];
    }[] = [];

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: Command = require(`./commands/${file}`).default;

      this.commands.set(command.data.name, command);
      commandsJson = [...commandsJson, command.data.toJSON()];
    }

    const rest = new REST({ version: "9" }).setToken(token);

    (async () => {
      try {
        console.log(`Detected ${commandsJson.length} slash command(s).`);
        console.log("Started refreshing slash commands.");

        if (process.env.NODE_ENV === "DEVELOPMENT") {
          await rest.put(Routes.applicationGuildCommands(clientId, developmentGuildId), { body: commandsJson });

          console.log(`Successfully reloaded ${developmentGuildId} guild slash commands.`);
        } else {
          await rest.put(Routes.applicationCommands(clientId), { body: commandsJson });

          console.log("Successfully reloaded global slash commands.");
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }
}
