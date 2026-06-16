/**
 * @fileOverview Intelligent Platform Detection Engine.
 */
import os from 'os';
import fs from 'fs';

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
    
    let provider = 'Generic VPS / Local';
    
    // Probing for Cloud Signatures
    if (process.env.RENDER) provider = 'Render.com (Cloud)';
    else if (process.env.HEROKU_APP_ID || process.env.DYNO) provider = 'Heroku (PaaS)';
    else if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PROJECT_ID) provider = 'Railway.app (Cloud)';
    else if (process.env.FLY_APP_NAME) provider = 'Fly.io (Edge)';
    else if (process.env.REPL_ID || process.env.REPLIT_SLUG) provider = 'Replit (Container)';
    else if (process.env.KOYEB_APP_NAME) provider = 'Koyeb (Cloud)';
    else if (process.env.CODESPACE_NAME) provider = 'GitHub Codespaces';
    else if (fs.existsSync('/.dockerenv')) provider = 'Docker Container';

    const output = `┌──⌈ 🛰️ PLATFORM ⌋
┃ 
┃ Host: ${provider}
┃ Version: ${process.version}
┃ OS: ${os.platform()} (${os.arch()})
┃ 
├─⊷ Status: Reachable
├─⊷ Node: Active
┃ 
└─ 🌌 ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
