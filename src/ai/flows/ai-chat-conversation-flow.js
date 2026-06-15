/**
 * @fileOverview Resilient AI Chat Flow.
 * Converted to .js for standard Node.js runtime compatibility.
 */
import axios from 'axios';

async function groqFallback(message) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'You are AstraX, an intelligent AI assistant. Provide concise responses.' },
          { role: 'user', content: message }
        ],
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      }
    );
    return response.data.choices[0]?.message?.content || null;
  } catch (error) {
    return null;
  }
}

async function publicProxyFallback(message) {
  const urls = [
    `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/ai?query=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url);
      const ans = res.data.data || res.data.result || res.data.ans;
      if (ans) return ans;
    } catch (e) { continue; }
  }
  return null;
}

export async function aiChatConversation(input) {
  const groqResponse = await groqFallback(input.message);
  if (groqResponse) return { response: groqResponse };

  const publicResponse = await publicProxyFallback(input.message);
  if (publicResponse) return { response: publicResponse };

  throw new Error('AI Subsystem is currently unreachable.');
}
