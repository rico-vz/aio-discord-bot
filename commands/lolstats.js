const { SlashCommandBuilder } = require('@discordjs/builders');
const opggScraper = require('opgg-scraper');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lolstats')
        .setDescription('🎮 Check a players LoL stats')
        .addStringOption(region =>{
            return region.setName("region")
                .setDescription("All major regions work apart from Garena")
                .setRequired(true)
        })
        .addStringOption(summName =>{
            return summName.setName("summonername")
                .setDescription("The ingame name")
                .setRequired(true)
        }),
    async execute(interaction) {
        let region = interaction.options.getString("region");
        let summName = encodeURI(interaction.options.getString("summonername"));
        interaction.reply("<a:loading_purple:969186378590060614> Fetching stats, this might take a bit...");
        try {
            await opggScraper.getStats(`${summName}`, `${region}`, false).
            then(stats => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(`${summName}\'s Statistics`);
                embed.setThumbnail(`${stats.ProfilePic}`);
                embed.addFields(
                    { name: 'Name', value: `${stats.Name}`, inline: true},
                    { name: 'Level', value: `${stats.Level}`, inline: true},
                    { name: 'Rank', value: `${stats.Rank}`, inline: true},
                    { name: 'KDA', value: `${stats.KDA}`, inline: true},
                    { name: 'Main Lane', value: `${stats.MainLane}`, inline: true},
                    { name: 'Main Champ', value: `${stats.MainChampion}`, inline: true},
                )
                embed.setColor(settings.color);
                embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
                return interaction.editReply({content:"  ", embeds : [embed], ephemeral : false});
            })
        } catch {
            return interaction.editReply({content:"<:invalid:969547043922116608> Something went wrong. Make sure the Region & Summoner Name are correct.", ephemeral : false});
        }


    },
};