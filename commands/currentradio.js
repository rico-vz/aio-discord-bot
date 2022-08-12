const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('currentradio')
        .setDescription('📻 Displays current radio'),
    async execute(interaction) {
        const radioPl = require("./radio.js");
        let streamRad = await radioPl.getStreamRad();
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Radio");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`Currently plays : ${streamRad.name}\nGenre : ${streamRad.genre}`);
        return interaction.reply({embeds : [embed], ephemeral : true});
    },
};