// Import necessary modules
const { Client, Intents } = require('discord.js');
const mysql = require('mysql2/promise');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Create a Discord client with required intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create a MySQL connection pool
const connection = mysql.createPool({
  host: 'YOUR_DATABASE_HOST',
  user: 'YOUR_DATABASE_USER',
  password: 'YOUR_DATABASE_PASSWORD',
  database: 'YOUR_DATABASE_NAME',
});

// Global variables
const setupInfo = new Map();

// Event: When the bot is ready and logged in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event: When the bot is connected to a guild
client.on('guildCreate', async (guild) => {
  // Check if the guild ID already exists in the database
  const [rows] = await connection.execute('SELECT * FROM guild_setup WHERE guild_id = ?', [guild.id]);

  if (rows.length > 0) {
    // Guild ID already exists, fetch and store the setup information
    const setupData = rows[0];
    const guildID = setupData.guild_id;

    setupInfo.set(guildID, {
      ownerID: setupData.owner_id,
      rankChannelID: setupData.rank_channel_id,
      welcomeChannelID: setupData.welcome_channel_id,
      departureChannelID: setupData.departure_channel_id,
      xpRoleIDs: setupData.xp_role_ids.split(','),
      inviteRoleIDs: setupData.invite_role_ids.split(','),
    });

    console.log('Setup information fetched for guild', guildID);
  }
});

// Event: When an interaction is received
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  // Command: Setup
  if (interaction.commandName === 'setup') {
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
    const collector = interaction.channel.createMessageCollector({
      filter: (msg) => msg.author.id === interaction.user.id,
      max: 1,
      time: 60000,
    });

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
                setupInfo.delete(interaction.user.id);

                // Store the setup information in the database
                storeSetupInfo(guildID, setupInfo);

                // Do something with the gathered information
                console.log(`Setup info for guild ${guildID}:`, setupInfo);
              });
            });
          });
        });
      });
    });
  }
});

// Function to store the setup information in the database
async function storeSetupInfo(guildID, setupInfo) {
  // Check if the guild ID already exists in the database
  const [rows] = await connection.execute('SELECT * FROM guild_setup WHERE guild_id = ?', [guildID]);

  if (rows.length > 0) {
    // Guild ID already exists, update the setup information
    await connection.execute(
      'UPDATE guild_setup SET owner_id = ?, rank_channel_id = ?, welcome_channel_id = ?, departure_channel_id = ?, xp_role_ids = ?, invite_role_ids = ? WHERE guild_id = ?',
      [
        setupInfo.ownerID,
        setupInfo.rankChannelID,
        setupInfo.welcomeChannelID,
        setupInfo.departureChannelID,
        setupInfo.xpRoleIDs.join(','),
        setupInfo.inviteRoleIDs.join(','),
        guildID,
      ]
    );
    console.log('Setup information updated for guild', guildID);
  } else {
    // Guild ID does not exist, insert new setup information
    await connection.execute(
      'INSERT INTO guild_setup (guild_id, owner_id, rank_channel_id, welcome_channel_id, departure_channel_id, xp_role_ids, invite_role_ids) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        guildID,
        setupInfo.ownerID,
        setupInfo.rankChannelID,
        setupInfo.welcomeChannelID,
        setupInfo.departureChannelID,
        setupInfo.xpRoleIDs.join(','),
        setupInfo.inviteRoleIDs.join(','),
      ]
    );
    console.log('Setup information stored for guild', guildID);
  }
}

// Log in to the Discord bot
client.login('YOUR_BOT_TOKEN');



                  // All questions have been answered, end the setup process
                  interaction.followUp('Setup completed!');
                  const guildID = interaction.guild.id;
                  
                  // Store the setup information in the database
                  await storeSetupInfo(guildID, setupInfo);
                  
                  // Do something with the gathered information
                  console.log(`Setup info for guild ${guildID}:`, setupInfo);

                  setupInfo.delete(interaction.user.id);