import config from '../../config.js'
import Query from '../../functions/Query.js'
import phrases from '../../translation.js'
import generateXP from '../../functions/generateXP.js'
import { client } from '../../index.js'
import Embed from '../libs/embed.js'
import colors from 'chalk'

//const joinTimes = new Map();
const statusQueue = [];

export default {
    name: 'voiceStateUpdate',
    statusQueue,
    async execute(oldState, newState) {
        
        if(!config.bot.xp.enablevoice) return;
        if (oldState.member.user.bot) return; // ignore bots

        if (oldState.channel && !newState.channel) {
            //Watching AlmightyTank leave VC! We'll cya later!!
            statusQueue.push(`${oldState.member.user.username} leave ${oldState.channel.name} VC! We'll cya later!`);
            config.bot.wavingback.debug.enabled && console.log(statusQueue);

            await Query(`SELECT join_time FROM ${config.mysql.tables.voice} WHERE guildId = '${oldState.guild.id}' AND user_id = '${oldState.member.id}'`, async (err, rows) => {
                if (err) throw err;
                if (rows.length === 1) {
                    const joinTime = new Date(rows[0].join_time);

                    if (joinTime) {

                        const timeInVoiceChannel = Math.round((new Date() - joinTime) / 1000 / 60);
    
                        // Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
                        let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [oldState.member.id, oldState.guild.id])
                        if(state.results.length < 1) // User Doesn't Exist =>
                            return await Query(`INSERT INTO ${config.mysql.tables.xp} (guildId, userId, amount, level) VALUES (?, ?, ?, 0)`, [oldState.guild.id, oldState.member.id, generateXP()])
                        
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
                            console.log(colors.magenta(`            [=] ${oldState.member.user.tag} left voice channel "${oldState.channel.name}" after ${timeInVoiceChannel} minutes and earned ${earnedXP} exp. Now needs ${xpToNextLevel} more XP to reach level ${nextLevel.level}.`))
                        }

                        if(config.bot.xp.levels.enabled && newLevel.level != currentLevel) {
                            const row = await Query(`SELECT xp_role_ids, rank_channel_id FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [oldState.guild.id]);
                            const AllIDs = row.results[0].xp_role_ids.split(',');
                            const oldID = AllIDs[oldLevel.role];
                            const newID = AllIDs[newLevel.role];

                            // Update his new level
                            await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ?, level = ? WHERE userId = ? AND guildId = ?`, [updatedXP, newLevel.level, newState.member.id, newState.guild.id])
                            
                            let role = phrases.bot.xp.raiseLevel.noRole[config.language]
                            if(config.bot.xp.levels.removeAllRoles) {
                                if (oldLevel === undefined || oldLevel === null || oldLevel === "" || oldLevel.role === undefined  || oldLevel.role === null  || oldLevel.role === "" || newLevel.role === oldLevel.role) {
                                    //They have no old roles
                                } else {
                                    role = oldState.guild.roles.cache.find(r => r.id === oldID)
                                    oldState.member.roles.remove(role)
                                }
                            }
                            
                            // Give him the new role
                            if(newLevel.role) {
                                if (!oldState.member.roles.cache.has(newID)) {
                                    role = oldState.guild.roles.cache.find(r => r.id === newID)
                                    oldState.member.roles.add(role)
                                } else {
                                    if (config.bot.xp.debug.enabled) {
                                        console.log(colors.red(`            [=] Nope, They already have this role.`))
                                    }
                                }
                            }

                            if (newLevel.bonus) {
                                role = oldState.guild.roles.cache.find(r => r.id === newID)
                                // Send an embed
                                const Embd = Embed({
                                    title:
                                        phrases.bot.xp.raiseLevel.embedTitle[config.language]
                                            .replace(`{level}`, newLevel.level)
                                            .replace(`{user}`, oldState.member.user.username),
                                    message:
                                        phrases.bot.xp.raiseLevel.embedMessage[config.language]
                                            .replace(`{xp}`, earnedXP)
                                            .replace(`{xpToNextLevel}`, xpToNextLevel)
                                            .replace(`{nextLevel}`, nextLevel.level)
                                            .replace(`{user}`, oldState.member)
                                            .replace(`{role}`, role)
                                            .replace(`{bonus}`, newLevel.bonus ? newLevel.bonus : phrases.bot.xp.raiseLevel.noBonus[config.language]),
                                    thumbnail: oldState.member.user.displayAvatarURL()
                                })
                                const ranksChannel = client.channels.cache.get(row.results[0].rank_channel_id)
                                const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                await ranksMessage.react('🔥');
                            } else if (!oldState.member.roles.cache.has(r => r.id === newID)) {
                                if (oldLevel === undefined || oldLevel === null || oldLevel === "" || oldLevel.role === undefined  || oldLevel.role === null  || oldLevel.role === "" || newLevel.role === oldLevel.role) {
                                    // Send an embed
                                    const Embd = Embed({
                                        title:
                                            phrases.bot.xp.raiseLevelnR.embedTitle[config.language]
                                                .replace(`{level}`, newLevel.level)
                                                .replace(`{user}`, oldState.member.user.username),
                                        message:
                                            phrases.bot.xp.raiseLevelnR.embedMessage[config.language]
                                                .replace(`{xp}`, earnedXP)
                                                .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                .replace(`{nextLevel}`, nextLevel.level)
                                                .replace(`{user}`, oldState.member),
                                        thumbnail: oldState.member.user.displayAvatarURL()
                                    })
                                    const ranksChannel = client.channels.cache.get(row.results[0].rank_channel_id)
                                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                    await ranksMessage.react('🔥');
                                } else {
                                    role = oldState.guild.roles.cache.find(r => r.id === newID)
                                    // Send an embed
                                    const Embd = Embed({
                                        title:
                                            phrases.bot.xp.raiseLevelnB.embedTitle[config.language]
                                                .replace(`{level}`, newLevel.level)
                                                .replace(`{user}`, oldState.member.user.username),
                                        message:
                                            phrases.bot.xp.raiseLevelnB.embedMessage[config.language]
                                                .replace(`{xp}`, earnedXP)
                                                .replace(`{xpToNextLevel}`, xpToNextLevel)
                                                .replace(`{nextLevel}`, nextLevel.level)
                                                .replace(`{user}`, oldState.member)
                                                .replace(`{role}`, role),
                                        thumbnail: oldState.member.user.displayAvatarURL()
                                    })
                                    const ranksChannel = client.channels.cache.get(row.results[0].rank_channel_id)
                                    const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                    await ranksMessage.react('🔥');
                                }
                            } else {
                                // Send an embed
                                const Embd = Embed({
                                    title:
                                        phrases.bot.xp.raiseLevelnR.embedTitle[config.language]
                                            .replace(`{level}`, newLevel.level)
                                            .replace(`{user}`, oldState.member.user.username),
                                    message:
                                        phrases.bot.xp.raiseLevelnR.embedMessage[config.language]
                                            .replace(`{xp}`, earnedXP)
                                            .replace(`{xpToNextLevel}`, xpToNextLevel)
                                            .replace(`{nextLevel}`, nextLevel.level)
                                            .replace(`{user}`, oldState.member),
                                    thumbnail: oldState.member.user.displayAvatarURL()
                                })
                                const ranksChannel = client.channels.cache.get(row.results[0].rank_channel_id)
                                const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                                await ranksMessage.react('🔥');
                            }
                        } else {
                            await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ? WHERE userId = ? AND guildId = ?`, [updatedXP, oldState.member.id, oldState.guild.id])
                        }
                    } 

                    // delete the user's join time from the database
                    await Query(`DELETE FROM ${config.mysql.tables.voice} WHERE guildId = '${oldState.guild.id}' AND user_id = '${oldState.member.id}'`, (err) => {
                        if (err) throw err;
                    });
                }
            });				
        } else if (newState.channel && !oldState.channel) {
            //Watching AlmightyTank jump into VC!!
            statusQueue.push(`${newState.member.user.username} jump into ${newState.channel.name} VC!!`);
            config.bot.wavingback.debug.enabled && console.log(statusQueue);

            const joinTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // convert to MySQL datetime format
            const join = await Query(`SELECT join_time FROM ${config.mysql.tables.voice} WHERE user_id = ? AND guildId = ?`, [newState.member.id, newState.guild.id])
            if (!join.results[0]) {
                return await Query(`INSERT INTO ${config.mysql.tables.voice} (guildId, user_id, join_time) VALUES ('${newState.guild.id}', '${newState.member.id}', '${joinTime}')`, (err) => {
                    if (err) throw err;
                        if (config.bot.xp.debug.enabled) {
                            console.log(colors.magenta(`            [=] ${newState.member.user.tag} joined voice channel "${newState.channel.name}" at ${joinTime}`))
                        }
                });
            } else {
                if (join.results[0].join_time == joinTime) {
                    console.log(colors.magenta(`            [=] User already exists in Voice table: ${newState.member.id}`))
                } else if (join.results[0].join_time < joinTime) {
                    // Existing join_time is earlier than the new joinTime
                    console.log(colors.magenta(`            [=] Existing record in Voice table with earlier join_time: ${join.results[0].join_time}`))
                    
                    // Update the join_time in the database
                    await Query(`UPDATE ${config.mysql.tables.voice} SET join_time = ? WHERE userId = ? AND guildId = ?`, [joinTime, newState.member.id, newState.guild.id])
                    // Execute the update query using your MariaDB client
      
                    console.log(colors.magenta(`            [=] Updated join_time to: ${joinTime}`))
                } else {
                    // Existing join_time is later than the new joinTime
                    console.log(colors.magenta(`            [=] Existing record in Voice table with later join_time: ${join.results[0].join_time}`))
                }      
            }
            // Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
            let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [newState.member.id, newState.guild.id])
            if(state.results.length < 1) // User Doesn't Exist =>
                return await Query(`INSERT INTO ${config.mysql.tables.xp} (guildId, userId, amount, level) VALUES (?, ?, ?, 0)`, [newState.guild.id, newState.member.id, generateXP()])
            
            // User Exist =>
            state = state.results[0]
        } else if (!newState.channel && !oldState.channel) {
            // Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
            let state = await Query(`SELECT amount, level FROM ${config.mysql.tables.xp} WHERE userId = ? AND guildId = ?`, [newState.member.id, newState.guild.id])
            if(state.results.length < 1) // User Doesn't Exist =>
                return await Query(`INSERT INTO ${config.mysql.tables.xp} (guildId, userId, amount, level) VALUES (?, ?, ?, 0)`, [newState.guild.id, newState.member.id, generateXP()])
            
            // User Exist =>
            state = state.results[0]

            const genXP = generateXP()
            let updatedXP = genXP + state.amount

            const currentLevel = state.level
            const newLevel = config.bot.xp.levels.levels.filter(levels => updatedXP >= levels.xp).slice(-1)[0]
            const oldLevel = config.bot.xp.levels.levels.filter(levels => state.amount >= levels.xp).slice(-1)[0]

            const row = await Query(`SELECT xp_role_ids AND rank_channel_id FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [message.guild.id]);
            const AllIDs = row.results[0].xp_role_ids.split(',');
            const oldID = AllIDs[oldLevel.role];
            const newID = AllIDs[newLevel.role];

            if (config.bot.xp.debug.enabled) {
                console.log(colors.magenta(`            [=] ${newState.member.user.tag} left voice channel "${newState.channel.name}" after ${timeInVoiceChannel} minutes and now has ${updatedXP} exp`))
            }

            if(config.bot.xp.levels.enabled && newLevel && newLevel.level != currentLevel) {
                // Update his new level
                await Query(`UPDATE ${config.mysql.tables.xp} SET amount = ?, level = ? WHERE userId = ? AND guildId = ?`, [updatedXP, newLevel.level, newState.member.id, newState.guild.id])
                
                let role = phrases.bot.xp.raiseLevel.noRole[config.language]
                if(config.bot.xp.levels.removeAllRoles) {
                    if (oldLevel.role === null) {
                        //They have no old roles
                    } else if (newLevel.role === oldLevel.role) {
                        //This is the same roles
                    } else {
                        role = oldState.guild.roles.cache.find(r => r.id === oldID)
                        oldState.member.roles.remove(role)
                    }
                }
                
                // Give him the new role
                if(newLevel.role) {
                    role = newState.guild.roles.cache.find(r => r.id === newID)
                    newState.member.roles.add(role)
                }
    
                // Send an embed
                const Embd = Embed({
                    title:
                        phrases.bot.xp.raiseLevel.embedTitle[config.language]
                            .replace(`{level}`, newLevel.level)
                            .replace(`{user}`, newState.member.user.username),
                    message:
                        phrases.bot.xp.raiseLevel.embedMessage[config.language]
                            .replace(`{level}`, newLevel.level)
                            .replace(`{xp}`, updatedXP)
                            .replace(`{user}`, newState.member)
                            .replace(`{role}`, role)
                            .replace(`{bonus}`, newLevel.bonus ? newLevel.bonus : phrases.bot.xp.raiseLevel.noBonus[config.language]),
                    thumbnail: newState.member.user.displayAvatarURL()
                })
                const ranksChannel = client.channels.cache.get(row.results[0].rank_channel_id)
                const ranksMessage = await ranksChannel.send({embeds: [Embd]})
                await ranksMessage.react('🔥');
            }
        }
    }
}