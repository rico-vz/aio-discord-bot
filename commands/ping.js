const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('📈 Displays API latency in ms'),
    async execute(interaction) {
        const client = require("../bot")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Ping");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`API Latency is ${Math.round(interaction.client.ws.ping)}ms`);
        return interaction.reply({embeds : [embed]});
    },
};