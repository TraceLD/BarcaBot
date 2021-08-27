import { MessageEmbed } from "discord.js";
import { barcaLogo } from "../api/api-football";

export function getErrorEmbed(errorName: string, errorMsg: string): MessageEmbed {
  return new MessageEmbed()
    .setTitle(`:x: ${errorName}.`)
    .setDescription(errorMsg)
    .setColor("RED")
    .setThumbnail(barcaLogo)
    .setTimestamp();
}

export function jsErrorToEmbed(err: Error): MessageEmbed {
  return getErrorEmbed(err.name, err.message);
}
