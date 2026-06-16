/**
 * @fileOverview Universal Bot Mode Controller.
 */
export default {
  name: "mode",
  aliases: ["botmode", "status"],
  category: "sudo",
  description: "Switch between different operational modes (Public, Private, Silent, etc.)",
  usage: "mode <public/private/silent/dm/groups/exclude> [tag/reply/jid]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.db.get('botname') || "AstraX";
    const prefix = ctx.prefix;
    const sub = args[0]?.toLowerCase();

    if (sub && ['public', 'private', 'silent', 'dm', 'groups'].includes(sub)) {
      await ctx.db.set('mode', sub);
      
      const modeLabels = {
        public: '✅ PUBLIC (ALL ACCESS)',
        private: '🔐 PRIVATE (OWNERS ONLY)',
        silent: '🔇 SILENT (NO RESPONSES)',
        dm: '📩 DM ONLY (NO GROUPS)',
        groups: '👥 GROUPS ONLY (NO DMS)'
      };

      const output = `┌──⌈ 🤖 BOT CONTROL ⌋
┃
┃ Mode: ${modeLabels[sub]}
┃ Status: ACTIVE
┃ 
┃ No restart required.
└────────────────
  © ${botName.toUpperCase()}`;

      return ctx.reply(output);
    }

    const current = await ctx.db.get('mode') || 'public';
    ctx.reply(`┌──⌈ ⚙️ MODE CONFIG ⌋\n┃\n┃ Current: ${current.toUpperCase()}\n┃ Usage: ${prefix}mode private\n└────────────────`);
  }
};
