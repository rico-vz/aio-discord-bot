const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcat')
        .setDescription('🐱 Receive a random cat image'),
    async execute(interaction) {
        const response = await axios.get(`https://api.thecatapi.com/v1/images/search`, {headers: { 'X-API-KEY': '5ba83359-9ca8-4bbb-931a-13b776a02ebc'}})

        let embed = new Discord.MessageEmbed();
        embed.setTitle(`🐈 Random Cat`);
        embed.setImage(response.data[0].url);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};