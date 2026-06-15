import { config } from 'dotenv';
config();

import '@/ai/flows/ai-message-summarization-flow.ts';
import '@/ai/flows/ai-content-moderation-flow.ts';
import '@/ai/flows/ai-chat-conversation-flow.ts';