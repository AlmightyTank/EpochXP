import { invites } from './Inv_FetchInvites.js'
import config from '../../config.js'

export default {
	name: 'inviteCreate',

	async execute(invite) {
		if(!config.bot.invites.enabled) return;

		// Update cache on new invites
		invites.get(invite.guild.id).set(invite.code, invite.uses)
	}
}