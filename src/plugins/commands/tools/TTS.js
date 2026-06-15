/**
 * @fileOverview Convert text to professional speech audio.
 */
export default {
  name: "tts",
  aliases: ["speak", "voice"],
  category: "tools",
  description: "Convert text to speech audio message.",
  usage: "tts <language_code> <text>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    let lang = 'en';
    let text = args.join(' ');

    if (args[0]?.length === 2) {
      lang = args[0];
      text = args.slice(1).join(' ');
    }

    if (!text) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}tts <lang> <text>\n┃ Example: ${prefix}tts en Hello world\n└────────────────`);

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    
    await ctx.sock.sendMessage(ctx.jid, { 
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true 
    }, { quoted: ctx.msg });
  }
};