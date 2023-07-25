const config = {
    language: "en", // Language phrase, please make sure the language exists!

    api: {
        /* Please note that the current API routes AREN'T PROTECTED!
           Please do not enable the API unless you use it! */
        enabled: false,
        ip: "locahost",
        port: 6000
    },

    logging: {
        discordChannel: "1093613654387195996", // Channel id / NULL
        console: true, // If the process should log to the console too
        mysql: true, // Log mysql queries
        invites: true, // Log the Invites System
        xp: true // Log the XP System
    },

    ranks: {
        discordChannel: "972229559686676483", // Channel id / NULL
    },

    traderreset: {
        discordChannel: "1028110120317616218", // Channel id / NULL
    },

    bot: {
        status: {
            /*
                @members
                @channels
                @guilds
            */
            text: ":D | [{members}] Members",
            type: "WATCHING"
        },
        embedSettings: {
            // Default embed values!
            color: "#408cd8",
            footerText: "EpochXP#8350",
            footerIcon: "https://cdn.discordapp.com/avatars/1079156251189059604/82fb4e1f7d8f8f8b1a6020ae15bae71f.webp"
        },
        dev: {
            enabled: false,                  // true = enabled, false = disabled
            guildId: "972229559233695814",  // The Guild where you want to commands only work in, during this time
            clients: ["613545019663712261"] // The clients that can use the bot during this time
        },
        main: {

        },
        maps: {
            enabled: false,
        },
        voice: {
            enabled: true,
        },
        setup: {
            enabled: true,
        },
        invitelinks: {
            enabled: true,
        },
        newroleadd: {
            enabled: true,
            discordChannel: "972229559862849566",
            role: "972229559233695817",
        },
        newrolerm: {
            enabled: true,
            discordChannel: "972229559338553362",
        },
        reaction: {
            enabled: true,
            debug: {
                enabled: false,
            },
        },
        wavingback: {
            enabled: true,
            debug: {
                enabled: false,
            },
        },
        xp: {
            enabled: true,              // true = Enable the XP System / false = Disable the XP System
            enablevoice: true,
            createRowOnAdd: true,       // Optional! Create DB Entry for each member joining your server.
            deleteRowOnRemove: false,   // Optional! Delete DB Entry for each member leaving your server = reset his exp!
            generation: {
                min: 10,              // Minimum XP to give for ea message
                max: 20,              // Maximum XP to give for ea message
                attachmentBonus: 30,  // Amount of XP to give for each attachment (pictures, etc)
                voice: 2,
                delay: 3 * 1000       // Seconds * Miliseconds
            },
            commands: {
                top: {
                    limit: 10
                }
            },
            debug: {
                enabled: true,
            },
            levels: {
                enabled: true,
                removeAllRoles: true, // true = Clear all member "levels" roles before adding the new level role, false = just give him the new level role and keep the others
                levels: [
                    {
                        level: 0,
                        xp: 0,
                        role: 0,     //Mosin Maniacs
                        bonus: null                     
                    },
                    {
                        level: 1,
                        xp: 10,
                        role: 0,     //Mosin Maniacs
                        bonus: null                     
                    },
                    {
                        level: 2,                       // Level number
                        xp: 50,                         // The needed XP for this level
                        role: 0,     // Role ID or null
                        bonus: null                     // Bonus as text or null
                    },
                    {
                        level: 3,
                        xp: 100,
                        role: 0,
                        bonus: null
                    },
                    {
                        level: 4,
                        xp: 200,
                        role: 0,
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 5,
                        xp: 300,
                        role: 1,     //Flechette Master
                        bonus: null
                    },
                    {
                        level: 6,
                        xp: 400,
                        role: 1,
                        bonus: null
                    },
                    {
                        level: 7,
                        xp: 600,
                        role: 1,
                        bonus: null
                    },
                    {
                        level: 8,
                        xp: 800,
                        role: 1,
                        bonus: null
                    },
                    {
                        level: 9,
                        xp: 1000,
                        role: 1,
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 10,
                        xp: 1250,
                        role: 2,     //Hatchet Warrior
                        bonus: null
                    },
                    {
                        level: 11,
                        xp: 1500,
                        role: 2,
                        bonus: null
                    },
                    {
                        level: 12,
                        xp: 2000,
                        role: 2,
                        bonus: null
                    },
                    {
                        level: 13,
                        xp: 2250,
                        role: 2,
                        bonus: null
                    },
                    {
                        level: 14,
                        xp: 2500,
                        role: 2,
                        bonus: null
                    },
                    {
                        level: 15,
                        xp: 5000,
                        role: 3,     //Impact Nadder
                        bonus: null
                    },
                    {
                        level: 16,
                        xp: 7500,
                        role: 3,
                        bonus: null
                    },
                    {
                        level: 17,
                        xp: 10000,
                        role: 3,
                        bonus: null
                    },
                    {
                        level: 18,
                        xp: 12500,
                        role: 3,
                        bonus: null
                    },
                    {
                        level: 19,
                        xp: 15000,
                        role: 3,
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 20,
                        xp: 17500,
                        role: 4,     //Loot Goblins
                        bonus: null
                    },
                    {
                        level: 21,
                        xp: 20000,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 22,
                        xp: 22500,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 23,
                        xp: 25000,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 24,
                        xp: 27500,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 25,
                        xp: 30000,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 26,
                        xp: 32500,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 27,
                        xp: 35000,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 28,
                        xp: 37500,
                        role: 4,
                        bonus: null
                    },
                    {
                        level: 29,
                        xp: 40000,
                        role: 4,
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 30,
                        xp: 42500,
                        role: 5,     //A Flea Connoisseur
                        bonus: null
                    },
                    {
                        level: 31,
                        xp: 45000,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 32,
                        xp: 47500,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 33,
                        xp: 50000,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 34,
                        xp: 52500,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 35,
                        xp: 55000,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 36,
                        xp: 57500,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 37,
                        xp: 60000,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 38,
                        xp: 75000,
                        role: 5,
                        bonus: null
                    },
                    {
                        level: 39,
                        xp: 100000,
                        role: 5,
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 40,
                        xp: 125000,
                        role: 6,     //Dorms Chad
                        bonus: null
                    },
                    {
                        level: 41,
                        xp: 150000,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 42,
                        xp: 175000,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 43,
                        xp: 200000,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 44,
                        xp: 300000,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 45,
                        xp: 420420,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 46,
                        xp: 500000,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 47,
                        xp: 420420,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 48,
                        xp: 696969,
                        role: 6,
                        bonus: null
                    },
                    {
                        level: 49,
                        xp: 777777,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 50,
                        xp: 850000,
                        role: 7,    //
                        bonus: null
                    },
                    {
                        level: 51,
                        xp: 1000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 52,
                        xp: 1250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 53,
                        xp: 1500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 54,
                        xp: 1750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 55,
                        xp: 2000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 56,
                        xp: 2250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 57,
                        xp: 2500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 58,
                        xp: 2750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 59,
                        xp: 3000000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 60,
                        xp: 3250000,
                        role: 7,    //
                        bonus: null
                    },
                    {
                        level: 61,
                        xp: 3500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 62,
                        xp: 3750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 63,
                        xp: 4000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 64,
                        xp: 4250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 65,
                        xp: 4500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 66,
                        xp: 4750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 67,
                        xp: 5000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 68,
                        xp: 5250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 69,
                        xp: 5500000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 70,
                        xp: 5750000,
                        role: 7,    //
                        bonus: null
                    },
                    {
                        level: 71,
                        xp: 6000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 72,
                        xp: 6250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 73,
                        xp: 6500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 74,
                        xp: 6750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 75,
                        xp: 7000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 76,
                        xp: 7250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 77,
                        xp: 7500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 78,
                        xp: 7750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 79,
                        xp: 8000000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 80,
                        xp: 8250000,
                        role: 7,    //
                        bonus: null
                    },
                    {
                        level: 81,
                        xp: 8500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 82,
                        xp: 8750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 83,
                        xp: 9000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 84,
                        xp: 9250000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 85,
                        xp: 9500000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 86,
                        xp: 9750000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 87,
                        xp: 10000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 88,
                        xp: 12000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 89,
                        xp: 14000000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 90,
                        xp: 16000000,
                        role: 7,    //
                        bonus: null
                    },
                    {
                        level: 91,
                        xp: 18000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 92,
                        xp: 20000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 93,
                        xp: 25000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 94,
                        xp: 30000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 95,
                        xp: 40000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 96,
                        xp: 50000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 97,
                        xp: 60000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 98,
                        xp: 70000000,
                        role: 7,
                        bonus: null
                    },
                    {
                        level: 99,
                        xp: 80000000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 100,
                        xp: 100000000,
                        role: 7,     //Labs Defender
                        bonus: null
                    },
                ]
            }
        },
        invites: {
            enabled: true,
            stackRoles: false, // remove all roles when someone raise
            commands: {
                top: {
                    limit: 10
                }
            },
            levels: {
                1: {
                    role: 0
                },
                2: {
                    role: 0
                },
                3: {
                    role: 1
                },
                4: {
                    role: 1
                },
                5: {
                    role: 2
                },
                6: {
                    role: 2
                },
                7: {
                    role: 3
                },
                8: {
                    role: 3
                },
                9: {
                    role: 3
                },
                10: {
                    role: 4
                }
            }
        },
    },

    // DB Tables Name
    mysql: {
        tables: { // Tables Name
            xp: "EXP", // Please Change The Create Table Query Too!
            invites: "Invites", // Please Change The Create Table Query Too!
            maps: "Invites", // Please Change The Create Table Query Too!
            voice: "Voice", // Please Change The Create Table Query Too!
            setup: "Setup", // Please Change The Create Table Query Too!
            invitelinks: "InviteLinks" // Please Change The Create Table Query Too!
        },
        queries: { // Create Table Queries
            xp: "CREATE TABLE IF NOT EXISTS EXP (`id` INT NOT NULL AUTO_INCREMENT , `guildId` VARCHAR(30) NOT NULL , `userId` VARCHAR(30) NOT NULL, `amount` INT(11) NOT NULL, `level` INT(5) NOT NULL, UNIQUE (`id`)) ENGINE = INNODB",
            invites: "CREATE TABLE IF NOT EXISTS Invites ( `id` INT NOT NULL AUTO_INCREMENT , `guildId` TEXT NOT NULL , `inviterId` TEXT NOT NULL , `invitedId` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = INNODB",
            maps: "CREATE TABLE IF NOT EXISTS Maps ( `id` INT NOT NULL AUTO_INCREMENT , `name` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = INNODB",
            voice: "CREATE TABLE IF NOT EXISTS Voice ( `guildId` VARCHAR(30) NOT NULL , `user_id` VARCHAR(50) NOT NULL , `join_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP , UNIQUE (`user_id`)) ENGINE = INNODB",
            setup: "CREATE TABLE IF NOT EXISTS Setup ( `guild_id` VARCHAR(255) NOT NULL, `owner_id` VARCHAR(255) NOT NULL, `rank_channel_id` VARCHAR(255) NOT NULL, `welcome_channel_id` VARCHAR(255) NOT NULL, `departure_channel_id` VARCHAR(255) NOT NULL, `xp_role_ids` VARCHAR(255) NOT NULL, `invite_role_ids` VARCHAR(255) NOT NULL, `default_role_id` VARCHAR(255) NOT NULL, UNIQUE (`guild_id`)) ENGINE = INNODB",
            invitelinks: "CREATE TABLE IF NOT EXISTS InviteLinks (`id` INT NOT NULL AUTO_INCREMENT, `user_id` VARCHAR(255) NOT NULL, `name` VARCHAR(255) NOT NULL, `relationship` VARCHAR(255) NOT NULL, `approved` BOOLEAN NOT NULL DEFAULT FALSE, `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE (`id`)) ENGINE = INNODB"
        }
    }
}

export default config