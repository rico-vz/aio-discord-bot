const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botstats')
        .setDescription('📊 Shows you amount of users the bot is watching over, how many server it\'s in & up-time'),
    async execute(interaction) {
        if (interaction.user.id != 305238946584199178) {
            return interaction.reply({content: 'This command can only be used by Miu\'s developer.', ephemeral: true});
        }
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Stats");
        embed.setColor(settings.color);
embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        let desc = '';
        let userC = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        let servC = interaction.client.guilds.cache.size;
        let client = interaction.client;
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        desc += `Users : ${userC}\nServers : ${servC}\nUptime : ${uptime}`
        embed.setDescription(desc);
        return interaction.reply({embeds : [embed]});
    },
};