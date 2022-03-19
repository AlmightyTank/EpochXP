import { SlashCommandBuilder } from '@discordjs/builders'

import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'
import Embed from '../libs/embed.js'

export default {
    name: 'top',
    description: phrases.bot.commands.top.description[config.language],

	register() {
        const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

        .toJSON()
        return data
    },

	async execute(interaction) {
        
        let q = await Query(`
            SELECT userId, amount, level
            FROM ${config.mysql.tables.xp}
            WHERE guildId = ?
            ORDER BY level DESC
            LIMIT ?`,
            [ interaction.guild.id, config.bot.xp.commands.top.limit || 10 ]
        )

        q = q.results

        let users = ''
        let levels = ''
        let xp = ''

        await q.map(async (e, i) => {
            let user = await interaction.guild.members.fetch(e.userId)
            users += `\`${i + 1}\` ${user.user.username}#${user.user.discriminator}\n`;
            levels += `**${e.level}**\n`
            xp += `\`${e.amount}\`\n`
        })

        const Embd = Embed({
            fields: [
                { name: `Top ${q.length}`, value: users, inline: true },
                { name: phrases.bot.commands.top.level[config.language], value: levels, inline: true },
                { name: 'XP', value: xp, inline: true }
            ]
        })

        interaction.reply({ embeds: [Embd] })
        
	}
}