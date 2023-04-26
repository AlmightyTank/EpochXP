import config from '../../config.js'
import Query from '../../functions/Query.js'
import phrases from '../../translation.js'
import generateXP from '../../functions/generateXP.js'
import Embed from '../libs/embed.js'
import colors from 'chalk'

//const joinTimes = new Map();

export default {
    name: 'ready',
    once: true,

    async execute(client) {
        if(!config.bot.xp.enablevoice) return;
        console.log(colors.cyan(`            [=] Checking voice channels...`));

        //const stillhere = await Query(`SELECT guildId, user_id, join_time FROM ${config.mysql.tables.voice}`);

        await Query(`SELECT guildId, user_id, join_time FROM ${config.mysql.tables.voice}`, async (err, rows) => {
            if (err) throw err;
            if (rows.length > 0) {

                let counter = 0;

                rows.forEach(async (row, i) => {

                    setTimeout(async () => {

                        const guildId = row.guildId;
                        const userId = row.user_id;
                        const joinTime = new Date(row.join_time);

                        const guild = await client.guilds.cache.get(guildId); // Get the guild object for the user
                        const member = await guild.members.cache.get(userId); // Get the member object for the user
                        
                        if (!member.voice.channel) {

                            const timeInVoiceChannel = Math.round((new Date() - joinTime) / 1000 / 60);

                            // Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
                            let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [userId, guildId])
                            if(state.results.length < 1) // User Doesn't Exist =>
                                return await Query(`INSERT INTO ${config.mysql.tables.xp} (guildId, userId, amount, level) VALUES (?, ?, ?, 0)`, [guildId, userId, generateXP()])
                            
                            // User Exist =>
                            state = state.results[0]

                            const genXP = generateXP()
                            let updatedXP = genXP + state.amount
                            
                            updatedXP = timeInVoiceChannel > 1 ? updatedXP + config.bot.xp.generation.voice * timeInVoiceChannel : updatedXP

                            let earnedXP = updatedXP - state.amount

                            const currentLevel = state.level
                            const newLevel = config.bot.xp.levels.levels.filter(levels => updatedXP >= levels.xp).slice(-1)[0]
                            const oldLevel = config.bot.xp.levels.levels.filter(levels => state.amount >= levels.xp).slice(-1)[0]
                            const nextLevel = config.bot.xp.levels.levels.find(lvl => lvl.xp > updatedXP)
                            
                            const xpToNextLevel = nextLevel.xp - updatedXP
                            
                            if (config.bot.xp.debug.enabled) {
                                console.log(colors.magenta(`            [=] ${member.user.tag} left voice channel after ${timeInVoiceChannel} minutes and earned ${earnedXP} exp. Now needs ${xpToNextLevel} more XP to reach level ${nextLevel.level}.`))
                            }

                            if(config.bot.xp.levels.enabled && newLevel && newLevel.level != currentLevel) {
                                // Update his new level
                                await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ?, level = ? WHERE userId = ? AND guildId = ?`, [updatedXP, newLevel.level, userId, guildId])
                                
                                let role = phrases.bot.xp.raiseLevel.noRole[config.language]
                                if(config.bot.xp.levels.removeAllRoles) {
                                    if (oldLevel === undefined || oldLevel === null || oldLevel === "" || oldLevel.role === undefined  || oldLevel.role === null  || oldLevel.role === "" || newLevel.role === oldLevel.role) {
                                        //They have no old roles
                                    } else {
                                        role = guild.roles.cache.find(r => r.id === oldLevel.role)
                                        member.roles.remove(role)
                                    }
                                }

                                // Give him the new role
                                if(newLevel.role) {
                                    if (!member.roles.cache.has(newLevel.role)) {
                                        const role = guild.roles.cache.find(r => r.id === newLevel.role); // Find the role with the matching id
                                        member.roles.add(role)
                                    } else {
                                        if (config.bot.xp.debug.enabled) {
                                            console.log(colors.red(`            [=] Nope, They already have this role.`))
                                        }
                                    }
                                }

                                if(newLevel.bonus) {
                                    const role = guild.roles.cache.find(r => r.id === newLevel.role); // Find the role with the matching id
                                    // Send an embed
                                    const Embd = Embed({
                                        title:
                                            phrases.bot.xp.raiseLevel.embedTitle[config.language]
                                                .replace(`{level}`, newLevel.level)
                                                .replace(`{user}`, member.user.username),
                                        message:
                                            phrases.bot.xp.raiseLevel.embedMessage[config.language]
                                                .replace(`{xp}`, earnedXP)
                                                .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                .replace(`{nextLevel}`, nextLevel.level)
                                                .replace(`{user}`, member)
                                                .replace(`{role}`, role)
                                                .replace(`{bonus}`, newLevel.bonus ? newLevel.bonus : phrases.bot.xp.raiseLevel.noBonus[config.language]),
                                        thumbnail: member.user.displayAvatarURL()
                                    })
                                    const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
                                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                    await ranksMessage.react('🔥');
                                } else if (!guild.roles.cache.has(r => r.id === oldLevel.role)) {
                                    if (oldLevel === undefined || oldLevel === null || oldLevel === "" || oldLevel.role === undefined  || oldLevel.role === null  || oldLevel.role === "" || newLevel.role === oldLevel.role) {
                                        // Send an embed
                                        const Embd = Embed({
                                            title:
                                                phrases.bot.xp.raiseLevelnR.embedTitle[config.language]
                                                    .replace(`{level}`, newLevel.level)
                                                    .replace(`{user}`, member.user.username),
                                            message:
                                                phrases.bot.xp.raiseLevelnR.embedMessage[config.language]
                                                    .replace(`{xp}`, earnedXP)
                                                    .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                    .replace(`{nextLevel}`, nextLevel.level)
                                                    .replace(`{user}`, member),
                                            thumbnail: member.user.displayAvatarURL()
                                        })
                                        const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
                                        const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                        await ranksMessage.react('🔥');
                                    } else {
                                        const role = guild.roles.cache.find(r => r.id === newLevel.role); // Find the role with the matching id
                                        // Send an embed
                                        const Embd = Embed({
                                            title:
                                                phrases.bot.xp.raiseLevelnB.embedTitle[config.language]
                                                    .replace(`{level}`, newLevel.level)
                                                    .replace(`{user}`, member.user.username),
                                            message:
                                                phrases.bot.xp.raiseLevelnB.embedMessage[config.language]
                                                    .replace(`{xp}`, earnedXP)
                                                    .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                    .replace(`{nextLevel}`, nextLevel.level)
                                                    .replace(`{user}`, member)
                                                    .replace(`{role}`, role),
                                            thumbnail: member.user.displayAvatarURL()
                                        })
                                        const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
                                        const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                        await ranksMessage.react('🔥');
                                    } 
                                } else {
                                    // Send an embed
                                    const Embd = Embed({
                                        title:
                                            phrases.bot.xp.raiseLevelnR.embedTitle[config.language]
                                                .replace(`{level}`, newLevel.level)
                                                .replace(`{user}`, member.user.username),
                                        message:
                                            phrases.bot.xp.raiseLevelnR.embedMessage[config.language]
                                                .replace(`{xp}`, earnedXP)
                                                .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                .replace(`{nextLevel}`, nextLevel.level)
                                                .replace(`{user}`, member),
                                        thumbnail: member.user.displayAvatarURL()
                                    })
                                    const ranksChannel = client.channels.cache.get(config.ranks.discordChannel)
                                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                    await ranksMessage.react('🔥');
                                }
                            }
                            else
                                await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ? WHERE userId = ? AND guildId = ?`, [updatedXP, userId, guildId])
                                // delete the user's join time from the database
                                await Query(`DELETE FROM ${config.mysql.tables.voice} WHERE guildId = '${guildId}' AND user_id = '${userId}'`, (err) => {
                                    if (err) throw err;
                                });
                        } else if (member.voice.channel) {
                            // user is still in the voice channel, update their join time in the database
                            console.log(colors.cyan(`            [=] ${member.user.tag} is accounted for`));
                            counter++;
                            if (counter === rows.length) {
                                const memberWord = rows.length === 1 ? 'member' : 'members';
                                console.log(colors.cyan(`            [=] Checked all ${rows.length} ${memberWord}`));
                            }
                        }
                    }, 6000 * i)
                });
            }
        });
    }
}