const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomfox')
        .setDescription('🦊 Receive a random fox image'),
    async execute(interaction) {
        const response = await axios.get(`https://randomfox.ca/floof/`, {headers: { 'User-Agent': 'Discord:node.miubot:v1'}})
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`🦊 Random Fox`);
        embed.setImage(response.data.image);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};