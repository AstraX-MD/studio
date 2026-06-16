/**
 * @fileOverview Custom Banned Word Matrix.
 */
export default {
  name: "antiword",
  aliases: ["badword", "filterword"],
  category: "security",
  description: "Block specific words from being sent in the group.",
  usage: "antiword <on/off/add/del/list> [word]",
  permissions: 5,
  groupOnly: true,
  execute: async (ctx, args) => {
    const botName = ctx.bot.config.name;
    const prefix = ctx.prefix;
    
    const config = (await ctx.db.get(`antiword:${ctx.jid}`)) || { mode: 'off', action: 'delete', words: [] };
    const sub = args[0]?.toLowerCase();
    const word = args.slice(1).join(' ').toLowerCase();

    if (sub === 'on' || sub === 'off') {
      config.mode = sub;
      await ctx.db.set(`antiword:${ctx.jid}`, config);
      return ctx.reply(`┌──⌈ 📖 ANTI-WORD ⌋\n┃ Status: ${sub === 'on' ? '✅ ENABLED' : '❌ DISABLED'}\n└────────────────`);
    }

    if (sub === 'add' && word) {
      if (!config.words.includes(word)) config.words.push(word);
      await ctx.db.set(`antiword:${ctx.jid}`, config);
      return ctx.reply(`┌──⌈ ✅ WORD ADDED ⌋\n┃ Word: ${word}\n┃ Status: BANNED\n└────────────────`);
    }

    if (sub === 'del' && word) {
      config.words = config.words.filter(w => w !== word);
      await ctx.db.set(`antiword:${ctx.jid}`, config);
      return ctx.reply(`┌──⌈ 🗑️ WORD REMOVED ⌋\n┃ Word: ${word}\n┃ Status: ALLOWED\n└────────────────`);
    }

    if (sub === 'list') {
        return ctx.reply(`┌──⌈ 📋 BANNED WORDS ⌋\n┃\n┃ ${config.words.join(', ') || 'No words banned yet.'}\n└────────────────`);
    }

    const output = `┌──⌈ 📖 ANTI-WORD ⌋
┃
┃ Status: ${config.mode.toUpperCase()}
┃ Banned: ${config.words.length} Words
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antiword add <word>
├─⊷ ${prefix}antiword del <word>
├─⊷ ${prefix}antiword list
├─⊷ ${prefix}antiword on/off
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
