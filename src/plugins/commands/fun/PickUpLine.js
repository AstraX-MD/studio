/**
 * @fileOverview Corny pick up lines.
 */
import axios from 'axios';

export default {
  name: "pickupline",
  aliases: ["pickup", "rizz"],
  category: "fun",
  description: "Get a random pick up line.",
  usage: "pickupline",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx) => {
    const botName = await ctx.bot.managers.settings.get('core', 'name') || ctx.bot.config.name;

    try {
      const res = await axios.get('https://rizzapi.vercel.app/random');
      const output = `┌──⌈ 💍 PICKUP LINE ⌋
┃ 
┃ "${res.data.text}"
┃
└─ 🌌 ${botName.toUpperCase()}`;
      ctx.reply(output);
    } catch (e) {
      const fallback = "Are you a keyboard? Because you're just my type.";
      ctx.reply(`┌──⌈ 💍 PICKUP LINE ⌋\n┃ \n┃ "${fallback}"\n└─ 🌌 ${botName.toUpperCase()}`);
    }
  }
};
