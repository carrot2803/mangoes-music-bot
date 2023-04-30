import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { i18n } from "../basics/i18n";
import { bot } from "../index";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription(i18n.__("mangoes help")),

    async execute(interaction: CommandInteraction) {
        let commands = bot.slashCommandsMap;

        let helpEmbed = new EmbedBuilder()
            .setTitle(i18n.__mf("help.embedTitle", { botname: interaction.client.user!.username }))
            .setDescription(i18n.__("help.embedDescription"))
            .setColor('Aqua');

        commands.forEach((cmd) => {
            helpEmbed.addFields({
                name: `**${cmd.data.name}**`,
                value: `${cmd.data.description}`,
                inline: true
            });
        });

        helpEmbed.setTimestamp()

        return interaction.reply({ embeds: [helpEmbed] }).catch(console.error);
    }
}