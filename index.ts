import { TwitterApi, TweetV2 } from 'twitter-api-v2';
import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import { QUERY, TWITTER_SEARCH_OBJ } from './constants';
import * as dotenv from 'dotenv';
dotenv.config();

const X_API_KEY = process.env.X_API_KEY!;
const X_SECRET_KEY = process.env.X_SECRET_KEY!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.CHAT_ID!;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
    polling: {
        interval: 1000,
        autoStart: true,
        params: {
            allowed_updates: [
                "message", "edited_message", "channel_post", "edited_channel_post",
                "inline_query", "chosen_inline_result", "callback_query",
                "shipping_query", "pre_checkout_query", "poll", "poll_answer"
            ]
        }
    }
});

const getBearerToken = async (): Promise<string | null> => {
    try {
        const response = await fetch('https://api.twitter.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${X_API_KEY}:${X_SECRET_KEY}`).toString('base64')}`,
            },
            body: 'grant_type=client_credentials',
        });

        const data = await response.json();
        if (data.access_token) {
            console.log('Successfully obtained Bearer Token.');
            return data.access_token;
        } else {
            throw new Error('Failed to retrieve bearer token.');
        }
    } catch (error: any) {
        console.error('Error getting bearer token:', error.message);
        return null;
    }
};

const initTwitterClient = async (): Promise<TwitterApi | null> => {
    const bearerToken = await getBearerToken();
    if (!bearerToken) {
        console.error('Could not authenticate Twitter API.');
        return null;
    }
    return new TwitterApi(bearerToken);
};

const fetchTokenLaunchNews = async (): Promise<void> => {
    const client = await initTwitterClient();
    if (!client) return;

    try {
        const tweetsData = await client.v2.search(QUERY, TWITTER_SEARCH_OBJ as any);

        if ((tweetsData as any)?._realData?.data) {
            processTweets((tweetsData as any)._realData.data);
        } else {
            console.log('No relevant tweets found.');
        }
    } catch (error) {
        console.error('Error fetching tweets:', error);
    }
};

const escapeMarkdown = (text: string): string => {
    return text
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');
};

const processTweets = async (tweets: TweetV2[]): Promise<void> => {
    for (const tweet of tweets) {
        await sendTweetToTelegram(tweet);
        await new Promise(resolve => setTimeout(resolve, 2 * 60 * 60 * 1000)); // wait 2 hours
    }
};

const sendTweetToTelegram = async (tweetData: TweetV2): Promise<void> => {
    try {
        const { id, text, created_at, author_id, public_metrics, entities } = tweetData;

        const authorMention = entities?.mentions?.[0]?.username
            ? `👤 *Author:* [@${entities.mentions[0].username}](https://twitter.com/${entities.mentions[0].username})`
            : `👤 *Author ID:* ${author_id}`;

        const formattedText = escapeMarkdown(text);
        const tweetUrl = `🔗 [View Tweet](https://twitter.com/i/web/status/${id})`;

        let embeddedLink = "";
        if (entities?.urls && entities.urls.length > 0) {
            const { expanded_url, title } = entities.urls[0];
            if (expanded_url && title) {
                embeddedLink = `🌐 *Source:* [${escapeMarkdown(title)}](${escapeMarkdown(expanded_url)})`;
            }
        }

        const metrics = `🔄 *Retweets:* ${public_metrics?.retweet_count ?? 0}   💬 *Replies:* ${public_metrics?.reply_count ?? 0}   ❤️ *Likes:* ${public_metrics?.like_count ?? 0}`;

        const message = `🚀 *New Tweet Found* 🚀\n\n` +
            `${authorMention}\n` +
            `🕒 *Date:* ${escapeMarkdown(created_at || '')}\n\n` +
            `📜 *Tweet:* ${formattedText}\n\n` +
            `${metrics}\n\n` +
            `${tweetUrl}\n` +
            (embeddedLink ? `${embeddedLink}\n` : "");

        await bot.sendMessage(CHAT_ID, message, { parse_mode: "MarkdownV2" });

    } catch (error) {
        console.error("Error sending message to Telegram:", error);
    }
};

fetchTokenLaunchNews();
setInterval(fetchTokenLaunchNews, 20 * 60 * 60 * 1000);
