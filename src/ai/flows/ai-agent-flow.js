/**
 * @fileOverview AstraX Autonomous AI Agent Flow.
 * Converted to .js for standard Node.js runtime compatibility.
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

AVAILABLE COMMANDS:
${JSON.stringify(input.commands, null, 2)}

INSTRUCTIONS:
1. Analyze the user's message.
2. If the user wants to perform a task that matches an available command (e.g., play music, search wiki, ban user, flip coin), you MUST return a structured command call.
3. If no command is relevant, engage in a helpful, context-aware conversation.
4. Use the provided history for continuity.

OUTPUT FORMAT (JSON ONLY):
{
  "response": "Brief acknowledgment of the action or helpful reply",
  "executeCommand": { "name": "command_name", "args": ["arg1", "arg2"] } // Optional
}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...input.history.map(h => ({ role: h.role, content: h.content })),
          { role: 'user', content: input.message + (input.context.quotedText ? ` [Replied to: ${input.context.quotedText}]` : '') }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = JSON.parse(response.data.choices[0]?.message?.content || '{}');
    return {
      response: result.response || "Task processed.",
      executeCommand: result.executeCommand
    };
  } catch (error) {
    console.error('Groq Agent Error:', error);
    return null;
  }
}

/**
 * Universal Zero-Key Fallback (Basic Chat).
 */
async function fallbackChat(message) {
  const urls = [
    `https://api.agatz.xyz/api/smart_ai?message=${encodeURIComponent(message)}`,
    `https://api.vytmp3.com/ai?query=${encodeURIComponent(message)}`
  ];

  for (const url of urls) {
    try {
      const res = await axios.get(url);
      const ans = res.data.data || res.data.result || res.data.ans;
      if (ans) return { response: ans };
    } catch (e) { continue; }
  }
  return { response: "I'm experiencing high latency in my cognitive nodes. Please try again." };
}

export async function aiAgentProcess(input) {
  // 1. Attempt High-Performance Groq Agent
  const groqResult = await groqAgentReasoning(input);
  if (groqResult) return groqResult;

  // 2. Absolute Fallback (Text-Only)
  return await fallbackChat(input.message);
}
