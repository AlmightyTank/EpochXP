import { SlashCommandBuilder } from '@discordjs/builders'

import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'
import Embed from '../libs/embed.js'

export default {
    name: 'invites',
    description: phrases.bot.commands.invites.description[config.language],

	register() {
        const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
        .addUserOption(option => option.setName('target').setDescription(phrases.bot.commands.xp.userToCheck[config.language]))

        .toJSON()
        return data
    },

	async execute(interaction) {
        const User = interaction.options.getUser("target") || interaction.user

		let state = await Query(`SELECT * FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [User.id, interaction.guild.id])
        state = state.results

        let users = ''

        if(state.length < 1) return interaction.reply({ embeds: [ Embed({ title: phrases.bot.main.error[config.language], message: phrases.bot.commands.invites.notFoundInvites[config.language], color: "RED" }) ]})

        console.log(state[0].invited_member_ids.length < 1 && state.length > 0);
    
        if(state[0].invited_member_ids.length < 1 && state.length > 0) return interaction.reply({ embeds: [ Embed({ title: phrases.bot.commands.invites.title[config.language].replace(`{invites}`, state[0].amount)} )]})

        console.log(state[0].invited_member_ids.length > 0 && state.length > 0);
        
        if(state[0].invited_member_ids.length > 0 && state.length > 0) {
            let counter = 0;
            for (const [i, e] of state.entries()) {
                const invitedMemberIds = e.invited_member_ids.split(',')
                for (const memberId of invitedMemberIds) {
                    counter++;
                    const user = await interaction.guild.members.fetch(memberId);
                    users += `\`${counter}\` ${user.user.username}#${user.user.discriminator}\n`;
                }
            }
    
            interaction.reply({ embeds: [
                Embed({
                    title: phrases.bot.commands.invites.title[config.language].replace(`{invites}`, state[0].amount),
                    fields: [
                        { name: phrases.bot.commands.invites.members[config.language], value: users, inline: true }
                    ]
                })
            ]})
        }
	}
}