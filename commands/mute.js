const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const {MongoClient} = require("mongodb");
const moment = require("moment");
const url = 'mongodb://localhost:27017';
const mclient = new MongoClient(url);
const dbName = 'revbot';
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔧 Mutes a user')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User you want to mute")
                .setRequired(true);
        })
        .addNumberOption(hours =>{
            return hours.setName("hours")
                .setDescription("Hours to mute for")
                .setRequired(true)
        })
        .addRoleOption(muterole =>{
            return muterole.setName("muterole")
                .setDescription("The role that mutes")
                .setRequired(true)
        })
        .addStringOption(reason =>{
            return reason.setName("reason")
                .setDescription("Reason for mute")
                .setRequired(false)
        }),
    async execute(interaction) {
        if(!interaction.memberPermissions.has("KICK_MEMBERS")){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Ban`)
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription("You dont have permissions to use this command")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
        let user = interaction.options.getUser("user");
        let role = interaction.options.getRole("muterole")
        let memb = await interaction.guild.members.fetch(user.id);
        await memb.roles.add(role);
        let hours = interaction.options.getNumber("hours");
        let momnt = moment();
        if(hours){
            momnt.add(interaction.options.getNumber("hours"), "hours")
        }
        await mclient.connect()
        const db = mclient.db(dbName);
        const collection = db.collection('mutes');
        collection.insertOne({userId : user.id, guildId : interaction.guildId, date : momnt.format(), muterole : interaction.options.getRole("muterole").id}, function(err){
            if(err) console.log(err);
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Mute`)
            let desc = '';
            desc += `${user.username} was muted for ${hours} `
            if(hours > 1) desc += 'hours'
            else desc += 'hour'
            if(interaction.options.getString("reason")) desc += `\nReason : ${interaction.options.getString("reason")}`
            embed.setDescription(desc);
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            return interaction.reply({embeds : [embed]});
        })
    },
};