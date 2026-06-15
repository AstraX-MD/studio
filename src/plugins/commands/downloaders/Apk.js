/**
 * @fileOverview Android APK Downloader from PlayStore.
 */
import axios from 'axios';

export default {
  name: "apk",
  aliases: ["app", "getapp"],
  category: "downloaders",
  description: "Download Android apps (APK) by name.",
  usage: "apk <app name>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ App name required.\n└────────────────");

    const { key } = await ctx.reply(`┌──⌈ 📥 APK ENGINE ⌋\n┃ Query: ${query}\n┃ Status: Searching Store...\n└────────────────`);

    try {
      const res = await axios.get(`https://api.agatz.xyz/api/apk?query=${encodeURIComponent(query)}`);
      const app = res.data.data;

      await ctx.sock.sendMessage(ctx.jid, { 
        document: { url: app.download },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${app.name}.apk`,
        caption: `┌──⌈ 📦 APK FOUND ⌋\n┃ Name: ${app.name}\n┃ Size: ${app.size}\n┃ Pack: ${app.package}\n└─ 🌌 ${botName.toUpperCase()}`
      }, { quoted: ctx.msg });
    } catch (e) {
      ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ APK not found or too large.\n└────────────────");
    }
  }
};
