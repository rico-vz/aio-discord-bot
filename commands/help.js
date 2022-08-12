const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📚 Get help with Miu'),
    async execute(interaction) {
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Miu - Help`);
        embed.addField(`📚 Commands`, `[Click here to see all commands](https://miubot.com/commands)`);
        embed.addField(`📚 Invite`, `[Click here to invite Miu to your server](https://discord.com/oauth2/authorize?client_id=961971733043216435&permissions=2080374975&scope=bot%20applications.commands)`);
        embed.addField(`📚 Vote`, `[Click here vote for Miu](https://miubot.com/vote)`);
        embed.addField(`📚 Website`, `[Click here to visit Miu's website](https://miubot.com)`);
        embed.addField(`📚 Discord`, `[Click here to join Miu's Discord Server](https://discord.gg/EWWrjExEn3)`)
        embed.setImage(settings.botimage);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : true});
    },
};