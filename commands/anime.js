var Kitsu = require('kitsu');
var kitsu = new Kitsu();
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('🌸 Anime lookup')
        .addStringOption(animename => {
            return animename.setName("animename")
                .setDescription("Name of the anime (in English) you wanna look up")
                .setRequired(true)
        }),
    async execute(interaction) {
        let animeName = await interaction.options.getString("animename");
        let animeNameSan = encodeURI(animeName);

        try {
            let data = await kitsu.get('anime?filter[text]=' + animeNameSan + '&page[limit]=' + 2);
            let res = data.data[0];
            let replyData = {};
            replyData.url = sanitize(res.posterImage.original);
            replyData.title = sanitize(res.canonicalTitle);
            replyData.description = sanitize(res.synopsis);
            replyData.rating = sanitize(res.averageRating);
            replyData.age = sanitize(res.ageRatingGuide);
            replyData.chapters = sanitize(res.chapterCount);
            replyData.status = sanitize(res.status);
            replyData.startDate = sanitize(res.startDate);
            replyData.endDate = sanitize(res.endDate);
            replyData.popularityRank = sanitize(res.popularityRank);
            replyData.episodeCount = sanitize(res.episodeCount);

            if (replyData.age === "N/A") {
                replyData.age = "Not Rated";
            }

            if (replyData.age.includes("Nudity")) {
                throw new Error("Nudity");
            }

            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${replyData.title}`);
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`${replyData.description}`);
            embed.setThumbnail(`${replyData.url}`);
            embed.addField('Rating', `${replyData.rating}`, true);
            embed.addField('Age Rating', `${replyData.age}`, true);
            embed.addField('Status', `${replyData.status}`, true);
            embed.addField('Start Date', `${replyData.startDate}`, true);
            embed.addField('End Date', `${replyData.endDate}`, true);
            embed.addField('Popularity Rank', `${replyData.popularityRank}`, true);
            embed.addField('Episodes', `${replyData.episodeCount}`, true);
    
            return interaction.reply({embeds : [embed]});
        }
        catch(err) {
            if (err.message === "Nudity") {
                let embed = new Discord.MessageEmbed();
                embed.setTitle(`${animeName}`);
                embed.setColor(settings.color);
                embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
                embed.setDescription(`NSFW Anime can't be shown.`);
                return interaction.reply({embeds : [embed], ephemeral : true});
            }
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`${animeName}`);
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`No anime found with name ${animeName}`);
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
    },
};

function sanitize(value){
    return (value === null || value === "") ? "N/A" : String(value);
}