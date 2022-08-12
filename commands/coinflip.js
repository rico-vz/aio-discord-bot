const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('💲 Heads or tails?'),
    async execute(interaction) {
        let rand = Math.floor(Math.random() * 2);
        let win;
        if(rand === 0) win = "Head";
        else win = "Tails"
        let embed = new Discord.MessageEmbed();
        embed.setTitle(win);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed]});
    },
};