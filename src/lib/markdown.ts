/**
 * Convert markdown text to HTML for chat message display
 */
export function convertMarkdownToHTML(text: string): string {
  if (!text) return '';

  // Convert code blocks with backticks
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Convert inline code with single backtick
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert bold text
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert italic text
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Convert bullet points
  text = text.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Convert line breaks
  text = text.replace(/\n/g, '<br>');

  return text;
}