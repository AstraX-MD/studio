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
├─⊷ ${prefix}aimenu
├─⊷ ${prefix}animemenu
├─⊷ ${prefix}automationmenu
├─⊷  ${prefix}convertermenu
├─⊷ ${prefix}economymenu
├─⊷ ${prefix}educationmenu
├─⊷ ${prefix}footballmenu
├─⊷ ${prefix}funmenu
├─⊷ ${prefix}logomenu
├─⊷ ${prefix}musicmenu
├─⊷ ${prefix}photomenu
├─⊷ ${prefix}profilemenu
├─⊷ ${prefix}securitymenu
├─⊷ ${prefix}stalkermenu
├─⊷ ${prefix}sudomenu
├─⊷ ${prefix}toolmenu
├─⊷ ${prefix}utilitymenu
┃
┃ Tip: Use ${prefix}help for all
└────────────────
  © ${botName.toUpperCase()}`;

    await ctx.sock.sendMessage(ctx.jid, { 
      image: { url: thumbnail },
      caption: output
    }, { quoted: ctx.msg });
  }
};
