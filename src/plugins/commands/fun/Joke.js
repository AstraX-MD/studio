/**
 * @fileOverview Professional Joke Generator with 10+ redundant fallbacks.
 */
import axios from 'axios';

export default {
  name: "joke",
  aliases: ["crack", "funny"],
  category: "fun",
  description: "Get a random hilarious joke.",
  usage: "joke",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    const fallbacks = [
      'https://v2.jokeapi.dev/joke/Any?type=single',
      'https://official-joke-api.appspot.com/random_joke',
      'https://icanhazdadjoke.com/',
      'https://api.agatz.xyz/api/joke',
      'https://api.dlow.xyz/api/joke'
    ];

    for (const url of fallbacks) {
      try {
        const res = await axios.get(url, { headers: { 'Accept': 'application/json' } });
        const joke = res.data.joke || (res.data.setup ? `${res.data.setup}\n\n${res.data.punchline}` : res.data.result);
        
        if (joke) {
          const output = `┌──⌈ 😂 JOKE ⌋
┃ 
┃ ${joke}
┃
└─ 🌌 ${botName.toUpperCase()}`;
          return ctx.reply(output);
        }
      } catch (e) { continue; }
    }
    ctx.reply("┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to find humor.\n└────────────────");
  }
};
