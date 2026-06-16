/**
 * @fileOverview Directory of all specialized menus.
 */
export default {
  name: "allmenu",
  aliases: ["menus", "directory"],
  category: "utility",
  description: "List all specialized sub-menus for easier navigation.",
  usage: "allmenu",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const thumbnail = ctx.bot.config.thumbnail;

    const output = `┌──⌈ 📑 MENU DIRECTORY ⌋
┃
├─⊷ ${prefix}adminmenu
├─⊷ ${prefix}aichatmenu
├─⊷ ${prefix}aiimagemenu
├─⊷ ${prefix}aivideomenu
├─⊷ ${prefix}aimusicmenu
├─⊷  ${prefix}economymenu
├─⊷ ${prefix}logomenu
├─⊷ ${prefix}reactionsmenu
├─⊷ ${prefix}securitymenu
├─⊷ ${prefix}toolmenu
├─⊷ ${prefix}utilitymenu
┃
┃ Tip: Use ${prefix}help for 
┃ categorized command view.
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
