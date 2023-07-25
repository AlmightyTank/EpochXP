import { SlashCommandBuilder } from '@discordjs/builders'

import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'
import Embed from '../libs/embed.js'

export default {
    name: 'leaderboard',
    description: phrases.bot.commands.leaderboard.description[config.language],

	register() {
        const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

        .toJSON()
        return data
    },

	async execute(interaction) {        
        let q = await Query(`
            SELECT user_id, SUM(amount) as invite_count
            FROM ${config.mysql.tables.invites}
            WHERE guildId = ?
            GROUP BY user_id
            ORDER BY invite_count DESC
            LIMIT ?`,
            [ interaction.guild.id, config.bot.invites.commands.top.limit || 10 ]
        )

        q = q.results

        console.log(q)

        let users = ''
        let invites = ''

        await q.map(async (e, i) => {
            let user = await interaction.guild.members.fetch(e.user_id)
            users += `\`${i + 1}\` ${user.user.username}#${user.user.discriminator}\n`;
            invites += `**${e.invite_count}**\n`
        })

        const Embd = Embed({
            fields: [
                { name: `Top ${q.length}`, value: users, inline: true },
                { name: phrases.bot.commands.leaderboard.invites[config.language], value: invites, inline: true }
            ]
        })

        interaction.reply({ embeds: [Embd] })
        
	}
}