import config from '../../config.js'
import Query from '../../functions/Query.js'
import { client } from '../../index.js'

export default {
	name: 'guildMemberRemove',

	async execute(member) {
		if(member.user.bot) return;
        if(!config.bot.invites.enabled) return;
		
		const guild = client.guilds.cache.get(member.guild.id);
		const departures = guild.channels.cache.get(config.bot.newrolerm.discordChannel);
		departures.send(`${member} has left us`);
	}
}