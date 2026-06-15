/**
 * @fileOverview Custom banned word list filter.
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
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('security', `antiword:${ctx.jid}`)) || { mode: 'off', action: 'delete', words: [] };
    const sub = args[0]?.toLowerCase();
    const word = args.slice(1).join(' ').toLowerCase();

    if (sub === 'on') config.mode = 'on';
    else if (sub === 'off') config.mode = 'off';
    else if (sub === 'add' && word) {
      if (!config.words.includes(word)) config.words.push(word);
    } else if (sub === 'del' && word) {
      config.words = config.words.filter(w => w !== word);
    }
    
    await ctx.bot.db.set('security', `antiword:${ctx.jid}`, config);

    const output = `┌──⌈ 📖 ANTI-WORD ⌋
┃
┃ Status: ${config.mode === 'off' ? '❌ OFF' : '✅ ACTIVE'}
┃ Banned: ${config.words.length} Words
┃ Action: ${config.action.toUpperCase()}
┃
├─⊷ ${prefix}antiword add <word>
│  └⊷ Ban a new word
├─⊷ ${prefix}antiword del <word>
│  └⊷ Unban a word
├─⊷ ${prefix}antiword list
│  └⊷ Show all banned words
└────────────────
  © ${botName.toUpperCase()}`;

    if (sub === 'list') {
        return ctx.reply(`┌──⌈ BANNED WORDS ⌋\n┃\n┃ ${config.words.join(', ') || 'None'}\n└────────────────`);
    }

    ctx.reply(output);
  }
};
