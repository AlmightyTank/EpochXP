// Import Packages
import config from '../../config.js'
import colors from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import log from '../libs/logging.js'

// Import Config & Init
dotenv.config()

export default {
    name: 'ready',
    once: true,

    async execute(client) {
        // Read the reactionRoles data from the JSON file
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

        console.log(colors.cyan(`            [=] Loading Reaction Messages`));

        let counter = 0;

        reactionRoles.roles.forEach((roles, i) => {
            setTimeout(async () => {
                const guild = await client.guilds.fetch(roles.guildId);
                const channel = guild.channels.cache.get(roles.channelID);
                const message = await channel.messages.fetch(roles.messageID);
                if (config.bot.reaction.debug.enabled) {
                    console.log(colors.cyan(`            [=] Loading Reaction Message ${i+1}`));
                }
                counter++;

                if (counter === reactionRoles.roles.length) {
                    await new Promise(resolve => setTimeout(resolve, 6000 * i)); // wait for 15 minutes
                    console.log(colors.cyan(`            [=] Loaded ${reactionRoles.roles.length} reaction roles.`));
                }
            }, 6000 * i)
        });
    }
}