import { MessageAttachment } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import canvacord from 'canvacord'

import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'

export default {
    name: 'xp',
    description: phrases.bot.commands.xp.description[config.language],

	register() {
        const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
        .addUserOption(option => option.setName('target').setDescription(phrases.bot.commands.xp.userToCheck[config.language]))

        .toJSON()
        return data
    },

	async execute(interaction) {
        const defaultImg = "https://cdn.discordapp.com/embed/avatars/0.png"

        const User = interaction.options.getUser("target") || interaction.user

		let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [User.id, interaction.guild.id])
        state = state.results[0]

        if(!state) {
            await Query(`INSERT INTO ${config.mysql.tables.xp} (userId, guildId, amount, level) VALUES (?, ?, 0, 0)`, [User.id, interaction.guild.id])
            state = {
                amount: 0,
                level: 0
            }
        }

        // get the next rank information
        const nextLevel = config.bot.xp.levels.levels.filter(level => level.level > state.level)[0]

        const rank = new canvacord.Rank()
            .setAvatar(User.displayAvatarURL({ dynamic: false, format: 'png'}) || defaultImg)
            .setCurrentXP(state.amount)
            .setRequiredXP(nextLevel.xp)
            .setLevel(state.level)
            .setRank(0, 0, false)
            .setStatus("online")
            .setProgressBar(config.bot.embedSettings.color, "COLOR")
            .setUsername(User.username)
            .setDiscriminator(User.discriminator);

        rank.build().then(data => {
            const attachment = new MessageAttachment(data, "RankCard.png");
            interaction.reply({ files: [attachment] });
        })
	}
}