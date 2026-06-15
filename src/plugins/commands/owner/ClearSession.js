/**
 * @fileOverview Wipe session credentials.
 */
import fs from 'fs';
import path from 'path';

export default {
  name: "clearsession",
  aliases: ["wipesession", "delsession"],
  category: "owner",
  description: "Delete all stored WhatsApp credentials and restart.",
  usage: "clearsession",
  ownerOnly: true,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    
    const output = `┌──⌈ ☢️ SESSION WIPE ⌋
┃
┃ Action: DELETE CREDENTIALS
┃ Status: Processing...
┃ Warning: LOGOUT IMMINENT
┃
┃ All session files will be
┃ purged. Re-auth required.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.reply(output);
    
    const sessionDir = path.resolve('./sessions');
    
    setTimeout(() => {
      try {
        if (fs.existsSync(sessionDir)) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        }
        process.exit(0);
      } catch (e) {
        ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to wipe folder.\n└────────────────");
      }
    }, 3000);
  }
};
