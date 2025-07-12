// This API has been modularized into separate endpoints:
// - /api/ai/chat - for chat/LLM generation
// - /api/ai/sandbox - for sandbox execution
//
// This file is kept for backward compatibility with the original routing logic.

export async function POST(req: Request) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') // 'chat' or 'execute'

  if (action === 'execute') {
    // Import and call sandbox handler
    const { POST: sandboxHandler } = await import('./sandbox/route')
    return sandboxHandler(req)
  } else {
    // Import and call chat handler
    const { POST: chatHandler } = await import('./chat/route')
    return chatHandler(req)
  }
}
