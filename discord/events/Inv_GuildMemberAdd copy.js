import config from '../../config.js'
import Embed from '../libs/embed.js'
import { client } from '../../index.js'
import Query from '../../functions/Query.js'
import phrases from '../../translation.js'
import colors from 'chalk'
import log from '../libs/logging.js'

export default {
	name: 'guildMemberAdd',

    // Create a Set to store the members for whom the welcome message has been sent
	welcomedMembers: new Set(),

	async execute(member) {
		if(member.user.bot) return;
        if(!config.bot.invites.enabled) return;
        if(!this.welcomedMembers.has(member.id)) return;
        
        client.guilds.cache.forEach(async (guilds) => {

            // Fetch all Guild Invites
            const invites = await guilds.invites.fetch()

            const isThere = await Query(`SELECT default_role_id,xp_role_ids,welcome_channel_id,invite_role_ids, rank_channel_id FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [member.guild.id]);
            if(isThere.results.length > 0) {
                const there = isThere.results[0];

                

                // Define Vars
                const guild = client.guilds.cache.get(member.guild.id);
                const role = guild.roles.cache.get(there.default_role_id);

                const AllIDs = there.xp_role_ids.split(',');
                const ID = AllIDs[0];
                const firstRole  = guild.roles.cache.get(ID);

                const welcomechannel = guild.channels.cache.get(there.welcome_channel_id);
                let joined = '';

                // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
                await invites.forEach(async (invite) => {
                    // Check if the welcome message has already been sent for this member
                    if (!this.welcomedMembers.has(member.id)) {
                        
                        const inviter = await Query(`SELECT * FROM ${config.mysql.tables.invitelinks} WHERE approved = true AND invitecode = ?`, [invite.code]);
                        console.log(!this.welcomedMembers.has(member.id));

                        if (!member.roles.cache.has(role.id)) {
                            await member.roles.add(role);
                            await member.roles.add(firstRole);
                        } else if (member.roles.cache.has(role.id)) {
                        console.log(`They already have that role`);
                        } else if (!role) {
                        console.log(`Could not find the role with ID ${role.id}.`);
                        }

                        if (inviter.results.length > 0) {
                            const inviterID = inviter.results[0].user_id;
                            joined = `Welcome to the ${guild.name}, ${member}. Tanks for joining us with an invite from <@${inviterID}>!`;
                            this.welcomedMembers.add(member.id);
                            console.log(!this.welcomedMembers.has(member.id));
                            await welcomechannel.send(joined)

                            await Query(`DELETE FROM ${config.mysql.tables.invitelinks} WHERE approved = true AND user_id = ? AND invitecode = ?`, [inviterID, invite.code]);

                            await invite.delete();

                            if (inviterID) {
                                let state = await Query(`SELECT amount FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                if(state.results.length < 1) { // User Doesn't Exist =>
                                    await Query(`INSERT INTO ${config.mysql.tables.invites} (guildId, user_id) VALUES (?, ?)`, [member.guild.id, inviterID]);
                                    state = await Query(`SELECT amount FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                }
                                // User Exist =>
                                state = state.results[0];
                
                                let updatedState = 1 + state.amount;
                
                                await Query(`UPDATE ${config.mysql.tables.invites} SET amount = ? WHERE user_id = ? AND guildId = ?`, [updatedState, inviterID, member.guild.id])
                
                                const Member = await member.guild.members.cache.find(member => member.id === inviterID)

                                const AllIDs = there.invite_role_ids.split(',');
                                const updatedIDQ = AllIDs[config.bot.invites.levels[updatedState]?.role];
                                const updatedID = AllIDs[config.bot.invites.levels[updatedState]?.role];

                                if(config.bot.invites.levels[updatedState]?.role) {
                                    if(!config.bot.invites.stackRoles)
                                        for (const [key, value] of Object.entries(config.bot.invites.levels))
                                            await Member.roles.remove(updatedIDQ)
                                    
                                    await Member.roles.add(updatedID)
                                    const guild = member.guild;
                                    const role = guild.roles.cache.get(updatedID);
                
                                    if(Member.roles.cache.has(updatedIDQ)) {
                                        const Embd = Embed({
                                            title:
                                                phrases.bot.ir.raiseLevel.embedTitle[config.language]
                                                    .replace(`{user}`, Member.user.username),
                                            message:
                                                phrases.bot.ir.raiseLevel.embedMessage[config.language]
                                                    .replace(`{role}`, role),
                                            thumbnail: Member.user.displayAvatarURL()
                                        })
                                        const ranksChannel = client.channels.cache.get(there.rank_channel_id)
                                        const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                        await ranksMessage.react('🔥');
                                    }
                                }
                            }
                        } else if (member.guild.id != config.bot.dev.guildId && invite.inviter.id != member.user.bot.id) {
                            const inviterID = invite.inviter.id
                            joined = `Welcome to the ${guild.name}, ${member}. Tanks for joining us with an invite from <@${inviterID}>!`;
                            this.welcomedMembers.add(member.id);
                            console.log(!this.welcomedMembers.has(member.id));
                            await welcomechannel.send(joined)

                            if (inviterID) {
                                let state = await Query(`SELECT amount FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                if(state.results.length < 1) { // User Doesn't Exist =>
                                    await Query(`INSERT INTO ${config.mysql.tables.invites} (guildId, user_id) VALUES (?, ?)`, [member.guild.id, inviterID]);
                                    state = await Query(`SELECT amount FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                }
                                // User Exist =>
                                state = state.results[0];
                
                                let updatedState = 1 + state.amount;
                
                                await Query(`UPDATE ${config.mysql.tables.invites} SET amount = ? WHERE user_id = ? AND guildId = ?`, [updatedState, inviterID, member.guild.id])
                
                                const Member = await member.guild.members.cache.find(member => member.id === inviterID)

                                const AllIDs = there.invite_role_ids.split(',');
                                const updatedIDQ = AllIDs[config.bot.invites.levels[updatedState]?.role];
                                const updatedID = AllIDs[config.bot.invites.levels[updatedState]?.role];

                                if(config.bot.invites.levels[updatedState]?.role) {
                                    if(!config.bot.invites.stackRoles)
                                        for (const [key, value] of Object.entries(config.bot.invites.levels))
                                            await Member.roles.remove(updatedIDQ)
                                    
                                    await Member.roles.add(updatedID)
                                    const guild = member.guild;
                                    const role = guild.roles.cache.get(updatedID);
                
                                    if(Member.roles.cache.has(updatedIDQ)) {
                                        const Embd = Embed({
                                            title:
                                                phrases.bot.ir.raiseLevel.embedTitle[config.language]
                                                    .replace(`{user}`, Member.user.username),
                                            message:
                                                phrases.bot.ir.raiseLevel.embedMessage[config.language]
                                                    .replace(`{role}`, role),
                                            thumbnail: Member.user.displayAvatarURL()
                                        })
                                        const ranksChannel = client.channels.cache.get(there.rank_channel_id)
                                        const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                        await ranksMessage.react('🔥');
                                    }
                                }
                            }
                        }
                    }
                })
            }
        })
	}
}