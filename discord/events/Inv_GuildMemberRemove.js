import config from '../../config.js'
import Query from '../../functions/Query.js'

export default {
	name: 'guildMemberRemove',

	async execute(member) {
		if(member.user.bot) return;
        if(!config.bot.invites.enabled) return;

		let inviterId = await Query(`SELECT inviterId FROM ${config.mysql.tables.invites} WHERE invitedId = ? AND guildId = ?`, [member.user.id, member.guild.id])
		if(inviterId.results.length < 0) return;

		inviterId = inviterId.results[0].inviterId

        Query(`DELETE FROM ${config.mysql.tables.invites} WHERE invitedId = ?`, [member.user.id])

		const Member = await member.guild.members.cache.get(inviterId)

        let count = await Query(`SELECT * FROM ${config.mysql.tables.invites} WHERE inviterId = ? AND guildId = ?`, [inviterId, member.guild.id])
		count = count.results.length

		// Reset his invites roles
		for (const [key, value] of Object.entries(config.bot.invites.levels)) {
			while(count <= key) {
				await Member.roles.remove(value.role)
			}
		}

		// Add the relevant roles
		for (const [key, value] of Object.entries(config.bot.invites.levels)) {
			await Member.roles.add(value.role)
		}
	}
}