import { SlashCommandBuilder } from '@discordjs/builders'
import { client } from '../../index.js'

import Embed from '../libs/embed.js'
import phrases from '../../translation.js'
import config from '../../config.js'
import fs from 'fs'

export default {
    name: 'reactions',
    description: phrases.bot.commands.reactions.description[config.language],
    
	register() {
        const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)
        .addStringOption(option => option.setName('command').setRequired(true).setDescription(phrases.bot.commands.reactions.command[config.language]))
        .addStringOption(option => option.setName('arg').setDescription(phrases.bot.commands.reactions.arg[config.language]))

        .toJSON();
        return data;
    },

	async execute(interaction) {
        if (!interaction.member.roles.cache.some(r=>["📁Mod", "🗄️Admin"].includes(r.name))) {
            interaction.reply({content: `You do not have permission to use this command.`, ephemeral: true });
            return;
        }

        const command = interaction.options.getString('command');

        const args = interaction.options.getString('arg').slice().trim().split(/ +/);

        const guildId = interaction.guild.id;

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

        if (command === 'addreactionrole' || command === 'arr') {
      
            const [channelID, messageID, ...rest] = args;
            const reactions = rest.filter((arg) => arg.startsWith('<')).map((arg) => arg.replace(/[<:>0-9]/g, ''));
            const roleIDs = rest.filter((arg) => !arg.startsWith('<'));
        
            if (reactions.length !== roleIDs.length) {
                interaction.reply({content: `The number of reactions and role IDs must be the same.`, ephemeral: true });
                return;
            }

            if (!reactions.length || !roleIDs.length) {
                interaction.reply({content: 'The number of reactions and role IDs must be at least one.', ephemeral: true });
                return;
            }

            const guild = await client.guilds.fetch(guildId);
            const channel = guild.channels.cache.get(channelID);
            const message = await channel.messages.fetch(messageID);

            if (!channel) {
                interaction.reply({content: `I could not find the channel with ID ${channelID}.`, ephemeral: true });
                return;
            }
        
            reactionRoles.roles.push({
                guildId,
                channelID,
                messageID,
                reactions,
                roleIDs,
            });
        
            fs.writeFile(REACTION_ROLES_FILE, JSON.stringify(reactionRoles), (err) => {
                if (err) {
                    console.error(err);
                        interaction.reply({content: 'An error occurred while writing to the reactionRoles.json file.', ephemeral: true });
                } else {
                    interaction.reply({content: 'The new reaction role was successfully added!', ephemeral: true });
                }
            });
        }

        if (command === 'removereactionrole' || command === 'rrr') {
      
            const [channelID, messageID, ...rest] = args;
            const reactions = rest.filter((arg) => arg.startsWith('<')).map((arg) => arg.replace(/[<:>0-9]/g, ''));
        
            if (reactions.length === 0) {
                interaction.reply({content: 'Please specify at least one reaction to remove.', ephemeral: true });
                return;
            }
          
            const index = reactionRoles.roles.findIndex((rr) =>
                rr.guildId === guildId &&
                rr.channelID === channelID &&
                rr.messageID === messageID &&
                reactions.every((r) => rr.reactions.includes(r))
            );
          
            if (index < 0) {
                interaction.reply({content: 'Could not find the specified reaction role.', ephemeral: true });
                return;
            }

            const guild = await client.guilds.fetch(guildId);
            const channel = guild.channels.cache.get(channelID);

            if (!channel) {
                interaction.reply({content: `I could not find the channel with ID ${channelID}.`, ephemeral: true });
                return;
            }
          
            reactionRoles.roles.splice(index, 1);
          
            fs.writeFile(REACTION_ROLES_FILE, JSON.stringify(reactionRoles), (err) => {
                if (err) {
                    console.error(err);
                    interaction.reply({content: 'An error occurred while writing to the reactionRoles.json file.', ephemeral: true });
                } else {
                    interaction.reply({content: 'The reaction role was successfully removed!', ephemeral: true });
                }
            });
        }
	}
}