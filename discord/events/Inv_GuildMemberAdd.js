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
        if (this.welcomedMembers.has(member.id)) return;

        let iterationCount = 0; // Iteration tracking

        const invitedIDs = [];
        
        const guild = client.guilds.cache.get(member.guild.id);
    
        iterationCount++; // Increment iteration count

        // Fetch all Guild Invites
        const invites = await guild.invites.fetch()

        console.log(iterationCount);

        if (iterationCount <= 1) {

            const isThere = await Query(`SELECT default_role_id,xp_role_ids,welcome_channel_id,invite_role_ids,rank_channel_id FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [member.guild.id]);
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
                for (const invite of invites.values()) {
                    // Check if the welcome message has already been sent for this member
                    console.log(!this.welcomedMembers.has(member.id));
                    if (!this.welcomedMembers.has(member.id)) {
                        
                        const inviter = await Query(`SELECT * FROM ${config.mysql.tables.invitelinks} WHERE approved = true AND invitecode = ?`, [invite.code]);
                        
                        if (!member.roles.cache.has(role.id)) {
                            await member.roles.add(role);
                            await member.roles.add(firstRole);
                        } else if (member.roles.cache.has(role.id)) {
                        console.log(`They already have that role`);
                        } else if (!role) {
                        console.log(`Could not find the role with ID ${role.id}.`);
                        }

                        if (inviter.results.length > 0) {
                            this.welcomedMembers.add(member.id);
                            const inviterID = inviter.results[0].user_id;
                            joined = `Welcome to ${guild.name}, ${member}. Tanks for joining us with an invite from <@${inviterID}>!`;
                            await welcomechannel.send(joined)

                            await Query(`DELETE FROM ${config.mysql.tables.invitelinks} WHERE approved = true AND user_id = ? AND invitecode = ?`, [inviterID, invite.code]);

                            await invite.delete();

                            if (inviterID) {
                                let state = await Query(`SELECT amount,invited_member_ids FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                if(state.results.length < 1) { // User Doesn't Exist =>
                                    await Query(`INSERT INTO ${config.mysql.tables.invites} (guildId, user_id) VALUES (?, ?)`, [member.guild.id, inviterID]);
                                    state = await Query(`SELECT amount,invited_member_ids FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                }
                                // User Exist =>
                                state = state.results[0];

                                const amount = state.amount;
                
                                let updatedState = 1 + amount;

                                invitedIDs.push(member.id);

                                let invitedMembers = invitedIDs ? (invitedIDs.length > 1 ? invitedIDs.join(',') : invitedIDs[0]) : ''; // Convert the invitedIDs array into a comma-separated string

                                invitedMembers = invitedMembers ? (invitedMembers + (state.invited_member_ids.length > 1 ? ',' : '') + state.invited_member_ids) : [];

                                const index = invitedIDs.indexOf(member.id);

                                if (index > -1) {
                                    invitedIDs.splice(index, 1);
                                }

                                console.log(invitedIDs);
                
                                await Query(`UPDATE ${config.mysql.tables.invites} SET amount = ?, invited_member_ids= ? WHERE user_id = ? AND guildId = ?`, [updatedState, invitedMembers, inviterID, member.guild.id])
                
                                const Member = await member.guild.members.cache.find(member => member.id === inviterID)

                                const AllIDs = there.invite_role_ids.split(',');
                                const outdatedID = AllIDs[config.bot.invites.levels[amount]?.role];
                                const updatedID = AllIDs[config.bot.invites.levels[updatedState]?.role];

                                console.log(`${outdatedID} - ${updatedID}`);

                                if(config.bot.invites.levels[updatedState]?.role) {
                                    if(!config.bot.invites.stackRoles)
                                        for (const [key, value] of Object.entries(config.bot.invites.levels))
                                            await Member.roles.remove(outdatedID)
                                    
                                    await Member.roles.add(updatedID)
                                    const guild = member.guild;
                                    const role = guild.roles.cache.get(updatedID);
                
                                    if(Member.roles.cache.has(outdatedID)) {
                                        const Embd = Embed({
                                            title:
                                                phrases.bot.ir.raiseLevel.embedTitle[config.language]
                                                    .replace(`{user}`, Member.user.username),
                                            message:
                                                phrases.bot.ir.raiseLevel.embedMessage[config.language]
                                                    .replace(`{user}`, Member.user.username)
                                                    .replace(`{role}`, role)
                                                    .replace(`{roles}`, role),
                                            thumbnail: Member.user.displayAvatarURL()
                                        })
                                        const ranksChannel = client.channels.cache.get(there.rank_channel_id)
                                        const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                        await ranksMessage.react('🔥');
                                    }
                                }
                                this.welcomedMembers.delete(member.id);
                            }
                        } else if (member.guild.id != config.bot.dev.guildId && invite.inviter.id != member.user.bot.id || !inviter) {
                            this.welcomedMembers.add(member.id);
                            const inviterID = invite.inviter.id
                            joined = `Welcome to ${guild.name}, ${member}. Tanks for joining us with an invite from <@${inviterID}>!`;
                            await welcomechannel.send(joined)

                            if (inviterID) {
                                let state = await Query(`SELECT amount,invited_member_ids FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                if(state.results.length < 1) { // User Doesn't Exist =>
                                    await Query(`INSERT INTO ${config.mysql.tables.invites} (guildId, user_id) VALUES (?, ?)`, [member.guild.id, inviterID]);
                                    state = await Query(`SELECT amount,invited_member_ids FROM ${config.mysql.tables.invites} WHERE user_id = ? AND guildId = ?`, [inviterID, member.guild.id])
                                }
                                // User Exist =>
                                state = state.results[0];

                                const amount = state.amount;
                
                                let updatedState = 1 + amount;

                                invitedIDs.push(member.id);

                                let invitedMembers = invitedIDs ? (invitedIDs.length > 1 ? invitedIDs.join(',') : invitedIDs[0]) : ''; // Convert the invitedIDs array into a comma-separated string

                                invitedMembers = invitedMembers ? (invitedMembers + (state.invited_member_ids.length > 1 ? ',' : '') + state.invited_member_ids) : [];
                                
                                const index = invitedIDs.indexOf(member.id);

                                if (index > -1) {
                                    invitedIDs.splice(index, 1);
                                }

                                console.log(invitedIDs);
                
                                await Query(`UPDATE ${config.mysql.tables.invites} SET amount = ?, invited_member_ids= ? WHERE user_id = ? AND guildId = ?`, [updatedState, invitedMembers, inviterID, member.guild.id])
                
                                const Member = await member.guild.members.cache.find(member => member.id === inviterID)

                                const AllIDs = there.invite_role_ids.split(',');
                                const outdatedID = AllIDs[config.bot.invites.levels[amount]?.role];
                                const updatedID = AllIDs[config.bot.invites.levels[updatedState]?.role];

                                console.log(`${outdatedID} - ${updatedID}`);

                                if (Member.roles.cache.has(outdatedID)) {
                                    await Member.roles.remove(outdatedID)
                                }
                                
                                await Member.roles.add(updatedID)
                                const guild = member.guild;
                                const role = guild.roles.cache.get(updatedID);
            
                                if(Member.roles.cache.has(updatedID)) {
                                    const Embd = Embed({
                                        title:
                                            phrases.bot.ir.raiseLevel.embedTitle[config.language]
                                                .replace(`{user}`, Member.user.username),
                                        message:
                                            phrases.bot.ir.raiseLevel.embedMessage[config.language]
                                                .replace(`{user}`, Member)
                                                .replace(`{role}`, role)
                                                .replace(`{roles}`, role),
                                        thumbnail: Member.user.displayAvatarURL()
                                    })
                                    const ranksChannel = client.channels.cache.get(there.rank_channel_id)
                                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                    await ranksMessage.react('🔥');
                                }
                            }
                            this.welcomedMembers.delete(member.id);
                        }
                    }
                }
            }
        }
	}
}