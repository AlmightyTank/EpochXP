import config from '../config.js'

const generateXP = () => Math.floor(
    Math.random() * (config.bot.xp.generation.max - config.bot.xp.generation.min + 1)
) + config.bot.xp.generation.min

export default generateXP