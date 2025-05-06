
==========================
📢 Twitter to Telegram Bot
==========================

This bot searches for tweets containing specific keywords (related to web/dev technologies)
and forwards them to a Telegram channel or group using MarkdownV2 formatting.

It is built with:
- TypeScript
- Twitter API v2
- Telegram Bot API
- Node.js

-------------
📁 File List:
-------------
1. index.ts        => Main logic for fetching tweets and posting to Telegram
2. constants.ts    => Twitter search keywords and parameters
3. .env            => Secrets for Twitter and Telegram APIs

---------------
📦 Prerequisites:
---------------
- Node.js 18+
- Twitter API credentials (X_API_KEY and X_SECRET_KEY)
- Telegram Bot token (create via @BotFather)
- Telegram chat/group ID

------------------
🔐 .env Structure:
------------------
Create a `.env` file in the root folder with the following:
```sh
X_API_KEY=your-twitter-api-key
X_SECRET_KEY=your-twitter-secret-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
CHAT_ID=your-telegram-chat-id
```

--------------------
📦 Install Packages:
--------------------
Run the following commands to install dependencies and types:
```sh
git clone https://github.com/gold-mouse/Telegram-Twitter-bot.git
cd Telegram-Twitter-bot
npm install
```

-------------------
🚀 Run the Bot:
-------------------
```sh
npm start
```

The bot will:
1. Authenticate with Twitter using OAuth 2.0.
2. Search for tweets with specified tech keywords.
3. Format them with MarkdownV2.
4. Send messages to your Telegram chat.
5. Repeat every 20 hours.

📌 Each tweet is sent with a 2-hour delay between posts.

--------------------
🤖 Notes & Tips:
--------------------
- If sending to a private group, the bot must be added as a member and be an admin if needed.
- The bot only fetches English tweets due to the `lang:en` parameter in the query.
