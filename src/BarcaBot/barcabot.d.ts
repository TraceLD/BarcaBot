import { Client, Collection } from "discord.js";

type CommandsClient = Client & { commands?: Collection<string, Command> };
