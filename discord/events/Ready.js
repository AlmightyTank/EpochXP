// Import Packages
import colors from 'chalk'
import dotenv from 'dotenv'
import log from '../libs/logging.js'

// Import Config & Init
import config from '../../config.js'
dotenv.config()

import { InviteLink, API, eventFiles } from '../../index.js'

import statusQueue from '../events/XP_VoiceStateUpdate.js'

export default {
    name: 'ready',
    once: true,

    async execute(client) {
        console.log(colors.cyan(`\n
            [=====================================]
            [=] Development Mode: ${config.bot.dev.enabled ? "ON" : "OFF"}
            [=] Debug XP Mode: ${config.bot.xp.debug.enabled ? "ON" : "OFF"}
            [=] Debug RR Mode: ${config.bot.reaction.debug.enabled ? "ON" : "OFF"}
            [=] Debug WB Mode: ${config.bot.wavingback.debug.enabled ? "ON" : "OFF"}

            [=] Logged In As: ${client.user.tag}
            [=] API: ${API.status} | http://${config.api.ip}:${config.api.port}
            [=] Loaded ${client.commands.size} Commands && ${eventFiles.length} Events

            [=] Statistics:
            > Users: ${client.users.cache.size}
            > Channels: ${client.channels.cache.size} 
            > Servers: ${client.guilds.cache.size}

            [=] Invite Link: ${InviteLink}
            [=====================================]
        `))

        client.user.setActivity(
            config.bot.status.text
                .replace(`{members}`, client.guilds.cache.map(g => g.memberCount).reduce((a,b) => a + b, 0))
                .replace(`{channels}`, client.channels.cache.size)
                .replace(`{guilds}`, client.guilds.cache.size),
            { type: config.bot.status.type }
        )

        const queue = statusQueue.statusQueue;
        setInterval(() => {
            if (config.bot.wavingback.debug.enabled) {
                console.log(colors.cyan(`\n
            [=====================================]
            [=] Checking status queue...
            [=] Current Activity: ${client.user.presence.activities[0].name}
            [=] Full Queue: ${queue}
            [=] First Item: ${queue[0]}
            [=====================================]
                `))
            }
            if (queue.length > 0 && !client.user.presence.activities.some(activity => activity.name === queue[0])) {
                client.user.setActivity(queue[0], { type: config.bot.status.type });
                queue.shift();
                config.bot.wavingback.debug.enabled && console.log(colors.cyan(`            [=] First Item after RM: ${queue[0]}`));
                setTimeout(() => {
                    if (queue.length === 0) {
                    client.user.setActivity(
                        config.bot.status.text
                        .replace(`{members}`, client.guilds.cache.map(g => g.memberCount).reduce((a,b) => a + b, 0))
                        .replace(`{channels}`, client.channels.cache.size)
                        .replace(`{guilds}`, client.guilds.cache.size),
                        { type: config.bot.status.type }
                    );
                    }
                }, 10000); // Change back to original status after 10 seconds if the queue is empty
            }
        }, 10000); // Check the queue every 10 seconds
    }
}