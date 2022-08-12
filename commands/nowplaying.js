const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('🎵 Displays current song'),
    async execute(interaction) {
        const player = require("../bot");
        let guildQueue = player.getQueue(interaction.guildId);
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        if(!guildQueue){
            embed.setDescription("No music is being played yet")
        }
        else if(guildQueue.songs.length === 0){
            embed.setDescription("No music is being played yet")
        }
        else{
            embed.setDescription(`Now playing: ${guildQueue.nowPlaying}`)
        }
        return interaction.reply({embeds : [embed], ephemeral : true});
    },
};