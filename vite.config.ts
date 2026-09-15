import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Serves api/chat.ts during `npm run dev`.
 *
 * Vite doesn't run Vercel functions, so without this `/api/chat` 404s locally
 * and you'd have to use `vercel dev` to test the chatbot. This runs the exact
 * same handler the Edge function uses.
 */
function apiDevServer(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          // Buffer the body, then hand the handler a standard Request.
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = Buffer.concat(chunks).toString('utf8');

          const { handleChat } = await server.ssrLoadModule('/api/_core.ts');

          const response: Response = await handleChat(
            new Request('http://localhost/api/chat', {
              method: req.method ?? 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: body || undefined,
            }),
            env.LLM_API_KEY,
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));

          if (!response.body) {
            res.end();
            return;
          }

          const reader = response.body.getReader();
          // Flush each chunk as it arrives so dev streams like production does.
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            res.write(Buffer.from(value));
          }
          res.end();
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[api-dev-server]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Dev API handler failed' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Loads .env without the VITE_ prefix filter. This stays in the Node
  // process — it is never injected into client code.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), apiDevServer(env)],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
