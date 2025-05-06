
export const QUERY = '("React.js" OR "Vue.js" OR "Angular" OR "Svelte" OR "Tailwind CSS" OR "Material UI" OR "Node.js" OR "Nest.js" OR "Express.js" OR "Django" OR "Laravel" OR "REST API" OR "WebSockets" OR "MySQL" OR "PostgreSQL" OR "MongoDB" OR "Redis" OR "Firebase" OR "OAuth" OR "JWT" OR "CSRF" OR "AWS" OR "Google Cloud" OR "Vercel" OR "Netlify" OR "OpenAI API" OR "Chatbot" OR "React Native" OR "Flutter" OR "Web3.js" OR "Solidity" OR "Smart Contracts") lang:en';

export const TWITTER_SEARCH_OBJ = {
    max_results: 10,
    'tweet.fields': ['created_at', 'text', 'lang', 'public_metrics', 'conversation_id', 'entities'],
    'user.fields': ['username', 'name', 'profile_image_url'],
    'media.fields': ['url', 'preview_image_url'],
    expansions: ['author_id', 'attachments.media_keys', 'referenced_tweets.id'],
};
