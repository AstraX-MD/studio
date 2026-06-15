/**
 * @fileOverview Configure the AI Chatbot subsystem with granular scoping.
 */
export default {
  name: "chatbot",
  aliases: ["aiassistant", "autochat"],
  category: "automation",
  description: "Configure the AI chatbot to automatically reply to messages.",
  usage: "chatbot <on/off/mode/add/del/status> [value]",
  permissions: 9,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    
    const config = (await ctx.bot.db.get('automation', 'chatbot:config')) || { 
      status: 'off', 
      mode: 'public', // public, dm, groups, whitelist
      whitelist: [] 
    };

    const sub = args[0]?.toLowerCase();
    const val = args[1]?.toLowerCase();

    if (sub === 'on' || sub === 'off') {
      config.status = sub;
      await ctx.bot.db.set('automation', 'chatbot:config', config);
      return ctx.reply(`┌──⌈ 🤖 CHATBOT ⌋\n┃ Status: ${sub === 'on' ? '✅ ENABLED' : '❌ DISABLED'}\n└────────────────`);
    }

    if (sub === 'mode' && val) {
      const validModes = ['public', 'dm', 'groups', 'whitelist'];
      if (validModes.includes(val)) {
        config.mode = val;
        await ctx.bot.db.set('automation', 'chatbot:config', config);
        return ctx.reply(`┌──⌈ ⚙️ MODE UPDATED ⌋\n┃ New Mode: ${val.toUpperCase()}\n└────────────────`);
      }
    }

    if ((sub === 'add' || sub === 'del') && args[1]) {
      let target = ctx.msg.message?.extendedTextMessage?.contextInfo?.participant || 
                   ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                   args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      
      if (sub === 'add') {
        if (!config.whitelist.includes(target)) config.whitelist.push(target);
      } else {
        config.whitelist = config.whitelist.filter(t => t !== target);
      }
      await ctx.bot.db.set('automation', 'chatbot:config', config);
      return ctx.reply(`┌──⌈ 📋 WHITELIST ⌋\n┃ Target: @${target.split('@')[0]}\n┃ Action: ${sub === 'add' ? 'ADDED' : 'REMOVED'}\n└────────────────`, { mentions: [target] });
    }

    const output = `┌──⌈ 🤖 AI CHATBOT ⌋
┃
┃ Status: ${config.status === 'on' ? '✅ ACTIVE' : '❌ OFFLINE'}
┃ Mode: ${config.mode.toUpperCase()}
┃ Whitelist: ${config.whitelist.length} Targets
┃
├─⊷ ${prefix}chatbot on/off
│  └⊷ Toggle system
├─⊷ ${prefix}chatbot mode <type>
│  └⊷ Set scope (public/dm/groups/whitelist)
├─⊷ ${prefix}chatbot add/del <@tag>
│  └⊷ Manage whitelist targets
┃
└────────────────
  © ${botName.toUpperCase()}`;

    ctx.reply(output);
  }
};
