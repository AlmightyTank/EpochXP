export const invites = new Map()
import config from '../../config.js'

export default {
	name: 'ready',
	once: true,

	async execute(client) {
        if(!config.bot.invites.enabled) return;

        client.guilds.cache.forEach(async (guild) => {
            // Fetch all Guild Invites
            const firstInvites = await guild.invites.fetch()
            // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
            invites.set(guild.id, new Map(firstInvites.map((invite) => [invite.code, invite.uses])))
        })
	}
}