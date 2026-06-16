/**
 * @fileOverview AstraX Autonomous AI Agent Flow with 20+ Fallbacks.
 */
import axios from 'axios';

/**
 * Primary Reasoning Engine using Groq for Task-Oriented logic.
 */
async function groqAgentReasoning(input) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const systemPrompt = `You are the AstraX Enterprise AI Agent. 
You manage a professional WhatsApp bot. 
User Identity: ${input.context.pushName} (@${input.context.sender.split('@')[0]})
Environment: ${input.context.isGroup ? 'Group Chat' : 'Private DM'}

INSTRUCTIONS:
1. Engage in a helpful, context-aware conversation.
2. Provide concise and relevant responses.
3. Use the provided history for continuity.

OUTPUT FORMAT (JSON ONLY):
{
  "response": "Brief acknowledgment of the action or helpful reply"
}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...input.history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: input.message }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000
      }
    );

    const result = JSON.parse(response.data.choices[0]?.message?.content || '{}');
    return { response: result.response || "Task processed." };
  } catch (error) {
    return null;
  }
}

/**
 * Universal 20+ Fallback AI Swarm.
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
    `https://api.agatz.xyz/api/blackbox?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/gemini?query=${encodeURIComponent(message)}`,
    `https://api.dlow.xyz/api/gemini?q=${encodeURIComponent(message)}`,
    `https://api.zahwazein.xyz/api/ai/gemini?text=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/deepseek?message=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/mistral?message=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/llama?message=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/qwen?message=${encodeURIComponent(message)}`,
    `https://api.agatz.xyz/api/claude?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/claude?query=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url, { timeout: 3000 });
      const ans = res.data.data || res.data.result || res.data.ans || res.data.content;
      if (ans) return { response: ans };
    } catch (e) { continue; }
  }
  return { response: "I'm experiencing high latency in my cognitive nodes. Please try again." };
}

export async function aiAgentProcess(input) {
  // 1. Try Groq First
  const groqResult = await groqAgentReasoning(input);
  if (groqResult) return groqResult;

  // 2. Swarm through 20+ Fallbacks
  return await fallbackSwarm(input.message);
}
