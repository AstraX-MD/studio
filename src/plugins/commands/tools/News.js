/**
 * @fileOverview Get the latest news headlines.
 */
import axios from 'axios';

export default {
  name: "news",
  category: "tools",
  description: "Fetch the latest global news headlines.",
  usage: "news",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    try {
      // Using a free news proxy or aggregator
      const res = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=064293f0b882436d8b0f745d0c75c87a');
      const articles = res.data.articles.slice(0, 5);

      let output = `┌──⌈ 📰 TOP HEADLINES ⌋\n┃\n`;
      articles.forEach((a, i) => {
        output += `├─ ${i + 1}. ${a.title}\n┃ 🔗 ${a.url.substring(0, 30)}...\n┃\n`;
      });
      output += `└─ 🌌 AstraX Enterprise`;

      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch news. Try again later.\n└────────────────`);
    }
  }
};