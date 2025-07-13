// This API has been modularized into separate endpoints:
// - /api/ai/chat - for chat/LLM generation
// - /api/ai/sandbox - for sandbox execution
//
// This file is kept for backward compatibility with the original routing logic.

export async function POST(req: Request) {
  console.log('[AI_ROUTER] Incoming POST request to /api/ai')
  
  const url = new URL(req.url)
  const action = url.searchParams.get('action') // 'chat' or 'execute'
  
  console.log('[AI_ROUTER] Action parameter:', action)

  if (action === 'execute') {
    console.log('[AI_ROUTER] Routing to sandbox handler')
    // Import and call sandbox handler
    const { POST: sandboxHandler } = await import('./sandbox/route')
    return sandboxHandler(req)
  } else {
    console.log('[AI_ROUTER] Routing to chat handler')
    // Import and call chat handler
    const { POST: chatHandler } = await import('./chat/route')
    return chatHandler(req)
  }
}
