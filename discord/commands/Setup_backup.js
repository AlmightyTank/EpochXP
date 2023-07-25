import { SlashCommandBuilder } from '@discordjs/builders'

import config from '../../config.js'
import phrases from '../../translation.js'
import Query from '../../functions/Query.js'
import Embed from '../libs/embed.js'

// Global variables
const setupInfo = new Map();

export default {
    name: 'setup',
    description: phrases.bot.commands.setup.description[config.language],

	register() {
    const data = new SlashCommandBuilder()
		.setName(this.name)
		.setDescription(this.description)

    return data
    },

	async execute(interaction) {
    if (interaction.user.id != interaction.user.id){
      return;
    }

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply('You must have administrator permissions to use this command.');
      return;
    }

    
    // Command: Setup
    // Get the current exp (is there a better way instead of doing 2 queries?) => check his current rank
    let state = await Query(`SELECT * FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [interaction.guild.id])
    if(state.results.length < 1) { // User Doesn't Exist =>

      // Check if the setup is already in progress for this user
      if (setupInfo.has(interaction.user.id)) {
        await interaction.reply('Setup is already in progress. Please complete the previous setup or use a different command.');
        return;
      }

      // Start the setup process
      setupInfo.set(interaction.user.id, {});

      // Ask the first question
      await interaction.reply('Please provide the ID of the server owner.');

      // Event: Listen for the user's response to the owner's ID
      const ownerIDCollector = interaction.channel.createMessageCollector({
        filter: (msg) => msg.author.id === interaction.user.id,
        max: 1,
        time: 60000,
      });

      await ownerIDCollector.on('collect', async (response) => {
        console.log(response.content)
        const ownerID = response.content;
        setupInfo.get(interaction.user.id).ownerID = ownerID;

        // Ask for the channel IDs
        interaction.followUp('Please provide the ID of the channel where ranks will be announced.');

        // Event: Listen for the user's response to the Rank Channel's ID
        const rankChannelIDCollector = interaction.channel.createMessageCollector({
          filter: (msg) => msg.author.id === interaction.user.id,
          max: 1,
          time: 60000,
        });

        // Event: Listen for the user's response to the rank channel ID
        await rankChannelIDCollector.on('collect', async (response) => {
          const rankChannelID = response.content;
          setupInfo.get(interaction.user.id).rankChannelID = rankChannelID;

          // Ask for the welcome channel ID
          interaction.followUp('Please provide the ID of the welcome channel.');

          // Event: Listen for the user's response to the welcome channel ID
          const welcomeChannelIDCollector = interaction.channel.createMessageCollector({
            filter: (msg) => msg.author.id === interaction.user.id,
            max: 1,
            time: 60000,
          });

          await welcomeChannelIDCollector.on('collect', async (response) => {
            const welcomeChannelID = response.content;
            setupInfo.get(interaction.user.id).welcomeChannelID = welcomeChannelID;

            // Ask for the departure channel ID
            interaction.followUp('Please provide the ID of the departure channel.');

            // Event: Listen for the user's response to the departure channel ID
            const departureChannelIDCollector = interaction.channel.createMessageCollector({
              filter: (msg) => msg.author.id === interaction.user.id,
              max: 1,
              time: 60000,
            });

            await departureChannelIDCollector.on('collect', async (response) => {
              const departureChannelID = response.content;
              setupInfo.get(interaction.user.id).departureChannelID = departureChannelID;

              // Ask for the role IDs for XP gains
              interaction.followUp('Please provide the 8 role IDs for XP gains (separated by commas).');

              // Event: Listen for the user's response to the role IDs for XP gains
              const xpRoleIDsCollector = interaction.channel.createMessageCollector({
                filter: (msg) => msg.author.id === interaction.user.id,
                max: 1,
                time: 60000,
              });

              await xpRoleIDsCollector.on('collect', async (response) => {
                const xpRoleIDs = response.content.split(',');
                setupInfo.get(interaction.user.id).xpRoleIDs = xpRoleIDs.map((id) => id.trim());

                // Ask for the role IDs for invite count
                interaction.followUp('Please provide the 5 role IDs for invite count (separated by commas).');

                // Event: Listen for the user's response to the role IDs for invite count
                const inviteRoleIDsCollector = interaction.channel.createMessageCollector({
                  filter: (msg) => msg.author.id === interaction.user.id,
                  max: 1,
                  time: 60000,
                });

                await inviteRoleIDsCollector.on('collect', async (response) => {
                  const inviteRoleIDs = response.content.split(',');
                  setupInfo.get(interaction.user.id).inviteRoleIDs = inviteRoleIDs.map((id) => id.trim());

                  interaction.followUp('Please provide the default role for your server.');

                  const defaultRoleIDsCollector = interaction.channel.createMessageCollector({
                    filter: (msg) => msg.author.id === interaction.user.id,
                    max: 1,
                    time: 60000,
                  });

                  await defaultRoleIDsCollector.on('collect', async (response) => {
                    const defaultRoleID = response.content;
                    setupInfo.get(interaction.user.id).defaultRoleID = defaultRoleID;
  
                    // All questions have been answered, end the setup process
                    interaction.followUp('Setup completed!');
                    const guildID = interaction.guild.id;
                    
                    // Store the setup information in the database
                    await storeSetupInfo(guildID, setupInfo);
                    
                    // Do something with the gathered information
                    console.log(`Setup info for guild ${guildID}:`, setupInfo);
  
                    setupInfo.delete(interaction.user.id);
                  });
                });
              });
            });
          });
        });
      });
    } else if (state.results.length > 0) {
      const existingSetup = state.results[0];
      const existingOwnerID = existingSetup.owner_id;
    
      // Check if the ownerID matches the user using the interaction
      if (existingOwnerID === interaction.user.id) {
        // The ownerID matches, ask if they want to overwrite the current settings
        await interaction.reply('You already have an existing setup. Do you want to overwrite the current settings?');
        
        // Event: Listen for the user's response to overwrite the current settings
        const collector = interaction.channel.createMessageCollector({
          filter: (msg) => msg.author.id === interaction.user.id && !msg.author.bot,
          max: 1,
          time: 60000,
        });
    
        collector.on('collect', async (response) => {
          const answer = response.content.toLowerCase();
          if (answer === 'yes' || answer === 'y') {
            // User wants to overwrite the current settings
            setupInfo.set(interaction.user.id, {});
    
            // Proceed with the setup process (similar to the initial setup)
            // Ask the first question      
            collector.on('collect', (response) => {
              const ownerID = response.content;
              setupInfo.get(interaction.user.id).ownerID = ownerID;
      
              // Ask for the channel IDs
              interaction.followUp('Please provide the ID of the channel where ranks will be announced.');
      
              // Event: Listen for the user's response to the rank channel ID
              collector.on('collect', (response) => {
                const rankChannelID = response.content;
                setupInfo.get(interaction.user.id).rankChannelID = rankChannelID;
      
                // Ask for the welcome channel ID
                interaction.followUp('Please provide the ID of the welcome channel.');
      
                // Event: Listen for the user's response to the welcome channel ID
                collector.on('collect', (response) => {
                  const welcomeChannelID = response.content;
                  setupInfo.get(interaction.user.id).welcomeChannelID = welcomeChannelID;
      
                  // Ask for the departure channel ID
                  interaction.followUp('Please provide the ID of the departure channel.');
      
                  // Event: Listen for the user's response to the departure channel ID
                  collector.on('collect', (response) => {
                    const departureChannelID = response.content;
                    setupInfo.get(interaction.user.id).departureChannelID = departureChannelID;
      
                    // Ask for the role IDs for XP gains
                    interaction.followUp('Please provide the 8 role IDs for XP gains (separated by commas).');
      
                    // Event: Listen for the user's response to the role IDs for XP gains
                    collector.on('collect', (response) => {
                      const xpRoleIDs = response.content.split(',');
                      setupInfo.get(interaction.user.id).xpRoleIDs = xpRoleIDs.map((id) => id.trim());
      
                      // Ask for the role IDs for invite count
                      interaction.followUp('Please provide the 5 role IDs for invite count (separated by commas).');
      
                      // Event: Listen for the user's response to the role IDs for invite count
                      collector.on('collect', (response) => {
                        const inviteRoleIDs = response.content.split(',');
                        setupInfo.get(interaction.user.id).inviteRoleIDs = inviteRoleIDs.map((id) => id.trim());
      
                        // All questions have been answered, end the setup process
                        interaction.followUp('Setup completed!');
                        const guildID = interaction.guild.id;
                        
                        // Store the setup information in the database
                        storeSetupInfo(guildID, setupInfo);
                        
                        // Do something with the gathered information
                        console.log(`Setup info for guild ${guildID}:`, setupInfo);
      
                        setupInfo.delete(interaction.user.id);
                      });
                    });
                  });
                });
              });
            });
          } else {
            // User does not want to overwrite the current settings
            await interaction.reply('Setup cancelled. Current settings remain unchanged.');
          }
        });
      } else {
        // The ownerID does not match, provide an appropriate response
        await interaction.reply('You are not the owner of the existing setup. Only the owner can modify the settings.');
      }
    }    

    // Function to store the setup information in the database
    async function storeSetupInfo(guildID, setupMap) {
      // Check if the guild ID already exists in the database
      const rows = await Query(`SELECT * FROM ${config.mysql.tables.setup} WHERE guild_id = ?`, [guildID]);

      console.log(setupMap.get(interaction.user.id));

      const setupInfo = setupMap.get(interaction.user.id);

      if (rows.length > 0) {
        // Guild ID already exists, update the setup information
        await Query(
          `UPDATE ${config.mysql.tables.setup} SET owner_id = ?, rank_channel_id = ?, welcome_channel_id = ?, departure_channel_id = ?, xp_role_ids = ?, invite_role_ids = ?, default_role_id = ? WHERE guild_id = ?`,
          [
            setupInfo.ownerID,
            setupInfo.rankChannelID,
            setupInfo.welcomeChannelID,
            setupInfo.departureChannelID,
            setupInfo.xpRoleIDs.join(','),
            setupInfo.inviteRoleIDs.join(','),
            setupInfo.defaultRoleID,
            guildID,
          ]
        );
        console.log('Setup information updated for guild', guildID);
      } else {
        // Guild ID does not exist, insert new setup information
        await Query(
          `INSERT INTO ${config.mysql.tables.setup} (guild_id, owner_id, rank_channel_id, welcome_channel_id, departure_channel_id, xp_role_ids, invite_role_ids, default_role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            guildID,
            setupInfo.ownerID,
            setupInfo.rankChannelID,
            setupInfo.welcomeChannelID,
            setupInfo.departureChannelID,
            setupInfo.xpRoleIDs.join(','),
            setupInfo.inviteRoleIDs.join(','),
            setupInfo.defaultRoleID,
          ]
        );
        console.log('Setup information stored for guild', guildID);
      }
    }
  }
}