import { Client, Collection, Intents } from "discord.js";
import { token } from "./config.json";

const client: Client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.login(token);
