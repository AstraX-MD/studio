/**
 * @fileOverview Intelligent Platform Detection Engine.
 */
import os from 'os';

export default {
  name: "plat",
  aliases: ["platform", "hostdetect"],
  category: "utility",
  description: "Detect and display the current hosting provider and infrastructure.",
  usage: "plat",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    let provider = 'GENERIC VPS / LOCAL';
    
    // Probing for Cloud Signatures
    if (process.env.RENDER) provider = 'RENDER.COM (CLOUD)';
    else if (process.env.HEROKU_APP_ID || process.env.DYNO) provider = 'HEROKU (PAAS)';
    else if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PROJECT_ID) provider = 'RAILWAY.APP (CLOUD)';
    else if (process.env.FLY_APP_NAME) provider = 'FLY.IO (EDGE)';
    else if (process.env.REPL_ID || process.env.REPLIT_SLUG) provider = 'REPLIT (CONTAINER)';
    else if (process.env.KOYEB_APP_NAME) provider = 'KOYEB (CLOUD)';
    else if (process.env.CODESPACE_NAME) provider = 'GITHUB CODESPACES';
    else if (fs.existsSync('/.dockerenv')) provider = 'DOCKER CONTAINER';

    const output = `┌──⌈ 🛰️ PLATFORM ⌋
┃ 
┃ Provider: ${provider}
┃ Node Version: ${process.version}
┃ OS: ${os.platform()} (${os.arch()})
┃ 
├─⊷ Status: NODE_REACHABLE
├─⊷ Region: GLOBAL-AUTO
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
