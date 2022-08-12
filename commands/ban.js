const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🔧 Bans a user')
        .addUserOption(user =>{
            return user.setName("user")
                .setDescription("User you want to ban")
                .setRequired(true);
        })
        .addStringOption(reason =>{
            return reason.setName("reason")
                .setDescription("Reason for ban")
                .setRequired(false)
        }),
    async execute(interaction) {
        if(!interaction.memberPermissions.has("BAN_MEMBERS")){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Ban`)
            embed.setColor(settings.color);
    embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription("You dont have permissions to use this command")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
        let member = await interaction.guild.members.fetch(interaction.options.getUser("user"));
        let user = member.user;
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Ban`)
        let desc = '';
        desc += `${user.username} was banned`
        if(interaction.options.getString("reason")) desc += `\nReason : ${interaction.options.getString("reason")}`
        embed.setDescription(desc);
        embed.setColor(settings.color);
embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        if(member.manageable){
            await member.ban();
            return interaction.reply({embeds : [embed]});
        }
        else{
            embed.setDescription("Not enough permissions to ban this user")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
    },
};