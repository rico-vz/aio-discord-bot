const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('🌸 Pat someone :3')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User you want to headpat")
                .setRequired(true);
        }),
    async execute(interaction) {
        const response = await axios.get(`https://some-random-api.ml/animu/pat`, {headers: { 'User-Agent': 'Discord:node.miubot:v1'}})
        let user = interaction.options.getUser("user");
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`${interaction.user.username} patted ${user.username}`);
        embed.setImage(response.data.link);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};