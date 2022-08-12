const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const axios = require('axios');

const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolmmr')
        .setDescription('🎮 Check your LoL MMR')
        .addStringOption(region =>{
            return region.setName("region")
                .setDescription("NA, EUW, EUNE or KR")
                .setRequired(true)
        })
        .addStringOption(summName =>{
            return summName.setName("summonername")
                .setDescription("Your ingame name")
                .setRequired(true)
        }),
    async execute(interaction) {
        try {
            let region = interaction.options.getString("region");
            let summName = encodeURI(interaction.options.getString("summonername"));
            const response = await axios.get(`https://${region}.whatismymmr.com/api/v1/summoner?name=${summName}`, {headers: { 'User-Agent': 'Discord:node.miubot:v2'}})
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${summName}\'s MMR`);
            embed.addFields(
                { name: '<:Rift:969185317422780458> Normal', value: `<:avgMMR:969185359885918308> MMR: ${response.data.normal.avg || "Not enough data."} \n <:Challenger:969185225357791234> Closest rank: ${response.data.normal.closestRank || "Not enough data."}`},
                { name: '<:Rift:969185317422780458> Ranked', value: `<:avgMMR:969185359885918308> MMR: ${response.data.ranked.avg || "Not enough data."} \n <:Challenger:969185225357791234> Closest rank: ${response.data.ranked.closestRank || "Not enough data."}`},
                { name: '<:ARAM:969185276616400967> ARAM', value: `<:avgMMR:969185359885918308> MMR: ${response.data.ARAM.avg  || "Not enough data."}`},
            )
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            return interaction.reply({embeds : [embed], ephemeral : false});
        } catch (error) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Something went wrong!`);
            embed.setDescription(`Sorry, I couldn't get enough data to display the MMR from that account. \nPlease keep in mind that I only gather data from the last 30days and don't include DUOQUEUE games.`);
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            return interaction.reply({embeds : [embed], ephemeral : true});
        }

    },
};