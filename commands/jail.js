const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jail')
        .setDescription('⛓️ Send someones profile pic to jail')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User you want to jail")
                .setRequired(true);
        }),
    async execute(interaction) {
        let user = interaction.options.getUser("user");
        let pfp = user.displayAvatarURL({format: "png", size: 1024});
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`⛓ ${user.username} got jailed`);
        embed.setImage(`https://some-random-api.ml/canvas/jail?avatar=${pfp}`);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};