/**
 * @fileOverview Temporary Email Generator.
 */
import axios from 'axios';

export default {
  name: "tempmail",
  aliases: ["mail", "genmail"],
  category: "tools",
  description: "Generate a temporary disposable email address.",
  usage: "tempmail",
  cooldown: 15,
  permissions: 1,
  execute: async (ctx) => {
    try {
      const res = await axios.get('https://www.1secmail.com/api/v1/?action=genEmailAddresses&count=1');
      const email = res.data[0];

      const output = `┌──⌈ 📧 TEMP MAIL ⌋
┃ Address: ${email}
┃ Provider: 1secmail
┃ Duration: 60 Minutes
┃
┃ Instructions: Use this email for 
┃ registrations. Checking inbox 
┃ is coming in next update.
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to generate email.\n└────────────────`);
    }
  }
};