const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stopradio')
        .setDescription('📻 Stops radio'),
    async execute(interaction) {
        const radioPl = require("./radio");
        let pl = await radioPl.getPlayer();
        pl.stop();
        let rad = await radioPl.getRad();
        rad.disconnect();
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Radio was stopped");
        embed.setColor(settings.color);
        embed.setFooter(settings.footer)
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};