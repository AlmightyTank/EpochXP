import config from '../../config.js'
import Query from '../../functions/Query.js'
import { client } from '../../index.js'

export default {
	name: 'guildMemberRemove',

	async execute(member) {
		if(member.user.bot) return;
        if(!config.bot.invites.enabled) return;
		
		const guild = client.guilds.cache.get(member.guild.id);

		const isThere = await Query(`SELECT departure_channel_id FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [member.guild.id]);
		if(isThere.results.length > 0) {
			const departures = guild.channels.cache.get(isThere.results[0].departure_channel_id);
			departures.send(`${member} - ${member.user.username} has left us!!`);
		}

	}
}