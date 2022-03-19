import config from '../../config.js'
import Query from '../../functions/Query.js'

export default {
	name: 'guildMemberAdd',
	async execute(member) {
		if(!config.bot.xp.enabled && !config.bot.xp.createRowOnAdd) return;
		if(member.user.bot) return;

	    const createRow = await Query(`SELECT * FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [member.user.id, member.guild.id])

	    if(createRow.results.length < 1) 
            await Query(`INSERT INTO ${config.mysql.tables.xp} (userId, guildId, amount, level) VALUES (?, ?, 0, 0)`, [member.user.id, member.guild.id])
	}
}