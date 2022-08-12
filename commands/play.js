const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const { RepeatMode} = require('discord-music-player');
const {MessageActionRow, MessageButton} = require("discord.js");
let guildQueue;
const Discord = require("discord.js");
const settings = require("../settings.json");
const ytpl = require("ytpl");
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')
const SoundCloud = require("soundcloud-scraper");
const sclient = new SoundCloud.Client();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 Play some music')
        .addStringOption(songurl =>{
           return songurl.setName("song")
               .setDescription("URL or name of the song you'd like to play")
               .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const player = require("../bot");
        let songF = interaction.options.getString("song");
        let song;
        let spdata;
        let isyturl;
        let plid;
        let scdata;
        try{
            isyturl = ytdl.validateURL(songF);
        } catch (e){}
        try{
            plid = await ytpl.getPlaylistID(songF);
        } catch (e){}
        try{
            spdata = await getPreview(songF);
        } catch (e){}
        try{
            scdata = await sclient.getSongInfo(songF);
            console.log(scdata.title)
        } catch (e){}
        if (isyturl) {
            const songInfo = await ytdl.getInfo(songF);
            song = {
                title: songInfo.videoDetails.title,
                url: `https://youtube.com/watch?v=${songInfo.videoDetails.videoId}`,
                playlist : false
            };

        }
        else if(plid){
            let id = await ytpl.getPlaylistID(songF);
            song = {
                title: "Playlist",
                url: `https://www.youtube.com/playlist?list=${id}`,
                playlist : true
            };
        }
        /*else if(spdata){
            if(spdata.type === "playlist"){
                song = {
                    title: spdata.title,
                    url: spdata.link,
                    playlist : true
                };
            }
            else if(spdata.type === "track"){
                song = {
                    title: spdata.title,
                    url: spdata.link,
                    playlist : false
                };
            }
            else{
                if (!videos.length) return interaction.reply("No songs were found!");
            }
        }*/
        else {
            if(spdata){
                if(spdata.type === 'track'){
                    const {videos} = await yts(spdata.title);
                    if (!videos.length) return interaction.followUp("No songs were found!");
                    song = {
                        title: videos[0].title,
                        url: videos[0].url,
                        playlist : false
                    };
                }
            }
            else if(scdata){
                const {videos} = await yts(scdata.title);
                if (!videos.length) return interaction.followUp("No songs were found!");
                song = {
                    title: videos[0].title,
                    url: videos[0].url,
                    playlist : false
                };
            }
            else{
                const {videos} = await yts(songF);
                if (!videos.length) return interaction.followUp("No songs were found!");
                song = {
                    title: videos[0].title,
                    url: videos[0].url,
                    playlist : false
                };
            }
        }
        const voicec = interaction.member.voice.channel;
        if(!voicec) return interaction.reply({content : "I'm sorry but you need to be in a voice channel to play music!", ephemeral : true})
        guildQueue = player.getQueue(interaction.guildId);
        let queue = player.createQueue(interaction.guildId);
        await queue.join(interaction.member.voice.channel);
        if(guildQueue){
            if(guildQueue.songs.length > 0){
                if(song.playlist){
                    let songPlayed = await queue.playlist(song.url).catch(_ => {
                        if(!guildQueue)
                            queue.stop();
                    });
                }
                else{
                    let songPlayed = await queue.play(song.url).catch(_ => {
                        if(!guildQueue)
                            queue.stop();
                    });
                }
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Music");
                embed.setColor(settings.color);
                embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
                embed.setDescription(`${song.title} was added to queue`)
                return interaction.followUp({embeds : [embed], ephemeral : false});
            }
        }
        if(song.playlist){
            let songPlayed = await queue.playlist(song.url).catch(_ => {
                if(!guildQueue)
                    queue.stop();
            });
        }
        else{
            let songPlayed = await queue.play(song.url).catch(_ => {
                if(!guildQueue)
                    queue.stop();
            });
        }
        const row = new MessageActionRow().addComponents(
            new MessageButton().setLabel("Skip").setCustomId("skip").setStyle("DANGER"),
            new MessageButton().setLabel("Pause").setCustomId("pause").setStyle("DANGER"),
            new MessageButton().setLabel("Resume").setCustomId("resume").setStyle("DANGER"),
            new MessageButton().setLabel("Shuffle").setCustomId("shuffle").setStyle("DANGER")
        )

        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`Now playing ${song.title}`)
        return interaction.followUp({embeds : [embed], components : [row], fetchReply : true}).then(mess =>{
            player.on('songChanged', (queue, newSong, oldSong) =>{
                let emb = new Discord.MessageEmbed(mess.embeds[0]);
                emb.setDescription(`Now playing ${newSong}`)
                mess.edit({embeds : [emb]});
            })
        });
    },
};