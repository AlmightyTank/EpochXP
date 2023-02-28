import config from '../../config.js'
import Query from '../../functions/Query.js'

export default {
	name: 'guildMemberAdd',
	async execute(member) {
		if(!config.bot.newroleadd.enabled) return;
		if(member.user.bot) return;

		const guild = client.guilds.cache.get(config.bot.dev.guildId);
		const role = guild.roles.cache.get(config.bot.newroleadd.role);
		const welcomechannel = guild.channels.cache.get(config.bot.newroleadd.discordChannel);
		const logChannel = client.channels.cache.get(config.logging.discordChannel)
	  
		if (!member.roles.cache.has(role.id)) {
			await member.roles.add(role);
			welcomechannel.send(`Welcome to the ${guild.name}, ${member}!`);
		} else if (!role) {
			logChannel.send(`Could not find the role with ID ${ROLE_ID}.`);
		}
	}
}