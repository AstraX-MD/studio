/**
 * @fileOverview Manage and display group rules.
 */
export default {
  name: "rules",
  aliases: ["grouprules", "setrules"],
  category: "admin",
  description: "View or configure the official rules for this group chat.",
  usage: "rules / rules set <text>",
  permissions: 1,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const sub = args[0]?.toLowerCase();

    if (sub === 'set') {
      const userRole = await ctx.bot.managers.roles.getRole(ctx.sender, ctx.jid);
      if (userRole < 5) return ctx.reply("┌──⌈ 🚫 DENIED ⌋\n┃ Admins only.\n└────────────────");
      
      const rules = args.slice(1).join(' ');
      if (!rules) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Rules content missing.\n└────────────────");
      
      await ctx.bot.db.set('settings', `rules:${ctx.jid}`, rules);
      return ctx.reply(`┌──⌈ ✅ RULES UPDATED ⌋\n┃ Status: Active\n└─ 🌌 ${botName.toUpperCase()}`);
    }

    const currentRules = await ctx.bot.db.get('settings', `rules:${ctx.jid}`) || "No rules set for this group.";
    const output = `┌──⌈ 📜 GROUP RULES ⌋
┃
┃ ${currentRules}
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
