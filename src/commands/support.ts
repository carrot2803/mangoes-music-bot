import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { i18n } from "../basics/i18n";

export default {
    data: new SlashCommandBuilder()
    .setName("support").setDescription("Support Server"),
    execute(interaction: ChatInputCommandInteraction){
        const inviteEmbed = new EmbedBuilder().setTitle("Mangoes Support Server");

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel("Support")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.gg/TFEbHkCyT3") // put url here later
          );
      
          return interaction.reply({ embeds: [inviteEmbed], components: [actionRow] }).catch(console.error);
    }
}