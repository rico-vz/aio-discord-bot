const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('🗑️ Purge a number of messages from a channel')
        .addIntegerOption(messageamount =>{
            return messageamount.setName("messageamount")
                .setDescription("amount of messages to delete")
                .setRequired(true);
        }),
    async execute(interaction) {
        let messageAmount = interaction.options.getInteger("messageamount");
        let channel = interaction.channel;
        let messages = await channel.messages.fetch( { limit: messageAmount } );
        if(!interaction.memberPermissions.has("MANAGE_MESSAGES")){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Purge`)
            embed.setColor(settings.color);
    embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription("You dont have permissions to use this command")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }
        
        await channel.bulkDelete(messages);

        let embed = new Discord.MessageEmbed();
        embed.setTitle(`${interaction.user.username} purged ${messageAmount} messages`);
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        return interaction.reply({embeds : [embed], ephemeral : false});
    },
};