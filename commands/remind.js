const { SlashCommandBuilder } = require('@discordjs/builders');
let moment = require("moment");
const {MongoClient} = require('mongodb')
const url = 'mongodb://localhost:27017';
const mclient = new MongoClient(url);
const dbName = 'revbot';
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('🧠 Reminds you in DM after the time you entered the message you put in.')
        .addStringOption(reminder =>{
            return reminder.setName("reminder")
                .setDescription("What you want the bot to remind")
                .setRequired(true)
        })
        .addNumberOption(hours =>{
            return hours.setName("hours")
                .setDescription("Hours until reminder")
                .setRequired(false)
        })
        .addNumberOption(days =>{
            return days.setName("days")
                .setDescription("Days until reminder")
                .setRequired(false)
        })
        .addNumberOption(minutes =>{
            return minutes.setName("minutes")
                .setDescription("minutes until reminder")
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
        let con = interaction.options.getString("reminder");

        await mclient.connect()
        const db = mclient.db(dbName);
        const collection = db.collection('reminders');
        collection.insertOne({date : momnt.format(), content : con, userId : interaction.user.id}, function(err){
            if(err) console.log(err);
        })
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Reminder was created");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : true});
    },
};