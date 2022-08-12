const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('♥️ Get an invite link for the bot'),
    async execute(interaction) {
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Miu - Invite`);
        embed.setDescription(`[Click here to invite me to your server](https://discord.com/oauth2/authorize?client_id=961971733043216435&permissions=2080374975&scope=bot%20applications.commands)`);
        embed.setImage(settings.botimage);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : true});
    },
};