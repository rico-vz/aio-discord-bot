const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('📒 Displays avatar of any user')
        .addUserOption(user => {
            return user.setName("user")
                .setDescription("user whose avatar you need")
                .setRequired(true)
        }),
    async execute(interaction) {
        let user = await interaction.options.getUser("user");
        let pfp = user.displayAvatarURL({dynamic: true, size: 1024});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`${user.username}\'s avatar`);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.addField('Avatar', `[Click here](${pfp}) to view in browser`, false);
        embed.setImage(`${pfp}`);
        return interaction.reply({embeds : [embed]});
    },
};