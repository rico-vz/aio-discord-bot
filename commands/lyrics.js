const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('🎶 Search for lyrics by song name')
        .addStringOption(songname =>{
            return songname.setName("songname")
                .setDescription("Name of the song you'd like lyrics for")
                .setRequired(true);
        }),
    async execute(interaction) {
        let songname = interaction.options.getString("songname");
        try {
            const response = await axios.get(`https://some-random-api.ml/lyrics?title=${songname}`, {headers: { 'User-Agent': 'Discord:node.miubot:v1'}})
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Lyrics for ${response.data.title} by ${response.data.author}`);
            embed.setThumbnail(response.data.thumbnail.genius);
            embed.setDescription(response.data.lyrics);
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            return interaction.reply({embeds : [embed], ephemeral : false});
        } catch {
            interaction.reply({content: "<:invalid:969547043922116608> Sorry, I couldn't find any lyrics for that song", ephemeral: true});
        }

    },
};