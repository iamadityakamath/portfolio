import { Message } from '../components/ChatBot';

/**
 * Same-origin serverless route (api/chat.ts). No API key here — the key lives
 * server-side and never reaches the browser bundle.
 */
const CHAT_ENDPOINT = '/api/chat';

export interface StreamCallbacks {
  onTextUpdate: (text: string) => void;
  onComplete: (suggestions: string[]) => void;
  onError: (error: Error) => void;
}

/**
 * Streams a reply from the chat route.
 *
 * Wire format is newline-delimited JSON:
 *   {"content": "<token>"}          — many
 *   {"suggestions": ["a","b","c"]}  — once, last
 *
 * The previous version fired two parallel requests and could call onComplete
 * twice (once per response), which raced the typing indicator. One request,
 * one completion now.
 */
export const generateStreamingResponse = async (
  messages: Message[],
  callbacks: StreamCallbacks,
): Promise<void> => {
  let completed = false;
  const complete = (suggestions: string[]) => {
    if (completed) return;
    completed = true;
    callbacks.onComplete(suggestions);
  };

  try {
    const lastUserMessage = messages.filter((m) => m.sender === 'user').pop();
    if (!lastUserMessage) throw new Error('No user message found');

    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: lastUserMessage.text, max_tokens: 2048 }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Chat request failed (${response.status}) ${detail.slice(0, 200)}`);
    }
    if (!response.body) throw new Error('Response has no body to stream');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const handleLine = (line: string) => {
      if (!line.trim()) return;
      try {
        const data = JSON.parse(line);
        if (typeof data.content === 'string' && data.content) {
          callbacks.onTextUpdate(data.content);
        }
        if (Array.isArray(data.suggestions)) {
          complete(data.suggestions.map((s: unknown) => String(s)));
        }
      } catch {
        // Not JSON — surface it rather than dropping it silently.
        callbacks.onTextUpdate(line);
      }
    };

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        handleLine(buffer.slice(0, nl));
        buffer = buffer.slice(nl + 1);
      }
    }

    if (buffer.trim()) handleLine(buffer);

    // If the stream ended without a suggestions line, still clear the
    // typing indicator.
    complete([]);
  } catch (error) {
    console.error('Error streaming from chat API:', error);
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    complete([]);
  }
};
