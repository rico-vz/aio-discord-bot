const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('🔧 Kicks a user')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User you want to kick")
                .setRequired(true);
        })
        .addStringOption(reason =>{
            return reason.setName("reason")
                .setDescription("Reason for kick")
                .setRequired(false)
        }),
    async execute(interaction) {
        if(!interaction.memberPermissions.has("KICK_MEMBERS")){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Kick`)
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription("You dont have permissions to use this command")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
        let member = await interaction.guild.members.fetch(interaction.options.getUser("user"));
        let user = member.user;
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Kick`)
        let desc = '';
        desc += `${user.username} was kicked`
        if(interaction.options.getString("reason")) desc += `\nReason : ${interaction.options.getString("reason")}`
        embed.setDescription(desc);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        if(member.manageable){
            await member.kick();
            return interaction.reply({embeds : [embed]});
        }
        else{
            embed.setDescription("Not enough permissions to kick this user")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
        return interaction.reply({embeds : [embed]});
    },
};