import config from '../../config.js'
import Query from '../../functions/Query.js'

export default {
    name: 'guildMemberRemove',
    async execute(member) {
        if(!config.bot.xp.enabled && !config.bot.xp.deleteRowOnRemove) return;
        if(member.user.bot) return;

        const deleteRow = await Query(`SELECT * FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [member.user.id, member.guild.id])

        if(deleteRow.results.length >= 1) 
            await Query(`DELETE FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [member.user.id, member.guild.id])
    }
}