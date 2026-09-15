import { handleChat } from './_core';

// Edge runtime streams token-by-token without buffering the whole response,
// which is what makes the chat feel live.
export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  return handleChat(request);
}
