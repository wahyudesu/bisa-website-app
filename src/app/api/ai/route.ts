// This API has been modularized into separate endpoints:
// - /api/ai/chat - for chat/LLM generation
// - /api/ai/sandbox - for sandbox execution
//
// This file is kept for backward compatibility with the original routing logic.

export async function POST(req: Request) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') // 'chat' or 'execute'

  if (action === 'execute') {
    // Redirect to sandbox endpoint
    const sandboxUrl = new URL('/api/ai/sandbox', url.origin)
    return fetch(sandboxUrl, {
      method: 'POST',
      headers: req.headers,
      body: await req.text(),
    })
  } else {
    // Redirect to chat endpoint
    const chatUrl = new URL('/api/ai/chat', url.origin)
    return fetch(chatUrl, {
      method: 'POST',
      headers: req.headers,
      body: await req.text(),
    })
  }
}
