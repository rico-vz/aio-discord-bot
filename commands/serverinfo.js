const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('📝 Shows server info'),
    async execute(interaction) {
        let guild = interaction.guild;
        let guildOwner = await guild.fetchOwner();
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Server info");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setThumbnail(guild.iconURL());
        embed.addField("Name", guild.name, true);
        embed.addField("ID", guild.id, true);
        embed.addField("Owner", `<@${guildOwner.user.id}>`, true);
        embed.addField("Created at", moment(guild.createdAt).format("dddd, MMMM Do YYYY"), true);
        embed.addField("Members", `${guild.memberCount}`, true);
        embed.addField("Channels", `${guild.channels.cache.size}`, true);
        embed.addField("Roles", `${guild.roles.cache.size}`, true);
        embed.addField("Emojis", `${guild.emojis.cache.size}`, true);
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};