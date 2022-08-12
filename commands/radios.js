const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

let radioStations = [
    {
        'name': 'listen-jpop',
        'url': 'https://listen.moe/fallback',
        'genre': 'JPOP'
    },
    {
        'name': 'listen-kpop',
        'url': 'https://listen.moe/kpop/fallback',
        'genre': 'KPOP'
    },
    {
        'name': 'plaza-one',
        'url': 'http://radio.plaza.one/mp3',
        'genre': 'Vaporwave'
    },
    {
        'name': 'laut-lofi',
        'url': 'http://stream.laut.fm/lofi',
        'genre': 'Lofi'
    },
    {
        'name': 'laut-eurobeat',
        'url': 'http://stream.laut.fm/eurobeat',
        'genre': 'Eurobeat'
    },
    {
        'name': 'laut-tanja',
        'url': 'http://stream.laut.fm/tanjamusic',
        'genre': 'Hip-Hop'
    },
    {
        'name': 'laut-h4fm',
        'url': 'http://stream.laut.fm/h4yfmhiphop',
        'genre': 'Hip-Hop'
    },
    {
        'name': 'laut-hardtekkr',
        'url': 'http://stream.laut.fm/hardtekk-radio',
        'genre': 'Hardtekk'
    },
    {
        'name': 'laut-hardtekkradio',
        'url': 'http://stream.laut.fm/hatdtekkradio',
        'genre': 'Hardtekk'
    },
    {
        'name': 'laut-summernight',
        'url': 'http://stream.laut.fm/radiosummernight',
        'genre': 'Pop & Rock'
    },
    {
        'name': 'laut-lilpeepfm',
        'url': 'http://stream.laut.fm/rapezfm',
        'genre': 'Emo Rap'
    },
    {
        'name': 'laut-nexus',
        'url': 'http://stream.laut.fm/nexus',
        'genre': 'Hyperpop'
    },
    {
        'name': 'nxt-hardstyle',
        'url': 'http://stream.laut.fm/hardstyle',
        'genre': 'Hardstyle'
    }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radios')
        .setDescription('📻 Display all the preset radios'),
    async execute(interaction) {
        const client = require("../bot")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Radios:");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`All preset radios you can play using /radio`);
        for(let i = 0; i < radioStations.length; i++){
            embed.addField( `Name: ${radioStations[i].name}`, `Genre: ${radioStations[i].genre}`, true);
        }
        return interaction.reply({embeds : [embed]});
    },
};