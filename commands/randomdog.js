const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomdog')
        .setDescription('🐶 Receive a random dog image'),
    async execute(interaction) {
        const response = await axios.get(`https://api.thedogapi.com/v1/images/search`, {headers: { 'X-API-KEY': 'a1207441-90d4-4d90-b3d7-18c78a7f81f7'}})
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`🐶 Random Dog`);
        embed.setImage(response.data[0].url);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};