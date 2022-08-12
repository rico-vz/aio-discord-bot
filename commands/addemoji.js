const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('🎨 Adds an emoji to the server')
        .addStringOption(emoji =>{
            return emoji.setName("emoji")
                .setDescription("Emoji to add")
                .setRequired(true)
        })
        .addStringOption(name =>{
            return name.setName("name")
                .setDescription("Name for the emoji")
                .setRequired(true)
        }),
    async execute(interaction) {

        if(!interaction.memberPermissions.has("MANAGE_EMOJIS_AND_STICKERS")){
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Emoji`)
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription("You dont have permissions to use this command")
            return interaction.reply({embeds : [embed], ephemeral : true});
        }

        const emoji = interaction.options.getString("emoji");
        const name = interaction.options.getString("name");
        const guild = interaction.guild;
        const emojiId = emoji.match(/([0-9]+)/)[0];

        try {
            await guild.emojis.create(`https://cdn.discordapp.com/emojis/${emojiId}`, name)
            .then((newEmoji) => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Emoji");
                embed.setThumbnail(`https://cdn.discordapp.com/emojis/${emojiId}`)
                embed.setColor(settings.color);
                embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
                embed.setDescription(`Added emoji ${newEmoji.name}`)
                return interaction.reply({embeds : [embed], ephemeral : true});
            })
        } catch {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Emoji");
            embed.setColor(settings.color);
            embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
            embed.setDescription(`Could not add emoji. Make sure you put in a Discord Emoji & a name. Also make sure you're not adding emojis too fast as it'll not work.`) 
            return interaction.reply({embeds : [embed], ephemeral : true});
        }


    },
};