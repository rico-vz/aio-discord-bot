const chalk = require('chalk');
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, clientId, guildId } = require('./settings.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {MongoClient} = require('mongodb')
const { AutoPoster } = require('topgg-autoposter')
const url = 'mongodb://localhost:27017';
const mclient = new MongoClient(url);
const dbName = 'revbot';
let moment = require("moment");

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});

const poster = AutoPoster('top.gg secret poster code', client)


const { Player } = require("discord-music-player");
const Discord = require("discord.js");
const settings = require("./settings.json");
const player = new Player(client, {
    leaveOnEmpty: true, 
});
=client.player = player;

poster.on('posted', (stats) => { 
    console.log( chalk.magenta(`📈 Posted stats to Top.gg | ${stats.serverCount} servers.`))
  })

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}


client.once('ready', async () => {
    console.log(chalk.green('🚀 MiuBot is now ready!'));
    await mclient.connect();
    console.log(chalk.green('💻 Connected successfully to the MongoDB server.'));
    setInterval(()=>{
        checkGiveaways();
        checkReminders();
        checkMutes();
    }, 10 * 1000)
    client.user?.setPresence({
        status: "online",
        activities: [
            {
                name: "Slash Commands 💜",
                type: "WATCHING"
            }
        ]
    })
});

client.on('interactionCreate', async interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "skip"){
            let guildQueue = client.player.getQueue(interaction.guildId);
            guildQueue.skip();
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Music");
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`Skipped current song`)
            return interaction.reply({embeds : [embed], ephemeral : false});
        }
        if(interaction.customId === "pause"){
            let guildQueue = client.player.getQueue(interaction.guildId);
            guildQueue.setPaused(true);
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Music");
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`Current song was paused`)
            return interaction.reply({embeds : [embed], ephemeral : false});
        }
        if(interaction.customId === "resume"){
            let guildQueue = client.player.getQueue(interaction.guildId);
            guildQueue.setPaused(false);
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Music");
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`Current song was resumed`)
            return interaction.reply({embeds : [embed], ephemeral : false});
        }
        if(interaction.customId === "shuffle"){
            let guildQueue = client.player.getQueue(interaction.guildId);
            guildQueue.shuffle();
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Music");
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`Queue was shuffled`)
            return interaction.reply({embeds : [embed], ephemeral : false});
        }

        if(interaction.customId === "giveawayjoin"){
            await mclient.connect()
            const db = mclient.db(dbName);
            const collection = db.collection('giveaways');
            collection.findOne({messId : interaction.message.id}, function(err, result){
                if(err) console.log(err);
                if(!result) {
                    interaction.reply({content : "This giveaway is either ended or got lost in space", ephemeral : true})
                    return;
                }
                let users = result.users;
                if(!users) {
                    interaction.reply({content : "This giveaway is either ended or got lost in space", ephemeral : true})
                    return;
                }
                for(let i = 0; i < users.length; i++){
                    if(users[i] === interaction.user.id){
                        interaction.reply({content : "You are already participating in this giveaway", ephemeral : true});
                        return;
                    }
                }
                collection.updateOne({messId : interaction.message.id}, {$push : {users : interaction.user.id}}, function(err){
                    if(err) console.log(err);
                    interaction.reply({content : "Joined successfully", ephemeral : true});
                    return;
                })
            })
        }
    }
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '<:invalid:969547043922116608> Something went wrong trying to do that. If this keeps on happening please join our support server: https://discord.gg/EWWrjExEn3', ephemeral: true });
    }
});

async function checkReminders(){
    await mclient.connect()
    const db = mclient.db(dbName);
    const collection = db.collection('reminders');
    let now = moment();
    collection.find({}).toArray(function(err, result){
        for(let i = 0; i < result.length; i++){
            let date = moment(result[i].date)
            if(now.isAfter(date)){
                client.users.fetch(result[i].userId).then(user =>{
                    user.send(result[i].content);
                })
                collection.deleteOne({_id: result[i]._id}, function(err){
                    if(err) console.log(err);
                })
            }
        }
    })
}

async  function checkGiveaways(){
    await mclient.connect()
    const db = mclient.db(dbName);
    const collection = db.collection('giveaways');
    let now = moment();
    collection.find({}).toArray(async function(err, result){
        if(err) console.log(err);
        for(let i = 0; i < result.length; i++){
            let date = moment(result[i].date)
            if(now.isAfter(date)){
                let users = result[i].users;
                let rand = Math.floor(Math.random() * users.length);
                try {
                    let ch = await client.channels.fetch(result[i].channelId);
                } catch (error) {
                    console.log("Deleting invalid/deleted giveaway");
                    collection.deleteOne({_id: result[i]._id}, function(err){
                        if(err) console.log(err);
                    })
                }
                let user = await client.users.fetch(users[rand]);
                let mess = null;
                try {
                     mess = await ch.messages.fetch(result[i].messId);
                } catch (error) {
                    console.log("Deleting invalid/deleted giveaway");
                    collection.deleteOne({_id: result[i]._id}, function(err){
                        if(err) console.log(err);
                    })
                }
                
                if (mess != null) {
                    mess.edit({content : `Giveaway ended\nThe winner is : ${user}`, components : []})
                    collection.deleteOne({_id : result[i]._id}, function(err){
                        if(err) {
                            console.log("Deleted giveaway");
                            console.log(err);
                        }
                        
                    })
                }
            }
        }
    })
}

async function checkMutes(){
    await mclient.connect()
    const db = mclient.db(dbName);
    const collection = db.collection('mutes');
    let now = moment();
    collection.find({}).toArray(async function(err, result){
        if(err) console.log(err);
        for(let i = 0; i < result.length; i++){
            let date = moment(result[i].date)
            if(now.isAfter(date)){
                let guild = await client.guilds.fetch(result[i].guildId);
                let memb = await guild.members.fetch(result[i].userId);
                await memb.roles.remove(result[i].muterole);
                collection.deleteOne({_id : result[i]._id}, function(err){
                    if(err) console.log(err);
                })
            }
        }
    })
}

module.exports = client.player;


client.login(token);