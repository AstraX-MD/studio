/**
 * AstraX - Ping Command
 */
export default {
  name: "ping",
  aliases: ["p", "latency"],
  category: "utility",
  description: "Check bot latency.",
  execute: async (sock, m, args, { logger }) => {
    const start = Date.now();
    const { key } = await sock.sendMessage(m.key.remoteJid, { text: '┌──⌈ PINGING ⌋\n┃ Status: Calculating...\n└───────────────' });
    const end = Date.now();
    
    const responseTime = end - start;
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

    await sock.sendMessage(m.key.remoteJid, {
      text: `┌──⌈ ASTRAX ENGINE ⌋
┃ Latency: ${responseTime}ms
┃ RAM Usage: ${ram}MB
┃ Status: Optimized
└────────────────`,
      edit: key
    });
  }
};