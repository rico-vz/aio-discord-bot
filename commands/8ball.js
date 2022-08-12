const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('🎱 Ask a question and I will answer it')
        .addStringOption(question => {
            return question.setName("question")
                .setDescription("question you want to ask")
                .setRequired(true)
        }),
    async execute(interaction) {
        let question = await interaction.options.getString("question");
        let answers = [
            "It is certain",
            "It is decidedly so",
            "Without a doubt",
            "Yes definitely",
            "You may rely on it",
            "As I see it, yes",
            "Most likely",
            "Outlook good",
            "Yes",
            "Signs point to yes",
            "Reply hazy try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful"
        ]
        let embed = new Discord.MessageEmbed();
        embed.setTitle("🎱");
        embed.setColor(settings.color);
        embed.setFooter({text: settings.footer, iconURL: settings.footerIcon});
        embed.setDescription(`${answers[Math.floor(Math.random() * answers.length)]}`)
        return interaction.reply({embeds : [embed], ephemeral : true});

    },
};