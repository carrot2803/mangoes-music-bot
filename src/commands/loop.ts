import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { bot } from "../index";
import { i18n } from "../basics/i18n";
import { canModifyQueue } from "../basics/queue";

export default {
    data: new SlashCommandBuilder().setName("loop").setDescription(i18n.__("loop.description")),

    execute(interaction: ChatInputCommandInteraction) {
        const queue = bot.queues.get(interaction.guild!.id);
        const guildMember = interaction.guild!.members.cache.get(interaction.user.id);

        if (!queue) return interaction.reply({ content: i18n.__("loop.errorNotQueue"), ephemeral: true }).catch(console.error);
        if (!guildMember || !canModifyQueue(guildMember)) return i18n.__("common.errorNotChannel");
        queue.loop = !queue.loop;

        const content = {
            content: i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })
        };

        if (interaction.replied) interaction.followUp(content).catch(console.error);
        else interaction.reply(content).catch(console.error);

    }
}