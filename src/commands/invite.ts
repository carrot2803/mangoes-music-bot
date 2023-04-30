import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { i18n } from "../basics/i18n";

export default {
    data: new SlashCommandBuilder()
    .setName("invite").setDescription(i18n.__("invite.description")),
    execute(interaction: ChatInputCommandInteraction){
        const inviteEmbed = new EmbedBuilder().setTitle(i18n.__mf("Invite mangoes to your server"));

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel(i18n.__mf("Invite"))
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.com/api/oauth2/authorize?client_id=925900301565833219&permissions=40649771731008&scope=bot") // put url here later
          );
      
          return interaction.reply({ embeds: [inviteEmbed], components: [actionRow] }).catch(console.error);
    }
}