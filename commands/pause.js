const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('🎵 Pauses current song'),
    async execute(interaction) {
        const player = require("../bot");
        let guildQueue = player.getQueue(interaction.guildId);
        guildQueue.setPaused(true);
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`Current song was paused`)
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};