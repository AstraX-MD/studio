# 🌌 AstraX Enterprise | WhatsApp Bot Framework

AstraX is a high-performance, modular, and enterprise-grade WhatsApp automation framework built on the **Baileys** library. Designed for scalability, it supports 5,000+ commands with hot-reloading capabilities and multi-database support.

---

## 🚀 Key Features

- **Modular Plugin Engine**: Commands and events auto-register without touching core files.
- **Hot-Reloading**: Update or install plugins live without restarting the bot.
- **DB Abstraction**: Seamlessly switch between JSON, MongoDB, PostgreSQL, and Firebase.
- **RBAC Security**: Advanced permission hierarchy (Root, Owner, Sudo, Premium, User).
- **Warden Security**: Integrated Anti-Link, Anti-Spam, and Content Moderation.
- **Next.js Dashboard**: Real-time management console for sessions and telemetry.

---

## 📦 Installation

### 1. Clone & Install
```bash
git clone https://github.com/astrax-enterprise/astrax.git
cd astrax
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
SESSION_NAME=AstraX-Main
PREFIX=!
OWNER_NUMBERS=254123456789
DATABASE_TYPE=json
PORT=9002
```

### 3. Start the Engine
```bash
npm start
```

---

## 🛠️ Plugin Development

Every command follows a strict schema for reliability. Save your file in `src/plugins/commands/<category>/MyCommand.js`.

```javascript
export default {
  name: "ping",
  category: "utility",
  description: "Check bot latency",
  permissions: 1, // USER
  execute: async (ctx) => {
    await ctx.reply("Pong! 🏓");
  }
};
```

---

## 🚢 Deployment Guides

### Docker
```bash
docker-compose up -d
```

### PM2 (VPS)
```bash
npm install pm2 -g
pm2 start ecosystem.config.cjs --env production
```

---

## 🛡️ Permission Hierarchy

| Rank | Name | Role ID | Purpose |
| :--- | :--- | :--- | :--- |
| 10 | **Root Owner** | `ROOT_OWNER` | Full System Access |
| 9 | **Owner** | `OWNER` | Bot & Group Control |
| 8 | **Sudo Admin** | `SUDO` | Administrative Bypass |
| 7 | **Premium** | `PREMIUM` | Paid/Advanced Features |
| 1 | **User** | `USER` | Standard Interaction |
| 0 | **Blacklisted** | `0` | Immediate Ignore |

---

## 📄 License
AstraX is distributed under the MIT License. Developed by the AstraLabs team.
