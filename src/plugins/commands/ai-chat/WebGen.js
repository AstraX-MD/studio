/**
 * @fileOverview AI-Powered Single-File Web Generator with Live Preview.
 */
import axios from 'axios';

export default {
  name: "webgen",
  aliases: ["htmlgen", "makeapp", "site"],
  category: "ai-chat",
  description: "Generate a fully functional HTML/Tailwind web app with a live preview link.",
  usage: "webgen <description of the app>",
  cooldown: 20,
  permissions: 1,
  execute: async (ctx, args) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;
    const query = args.join(' ');

    if (!query) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Describe the app you want.\n┃ Example: a dark mode calculator\n└────────────────`);

    const { key } = await ctx.reply(`┌──⌈ 🌐 WEB ARCHITECT ⌋\n┃ Status: Coding Components...\n┃ Mode: Full-Stack (Single File)\n└────────────────`);

    const prompt = `Create a single-file HTML application for: ${query}. 
    Use Tailwind CSS via CDN for professional styling. 
    Include interactive JavaScript logic. 
    Make it fully responsive and modern. 
    Return ONLY the code block.`;

    const fallbacks = [
      `https://api.agatz.xyz/api/blackbox?message=${encodeURIComponent(prompt)}`,
      `https://api.vytmp3.com/gpt4?query=${encodeURIComponent(prompt)}`,
      `https://api.dlow.xyz/api/gpt4?q=${encodeURIComponent(prompt)}`
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url);
        let code = res.data.data || res.data.result || res.data.ans;

        if (code) {
          // Extract HTML if AI wrapped it in markdown
          if (code.includes('```html')) {
            code = code.split('```html')[1].split('```')[0];
          } else if (code.includes('```')) {
            code = code.split('```')[1].split('```')[0];
          }

          const encoded = Buffer.from(code.trim()).toString('base64');
          const host = process.env.PUBLIC_URL || `http://localhost:9002`;
          const previewLink = `${host}/render?html=${encoded}`;

          const output = `┌──⌈ 💻 CODE GENERATED ⌋
┃
┃ Project: ${query.substring(0, 20)}...
┃ Tech: HTML5 / Tailwind / JS
┃
├─⊷ Status: COMPILED
├─⊷ Preview: ${previewLink}
┃
┃ Use the link above to view 
┃ the interactive app live.
└────────────────
  © ${botName.toUpperCase()}`;

          await ctx.reply(`\`\`\`html\n${code.trim()}\n\`\`\``);
          return await ctx.sock.sendMessage(ctx.jid, { text: output, edit: key });
        }
      } catch (e) { continue; }
    }
    ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Architect nodes are busy.\n└────────────────`);
  }
};
