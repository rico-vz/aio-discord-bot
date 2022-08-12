const { SlashCommandBuilder } = require('@discordjs/builders');
const {RepeatMode} = require("discord-music-player");
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🎵 Loops current song'),
    async execute(interaction) {
        const player = require("../bot");
        let guildQueue = player.getQueue(interaction.guildId);
        guildQueue.setRepeatMode(RepeatMode.SONG);
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`Music was looped`)
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};