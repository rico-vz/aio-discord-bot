const { SlashCommandBuilder } = require('@discordjs/builders');
const radio = require('discord-radio-player')
const {joinVoiceChannel,
    createAudioPlayer,
    createAudioResource} = require('@discordjs/voice');
let player;
let streamRad;
let rad;
let Discord = require("discord.js");
let settings = require("../settings.json");

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
        'name': 'nxt-hardstyle',
        'url': 'http://stream.laut.fm/hardstyle',
        'genre': 'Hardstyle'
    }
]


module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('📻 Plays the radio')
        .addStringOption(radi =>{
            return radi.setName("radio")
                .setDescription("Radio URl or custom")
                .setRequired(true)
        })
        .addStringOption(radiC =>{
           return radiC.setName("customradio")
               .setDescription("Name of custom radio")
               .setRequired(false)
        }),
    async execute(interaction) {
        let streamUrl
        if(interaction.options.getString("radio") !== "custom"){
            let found = false;
            for(let i = 0; i < radioStations.length; i++){
                if(radioStations[i].name === interaction.options.getString("radio") || radioStations[i].url === interaction.options.getString("radio")){
                    streamRad = radioStations[i];
                    found = true;
                }
            }
            if(!found){
                let embed = new Discord.MessageEmbed()
                embed.setTitle("Radio")
                embed.setDescription(`Could not find the radio you wanted`)
                embed.setColor(settings.color);
                embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
                return interaction.reply({embeds : [embed], ephemeral : true});
            }
            streamUrl = streamRad.url;
        }
        else{
            let embed = new Discord.MessageEmbed()
            embed.setTitle("Custom Radio")
            embed.setDescription(`Custom radios are currently disabled due to a bug. We\'re working on it.`)
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            return interaction.reply({embeds : [embed], ephemeral : true});
            // let customurl = interaction.options.getString("customradio");
            // if(!customurl){
            //     let embed = new Discord.MessageEmbed()
            //     embed.setTitle("Radio")
            //     embed.setDescription(`You need to include url of a custom radio`)
            //     embed.setColor(settings.color);
            //     embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            //     return interaction.reply({embeds : [embed], ephemeral : true});
            // }
            // streamRad = {name : "custom", url : customurl, genre : "unknown"}
            // streamUrl = customurl;
        }
        let stream = radio.Radio.getStream(streamUrl, {volume : 1})
        rad = await joinVoiceChannel({
            channelId : interaction.member.voice.channel.id,
            guildId : interaction.guildId,
            adapterCreator : interaction.guild.voiceAdapterCreator
        })
        player = createAudioPlayer();
        const resource = createAudioResource(stream);
        await player.play(resource);
        rad.subscribe(player);
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Radio")
        embed.setDescription(`Now playing : ${streamRad.name}`)
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
    async getPlayer(){
        return player;
    },
    async getStreamRad(){
        return streamRad;
    },
    async getRad(){
        return rad;
    }
};