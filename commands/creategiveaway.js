const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require("moment");
const {MongoClient} = require('mongodb')
const url = 'mongodb://localhost:27017';
const mclient = new MongoClient(url);
const dbName = 'revbot';
const {MessageActionRow, MessageButton} = require("discord.js");
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('creategiveaway')
        .setDescription('🎁 Creates a giveaway')
        .addStringOption(givemess =>{
            return givemess.setName("givemess")
                .setDescription("What you want to send in a giveaway message")
                .setRequired(true)
        })
        .addNumberOption(hours =>{
            return hours.setName("hours")
                .setDescription("Hours until giveaway end")
                .setRequired(false)
        })
        .addNumberOption(days =>{
            return days.setName("days")
                .setDescription("Days until giveaway end")
                .setRequired(false)
        })
        .addNumberOption(minutes =>{
            return minutes.setName("minutes")
                .setDescription("minutes until giveaway en")
                .setRequired(false)
        }),
    async execute(interaction) {
        let minutes = interaction.options.getNumber("minutes");
        let hours = interaction.options.getNumber("hours");
        let days = interaction.options.getNumber("days");
        if(!minutes && !hours && !days) return interaction.reply({content : "You need to specify time for reminder", ephemeral : true});
        let momnt = moment();
        if(minutes){
            momnt.add(interaction.options.getNumber("minutes"), "minutes")
        }
        if(hours){
            momnt.add(interaction.options.getNumber("hours"), "hours")
        }
        if(days){
            momnt.add(interaction.options.getNumber("days"), "days")
        }
        let con = interaction.options.getString("givemess");

        const row = new MessageActionRow().addComponents(new MessageButton().setLabel("Join").setStyle("PRIMARY").setCustomId("giveawayjoin"))
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Giveaway");
        embed.setDescription(con + `\nGiveaway ends at ` + `<t:${momnt.unix()}>`);
        embed.setColor(settings.color);
        embed.setFooter(settings.footer)
        return interaction.channel.send({embeds : [embed], components : [row]}).then(async mess =>{
            await mclient.connect()
            const db = mclient.db(dbName);
            const collection = db.collection('giveaways');
            collection.insertOne({date : momnt.format(), messId : mess.id, channelId : mess.channel.id, users : []}, function(err){
                if(err) console.log(err);
            })
        });
    },
};