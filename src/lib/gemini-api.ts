import { Message } from '../components/ChatBot';

// API endpoints
const TEXT_API_ENDPOINT = 'http://localhost:8000/search_question';
const SUGGESTIONS_API_ENDPOINT = 'http://localhost:8000/suggestion';

// Interface for streaming response handlers
interface StreamCallbacks {
  onTextUpdate: (text: string) => void;
  onComplete: (suggestions: string[]) => void;
  onError: (error: Error) => void;
}



// Function to stream responses from the new API backend
export const generateStreamingResponse = async (
  messages: Message[],
  callbacks: StreamCallbacks
): Promise<void> => {
  try {
    const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    const payload = {
      question: lastUserMessage.text,
      max_tokens: 2000
    };

    // Make parallel API calls for text and suggestions
    const [textResponse, suggestionsResponse] = await Promise.all([
      fetch(TEXT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
      fetch(SUGGESTIONS_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    ]);

    if (!textResponse.ok) {
      throw new Error(`Text API request failed with status ${textResponse.status}`);
    }

    // Process suggestions response in the background
    suggestionsResponse.json().then(data => {
      if (data.suggestions && Array.isArray(data.suggestions)) {
        callbacks.onComplete(data.suggestions);
      } else {
        callbacks.onComplete([]);
      }
    }).catch(error => {
      console.error('Error processing suggestions:', error);
      callbacks.onComplete([]);
    });

    // Process streaming text response
    const reader = textResponse.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let currentResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Process complete lines from the buffer
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.trim()) {
          try {
            const jsonData = JSON.parse(line);
            if (jsonData.content) {
              callbacks.onTextUpdate(jsonData.content);
            }
            // Extract suggestions if present
            if (jsonData.suggestions && Array.isArray(jsonData.suggestions)) {
              // Always treat suggestions as an array and extract text consistently
              const suggestionTexts = jsonData.suggestions.map((suggestion: any) => {
                // If suggestion is already a string, return it directly
                if (typeof suggestion === 'string') return suggestion;
                // If suggestion is an object, try to get its text property
                if (typeof suggestion === 'object' && suggestion !== null) {
                  // First try to get the text property
                  if (suggestion.text) return suggestion.text;
                  // If no text property, try to get the first string value
                  const firstStringValue = Object.values(suggestion).find(value => typeof value === 'string');
                  if (firstStringValue) return firstStringValue;
                  // Fallback to string representation
                  return suggestion.toString();
                }
                // For any other type, convert to string
                return String(suggestion);
              });
              callbacks.onComplete(suggestionTexts);
            }
          } catch (e) {
            // If parsing fails, use the line as is
            callbacks.onTextUpdate(line);
          }
        }
      }
    }

    // Process any remaining content in the buffer
    if (buffer.trim()) {
      callbacks.onTextUpdate(buffer);
    }
  } catch (error) {
    console.error('Error streaming from API:', error);
    callbacks.onError(error instanceof Error ? error : new Error(String(error)));
  }
};