export default {
    bot: {
        main: {
            error: {
                en: "Error!",
                he: "שגיאה!"
            }
        },
        xp: {
            raiseLevel: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "Gz! {user} raised to level {level}!",
                    he: "{user} הועלה לרמה {level}!",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: ":partying_face: Congrats! :tada: {user}, gained **{xp} XP**! Now needs **{xpToNextLevel}** more XP to reach level **{nextLevel}**.\n\n**➜ Bonus:** {bonus}\n**➜ Role:** {role}",
                    he: ":partying_face: מזל טוב! :tada: {user}, צבר **{xp} XP**!\n\n**➜ Bonus:** {bonus}\n**➜ Role:** {role}",
                },
                noBonus: {
                    // If there isn't any bonus for the new level, write that instead
                    en: "none.",
                    he: ""
                },
                noRole: {
                    // If there isn't any role for the new level, write that instead
                    en: "none.",
                    he: ""
                }
            },
            raiseLevelnB: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "Gz! {user} raised to level {level}!",
                    he: "{user} הועלה לרמה {level}!",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: ":partying_face: Congrats! :tada: {user}, gained **{xp} XP**! Now needs **{xpToNextLevel}** more XP to reach level **{nextLevel}**.\n\n**➜ Role:** {role}",
                    he: ":partying_face: מזל טוב! :tada: {user}, צבר **{xp} XP**!\n\n**➜ Role:** {role}",
                },
                noRole: {
                    // If there isn't any role for the new level, write that instead
                    en: "none.",
                    he: ""
                }
            },
            raiseLevelnR: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "Gz! {user} raised to level {level}!",
                    he: "{user} הועלה לרמה {level}!",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: ":partying_face: Congrats! :tada: {user}, gained **{xp} XP**! Now needs **{xpToNextLevel}** more XP to reach level **{nextLevel}**.",
                    he: ":partying_face: מזל טוב! :tada: {user}, צבר **{xp} XP**!",
                },
            },
        },
        rr: {
            raiseLevel: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "Gz! {user} gained a Reaction Role!",
                    he: "Gz! {user} קיבל תפקיד תגובה!",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: "\n\n**➜ Role:** {role}",
                    he: "\n\n**➜ Role:** {role}",
                },
                noBonus: {
                    // If there isn't any bonus for the new level, write that instead
                    en: "none.",
                    he: ""
                },
                noRole: {
                    // If there isn't any role for the new level, write that instead
                    en: "none.",
                    he: ""
                }
            },
            lowerLevel: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "Gz! {user} lost a Reaction Role!",
                    he: "Gz! {user} איבד תפקיד תגובה!",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: "\n\n**➜ Role:** {role}",
                    he: "\n\n**➜ Role:** {role}",
                },
                noBonus: {
                    // If there isn't any bonus for the new level, write that instead
                    en: "none.",
                    he: ""
                },
                noRole: {
                    // If there isn't any role for the new level, write that instead
                    en: "none.",
                    he: ""
                }
            },
        },
        tr: {
            resetTime: {
                embedTitle: {
                    /*
                        @user = user tag
                        @level = new level
                    */
                    en: "{tradername} is restocking soon!",
                    he: "",
                },
                embedMessage: {
                    /*
                        @user = user tag
                        @level = the user new level
                        @xp = the user new xp amount
                        @bonus = the given bonus with the new level
                        @role = the given role with the new level
                    */
                    en: "{message}",
                    he: "",
                }
            },
        },
        commands: {
            help: {
                description: {
                    en: "Shows usefull commands",
                    he: "מציג פקודות שימושיות"
                },
                commands: {
                    en: "Usefull Commands:",
                    he: "פקודות שימושיות:"
                }
            },
            xp: {
                description: {
                    en: "Shows your XP",
                    he: "הצג את כמות האקספי שברשותך"
                },
                userToCheck: {
                    en: "User",
                    he: "משתמש"
                }
            },
            top: {
                description: {
                    en: "Shows top members by level",
                    he: "מציג את המשתמשים הכי פעילים בשרת"
                },
                level: {
                    en: "Level",
                    he: "Level"
                },
            },
            invites: {
                description: {
                    en: "Shows your invites",
                    he: "מציג את כמות ההזמנות שברשותך"
                },
                title: {
                    en: "Your Invites: {invites}",
                    he: "הזמנות ברשותך: {invites}"
                },
                members: {
                    en: "Members:",
                    he: "משתמשים:"
                },
                notFoundInvites: {
                    en: "Couldn't find invites for this user.",
                    he: "לא נמצאו הזמנות בבעלות המשתמש."
                }
            },
            invitelink: {
                description: {
                    en: "To get an invite link",
                    he: "מציג פקודות שימושיות"
                },
            },
            leaderboard: {
                description: {
                    en: "Shows top members by invites",
                    he: "מציג את המשתמשים בעלי הכי הרבה הזמנות"
                },
                invites: {
                    en: "Invites",
                    he: "הזמנות"
                }
            },
            reactions: {
                description: {
                    en: "To add and remove reactions to monitort",
                    he: "מציג את המשתמשים בעלי הכי הרבה הזמנות"
                },
                command: {
                    en: "Command",
                    he: "משתמש"
                },
                arg: {
                    en: "args",
                    he: "משתמש"
                },
            },
            whatmap: {
                description: {
                    en: "To help select maps for indecisive people",
                    he: "מציג את המשתמשים בעלי הכי הרבה הזמנות"
                },
                command: {
                    en: "Command",
                    he: "משתמש"
                },
                map: {
                    en: "Map",
                    he: "הזמנות"
                }
            }
        }
    },
    api: {

    }
}