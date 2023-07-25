import config from '../../config.js'
import Embed from '../libs/embed.js'
import { client } from '../../index.js'
import phrases from '../../translation.js'
import colors from 'chalk'
import fs from 'fs'

export default {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if(!config.bot.reaction.enabled) return;
        if(reaction.message.member?.user?.bot) return;

        if (config.bot.reaction.debug.enabled) {
            console.log(colors.yellow(`            [=] ${reaction.emoji.name} reaction is added to a message`));
        }
        
        const REACTION_ROLES_FILE = './data/reactionRoles.json';
        let reactionRoles = [];
        try {
            if (fs.existsSync(REACTION_ROLES_FILE)) {
            const data = fs.readFileSync(REACTION_ROLES_FILE, 'utf8');
            reactionRoles = JSON.parse(data);
            } else {
            console.log(`No ${REACTION_ROLES_FILE} file found.`);
            }
        } catch (err) {
            console.error(err);
        }

        const rr = reactionRoles.roles.find((rr) => rr.guildId === reaction.message.guild.id && rr.messageID === reaction.message.id && rr.channelID === reaction.message.channel.id && rr.reactions.includes(reaction.emoji.name));
        
        if (rr) {
                config.bot.reaction.debug.enabled && console.log(colors.yellow('            [=] Found a match'));
                const guild = reaction.message.guild;
                const member = await guild.members.fetch(user.id);

                // Remove other roles and reactions for this message if they exist
                for (let i = 0; i < rr.reactions.length; i++) {
                    if (rr.reactions[i] !== reaction.emoji.name) {
                    const role = guild.roles.cache.get(rr.roleIDs[i]);
                    await member.roles.remove(role);
                    const otherReaction = reaction.message.reactions.cache.find((r) => r.emoji.name === rr.reactions[i]);
                        if (otherReaction) {
                            await otherReaction.users.remove(user);
                        }
                    }
                }

                // Add the role for this reaction
                const role = guild.roles.cache.get(rr.roleIDs[rr.reactions.indexOf(reaction.emoji.name)]);
                await member.roles.add(role);

                if (member.roles.cache.some(role => role.id === rr.roleIDs[rr.reactions.indexOf(reaction.emoji.name)])) {
                    // Send an embed
                    const Embd = Embed({
                        title:
                            phrases.bot.rr.raiseLevel.embedTitle[config.language]
                                .replace(`{user}`, user.username),
                        message:
                            phrases.bot.rr.raiseLevel.embedMessage[config.language]
                                .replace(`{role}`, role),
                        thumbnail: user.displayAvatarURL()
                    })
                    const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                    await ranksMessage.react('🔥');
                } else {
                    // Do something if the member doesn't have the role  
                    if (config.bot.reaction.debug.enabled) {
                        console.log(colors.yellow(`            [=] They already have that role`))
                    }
                }
        } else {
            if (config.bot.reaction.debug.enabled) {
                console.log(colors.red(`            [=] No match found`))
            }
        }
    }	  
}