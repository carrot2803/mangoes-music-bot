import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { i18n } from "../basics/i18n";

export default{
    data: new SlashCommandBuilder()
    .setName("check-ping").setDescription(i18n.__("ping.description")),
    cooldown: 10,
    execute(interaction: ChatInputCommandInteraction){
        interaction
        .reply({ content: i18n.__mf("ping.result", { ping: Math.round(interaction.client.ws.ping) }), ephemeral: true })
        .catch(console.error)
    }
};