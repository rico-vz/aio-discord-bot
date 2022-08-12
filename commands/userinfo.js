const { SlashCommandBuilder, EmbedAssertions } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('📝 Shows user info')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User to show info about")
                .setRequired(true);
        }),
    async execute(interaction) {
        let user = interaction.options.getUser("user");
        let userFetch = await user.fetch(true);
        let pfp = user.displayAvatarURL({dynamic: true, size: 1024});
        let banner = user.bannerURL({dynamic: true, size:1024});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`${user.username}'s info`);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setThumbnail(`${pfp}`);
        embed.addField('Username', `${user.username}`, true);
        embed.addField('Tag', `${user.tag}`, true);
        embed.addField("ID", user.id, true);
        embed.addField("Banner", `[Click here](${banner}) to view in browser`, false);
        embed.addField("Avatar", `[Click here](${pfp}) to view in browser`, false);
        embed.addField("Created at", moment(user.createdAt).format("dddd, MMMM Do YYYY, h:mmA"), true);
        embed.addField("Joined at", moment(user.joinedAt).format("dddd, MMMM Do YYYY, h:mmA"), true);
        embed.addField("Bot?", `${user.bot}`, true);
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};