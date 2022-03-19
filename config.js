const config = {
    language: "he", // Language phrase, please make sure the language exists!

    api: {
        /* Please note that the current API routes AREN'T PROTECTED!
           Please do not enable the API unless you use it! */
        enabled: true,
        ip: "locahost",
        port: 6000
    },

    logging: {
        discordChannel: "779721531907506197", // Channel id / NULL
        console: true, // If the process should log to the console too
        mysql: false, // Log mysql queries
        invites: true, // Log the Invites System
        xp: true // Log the XP System
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
            color: "#0080ff",
            footerText: "Next-il.co.il",
            footerIcon: "https://i.imgur.com/dFcqpSm.png"
        },
        dev: {
            enabled: true,                  // true = enabled, false = disabled
            guildId: "770819843573415977",  // The Guild where you want to commands only work in, during this time
            clients: ["137254857710108672"] // The clients that can use the bot during this time
        },
        main: {

        },
        xp: {
            enabled: true,              // true = Enable the XP System / false = Disable the XP System
            createRowOnAdd: true,       // Optional! Create DB Entry for each member joining your server.
            deleteRowOnRemove: false,   // Optional! Delete DB Entry for each member leaving your server = reset his exp!
            generation: {
                min: 10,              // Minimum XP to give for ea message
                max: 20,              // Maximum XP to give for ea message
                attachmentBonus: 30,  // Amount of XP to give for each attachment (pictures, etc)
                delay: 3 * 1000       // Seconds * Miliseconds
            },
            commands: {
                top: {
                    limit: 10
                }
            },
            levels: {
                enabled: true,
                removeAllRoles: false, // true = Clear all member "levels" roles before adding the new level role, false = just give him the new level role and keep the others
                levels: [
                    {
                        level: 1,                       // Level number
                        xp: 10,                         // The needed XP for this level
                        role: "779507082339680284",     // Role ID or null
                        bonus: null                     // Bonus as text or null
                    },
                    {
                        level: 2,
                        xp: 50,
                        role: "779507082339680284",
                        bonus: null
                    },
                    {
                        level: 3,
                        xp: 100,
                        role: "779507082339680284",
                        bonus: null
                    },
                    {
                        level: 4,
                        xp: 150,
                        role: "779507082339680284",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 5,
                        xp: 250,
                        role: "779507322598326292",
                        bonus: null
                    },
                    {
                        level: 6,
                        xp: 400,
                        role: "779507322598326292",
                        bonus: null
                    },
                    {
                        level: 7,
                        xp: 600,
                        role: "779507322598326292",
                        bonus: null
                    },
                    {
                        level: 8,
                        xp: 800,
                        role: "779507322598326292",
                        bonus: null
                    },
                    {
                        level: 9,
                        xp: 1050,
                        role: "779507322598326292",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 10,
                        xp: 1300,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 11,
                        xp: 1600,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 12,
                        xp: 1900,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 13,
                        xp: 2250,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 14,
                        xp: 2650,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 15,
                        xp: 3000,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 16,
                        xp: 3300,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 17,
                        xp: 3600,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 18,
                        xp: 3900,
                        role: "779507639267753986",
                        bonus: null
                    },
                    {
                        level: 19,
                        xp: 4200,
                        role: "779507639267753986",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 20,
                        xp: 4500,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 21,
                        xp: 4900,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 22,
                        xp: 5300,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 23,
                        xp: 5700,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 24,
                        xp: 6100,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 25,
                        xp: 6500,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 26,
                        xp: 6900,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 27,
                        xp: 7200,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 28,
                        xp: 7600,
                        role: "779507435182358568",
                        bonus: null
                    },
                    {
                        level: 29,
                        xp: 8000,
                        role: "779507435182358568",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 30,
                        xp: 8400,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 31,
                        xp: 8800,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 32,
                        xp: 9200,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 33,
                        xp: 9600,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 34,
                        xp: 10000,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 35,
                        xp: 10400,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 36,
                        xp: 10800,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 37,
                        xp: 11200,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 38,
                        xp: 11600,
                        role: "779508364119375902",
                        bonus: null
                    },
                    {
                        level: 39,
                        xp: 12000,
                        role: "779508364119375902",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 40,
                        xp: 12500,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 41,
                        xp: 13000,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 42,
                        xp: 13000,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 43,
                        xp: 13500,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 44,
                        xp: 14000,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 45,
                        xp: 14500,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 46,
                        xp: 16000,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 47,
                        xp: 16500,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 48,
                        xp: 17000,
                        role: "779508503206166528",
                        bonus: null
                    },
                    {
                        level: 49,
                        xp: 17500,
                        role: "779508503206166528",
                        bonus: null
                    },
                    // ==================================
                    {
                        level: 50,
                        xp: 20000,
                        role: "779508588837994547",
                        bonus: "null"
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
                    role: '798734284449775626'
                },
                3: {
                    role: '798734808603164693'
                },
                5: {
                    role: '798735241459793980'
                },
                7: {
                    role: '798735578207485982'
                },
                10: {
                    role: '798735880986427392'
                }
            }
        },
    },

    // DB Tables Name
    mysql: {
        tables: { // Tables Name
            xp: "XP", // Please Change The Create Table Query Too!
            invites: "Invites" // Please Change The Create Table Query Too!
        },
        queries: { // Create Table Queries
            xp: "CREATE TABLE IF NOT EXISTS XP (`guildId` VARCHAR(30) NOT NULL, `userId` VARCHAR(30) NOT NULL, `amount` INT(11) NOT NULL, `level` INT(5) NOT NULL, UNIQUE (`userId`)) ENGINE = INNODB",
            invites: "CREATE TABLE IF NOT EXISTS Invites ( `id` INT NOT NULL AUTO_INCREMENT , `guildId` TEXT NOT NULL , `inviterId` TEXT NOT NULL , `invitedId` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = INNODB"
        }
    }
}

export default config