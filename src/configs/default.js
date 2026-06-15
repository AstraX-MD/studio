/**
 * @fileOverview Core bot identity and operational settings.
 */
export default {
  name: process.env.BOT_NAME || 'AstraX',
  prefix: process.env.PREFIX || '!',
  owners: (process.env.OWNER_NUMBERS || '').split(',').filter(n => n.length > 0),
  sessionName: process.env.SESSION_NAME || 'AstraX-Main',
  timezone: process.env.TIMEZONE || 'UTC',
  footer: 'Powered by AstraX Enterprise',
  thumbnail: 'https://i.ibb.co/QvGY7dqB/file-00000000e1107243ad54749c06fe2d80.png'
};
