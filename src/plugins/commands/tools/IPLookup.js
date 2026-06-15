/**
 * @fileOverview Get detailed information about an IP address.
 */
import axios from 'axios';

export default {
  name: "iplookup",
  aliases: ["ipinfo", "geoip"],
  category: "tools",
  description: "Look up details for any IP address or domain.",
  usage: "iplookup <ip/domain>",
  cooldown: 5,
  permissions: 1,
  execute: async (ctx, args) => {
    const prefix = await ctx.bot.managers.settings.get('core', 'prefix', ctx.jid) || '!';
    const target = args[0];
    if (!target) return ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Use: ${prefix}iplookup <ip>\n└────────────────`);

    try {
      const res = await axios.get(`http://ip-api.com/json/${target}`);
      const data = res.data;

      if (data.status === 'fail') throw new Error('Invalid IP');

      const output = `┌──⌈ 🌐 IP LOOKUP ⌋
┃ Target: ${data.query}
┃ ISP: ${data.isp}
┃ Org: ${data.org}
┃ Country: ${data.country} (${data.countryCode})
┃ Region: ${data.regionName}
┃ City: ${data.city}
┃ Lat/Lon: ${data.lat}, ${data.lon}
┃ Timezone: ${data.timezone}
└────────────────`;
      ctx.reply(output);
    } catch (e) {
      ctx.reply(`┌──⌈ ⚠️ ERROR ⌋\n┃ Failed to fetch IP details.\n└────────────────`);
    }
  }
};