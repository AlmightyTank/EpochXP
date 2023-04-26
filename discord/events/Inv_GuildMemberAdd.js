import config from '../../config.js'
import Query from '../../functions/Query.js';
import { client } from '../../index.js'
import { invites } from './Inv_FetchInvites.js'
import log from '../libs/logging.js'

export default {
	name: 'guildMemberAdd',

	async execute(member) {
		if(member.user.bot) return;
        if(!config.bot.invites.enabled) return;

        const guild = client.guilds.cache.get(member.guild.id);
        const role = guild.roles.cache.get(config.bot.newroleadd.role);
        const welcomechannel = guild.channels.cache.get(config.bot.newroleadd.discordChannel);

        const joined = `Welcome to the ${guild.name}, ${member}. Tanks for joining!`;

        if (!member.roles.cache.has(role.id)) {
            await member.roles.add(role);
            await welcomechannel.send(joined)
        } else if (member.roles.cache.has(role.id)) {
            console.log(`They already have that role`);
        } else if (!role) {
            console.log(`Could not find the role with ID ${ROLE_ID}.`);
        }            
	}
}