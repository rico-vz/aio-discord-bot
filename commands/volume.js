const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('🎵 Change music volume from 0 to 100')
        .addStringOption(volume =>{
            return volume.setName("volume")
                .setDescription("Volume from 0 to 100")
                .setRequired(true);
        }),
    async execute(interaction) {
        const player = require("../bot");
        let guildQueue = player.getQueue(interaction.guildId);
        guildQueue.setVolume(interaction.options.getString("volume"))
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Music");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`Changed volume to ${interaction.options.getString("volume")}`)
        return interaction.reply({embeds : [embed], ephemeral : false});

    },
};