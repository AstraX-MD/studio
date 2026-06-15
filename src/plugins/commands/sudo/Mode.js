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
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('core', 'mode:config')) || { 
      current: 'public', 
      excluded: [] 
    };

    const sub = args[0]?.toLowerCase();
    const target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                 ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                 args[1];

    if (sub) {
      if (['public', 'private', 'silent', 'dm', 'groups'].includes(sub)) {
        config.current = sub;
      } else if (sub === 'exclude' && target) {
        const jid = target.includes('@') ? target : target + '@s.whatsapp.net';
        if (config.excluded.includes(jid)) {
          config.excluded = config.excluded.filter(j => j !== jid);
        } else {
          config.excluded.push(jid);
        }
      }
      await ctx.bot.db.set('core', 'mode:config', config);
    }

    const modeLabels = {
      public: '✅ PUBLIC (ALL ACCESS)',
      private: '🔐 PRIVATE (OWNERS ONLY)',
      silent: '🔇 SILENT (NO RESPONSES)',
      dm: '📩 DM ONLY (NO GROUPS)',
      groups: '👥 GROUPS ONLY (NO DMS)'
    };

    const output = `┌──⌈ 🤖 BOT CONTROL ⌋
┃
┃ Mode: ${modeLabels[config.current] || config.current.toUpperCase()}
┃ Status: ACTIVE
┃ Exclusions: ${config.excluded.length} Targets
┃
├─⊷ ${prefix}mode public
│  └⊷ Responds to everyone
├─⊷ ${prefix}mode private
│  └⊷ Only owners can use
├─⊷ ${prefix}mode silent
│  └⊷ Process but no reply
├─⊷ ${prefix}mode dm
│  └⊷ Responds only in DMs
├─⊷ ${prefix}mode groups
│  └⊷ Responds only in Groups
├─⊷ ${prefix}mode exclude
│  └⊷ Toggle target bypass
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
