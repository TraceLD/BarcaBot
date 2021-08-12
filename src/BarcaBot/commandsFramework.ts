import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";
import { token, clientId, developmentGuildId } from "./config.json";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export function registerCommands(commands: Collection<string, Command>): void {
  const rest = new REST({ version: "9" }).setToken(token);
  const commandsJson = commands.map((cmd: Command) => cmd.data.toJSON());

  (async () => {
    try {
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
