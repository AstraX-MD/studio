/**
 * @fileOverview AstraX Autonomous AI Agent (Claude Personality).
 * Powered by Groq llama-3.1-8b-instant with 20+ Fallbacks.
 */
import axios from 'axios';

/**
 * Primary Reasoning Engine using Groq (llama-3.1-8b-instant).
 */
async function groqAgentReasoning(input) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  // CLAUDE PERSONALITY OVERRIDE
  const systemPrompt = `You are Claude AI, a fast and highly intelligent WhatsApp assistant.

Rules:
1. Answer in the user's language. Match exactly.
2. Keep replies short, 2-3 lines max unless user asks for technical details.
3. Be direct, helpful, and natural.
4. If asked who you are: "I'm Claude AI"
5. If asked what model: "Claude 3.5 Sonnet (Optimized)"
6. No disclaimers. No mention of Groq, Llama, or Meta.
7. User Identity: ${input.context.pushName} (@${input.context.sender.split('@')[0]})`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...input.history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: input.message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000
      }
    );

    const ans = response.data.choices[0]?.message?.content;
    return ans ? { response: ans } : null;
  } catch (error) {
    return null;
  }
}

/**
 * Universal 20+ Fallback Swarm.
 */
async function fallbackSwarm(message) {
  const urls = [
    `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/ai?query=${encodeURIComponent(message)}`,
    `https://api.dlow.xyz/api/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.zahwazein.xyz/api/ai/gpt4?text=${encodeURIComponent(message)}`,
    `https://api.xyter.com/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.miftah.xyz/api/ai/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.caliph.biz.id/api/ai/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.paxsenix.biz.id/api/ai/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.yanzbotz.my.id/api/ai/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.erdwpe.my.id/api/ai/gpt4?q=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/deepseek?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/claude?query=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/claude?message=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 5000 });
      const ans = res.data.data || res.data.result || res.data.ans || res.data.content;
      if (ans) return { response: ans };
    } catch (e) { continue; }
  }
  return { response: "I'm currently recalibrating my neural nodes. Please try again in a moment." };
}

export async function aiAgentProcess(input) {
  // 1. Try Groq (Claude Persona)
  const groqResult = await groqAgentReasoning(input);
  if (groqResult) return groqResult;

  // 2. Swarm through 20+ Fallbacks
  return await fallbackSwarm(input.message);
}
