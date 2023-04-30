import { Client, GatewayIntentBits } from "discord.js";
import { Mango } from "./structs/Mango";

export const bot = new Mango(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages
        ]
    })
);
