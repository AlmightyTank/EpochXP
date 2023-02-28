import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'
import generateXP from '../../functions/generateXP.js'
import { client } from '../../index.js'
import Embed from '../libs/embed.js'

const delay = new Set()

export default {
	name: 'messageCreate',
	async execute(message) {
		if(!config.bot.xp.enabled) return;
		if(!message.member) return;
		if(message.member?.user?.bot) return;

        if(delay.has(`${message.member.user.id}:${message.guild.id}`)) return;

		delay.add(`${message.member.user.id}:${message.guild.id}`)
		setTimeout(() => {
			delay.delete(`${message.member.user.id}:${message.guild.id}`)
		}, config.bot.xp.generation.delay)

		// Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
		let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [message.member.user.id, message.guild.id])
		if(state.results.length < 1) // User Doesn't Exist =>
			return await Query(`INSERT INTO ${config.mysql.tables.xp} (guildId, userId, amount, level) VALUES (?, ?, ?, 0)`, [message.guild.id, message.member.user.id, generateXP()])
		
		// User Exist =>
		state = state.results[0]

		const genXP = generateXP()
		let updatedXP = genXP + state.amount

		updatedXP = message.attachments.size > 1 ? updatedXP + config.bot.xp.generation.attachmentBonus * message.attachments.size : updatedXP // Forumla: if message contains any attachments => add the bonus * number of attachments

		const currentLevel = state.level
		const newLevel = config.bot.xp.levels.levels.filter(levels => updatedXP >= levels.xp).slice(-1)[0]

		if(config.bot.xp.levels.enabled && newLevel && newLevel.level != currentLevel) {
			// Update his new level
			await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ?, level = ? WHERE userId = ? AND guildId = ?`, [updatedXP, newLevel.level, message.member.user.id, message.guild.id])
			
			if(config.bot.xp.levels.removeAllRoles) {
				let last = ""
				config.bot.xp.levels.levels.map(r => {
					if(r.role != last)
						message.member.roles.remove(r.role)
					last = r.role
				})
			}
			
			// Give him the new role
			let role = phrases.bot.xp.raiseLevel.noRole[config.language]
			if(newLevel.role) {
				role = message.guild.roles.cache.find(r => r.id === newLevel.role)
				message.member.roles.add(role)
			}

			// Send an embed
			const Embd = Embed({
				title:
					phrases.bot.xp.raiseLevel.embedTitle[config.language]
						.replace(`{level}`, newLevel.level)
						.replace(`{user}`, message.member.user.username),
				message:
					phrases.bot.xp.raiseLevel.embedMessage[config.language]
						.replace(`{level}`, newLevel.level)
						.replace(`{xp}`, updatedXP)
						.replace(`{user}`, message.member)
						.replace(`{role}`, role)
						.replace(`{bonus}`, newLevel.bonus ? newLevel.bonus : phrases.bot.xp.raiseLevel.noBonus[config.language]),
				thumbnail: message.member.user.displayAvatarURL()
			})
			const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
			//message.member.send({embeds: [Embd]})
			//message.reply({embeds: [Embd]})
			ranksChannel.send({embeds: [Embd]})
		}
		else
			await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ? WHERE userId = ? AND guildId = ?`, [updatedXP, message.member.user.id, message.guild.id])
		
	}
}