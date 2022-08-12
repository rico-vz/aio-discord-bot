const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('🎵 Displays current queue'),
    async execute(interaction) {
        const player = require("../bot");
        let guildQueue = player.getQueue(interaction.guildId);
        let text = 'Queue:\n';
        for(let i = 0; i < guildQueue.songs.length; i++){
            text += `${i+1}) ${guildQueue.songs[i].name}\n`
        }
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(text)
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};