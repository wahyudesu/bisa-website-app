import { Duration } from '@/lib/duration'
import { getModelClient } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import ratelimit from '@/lib/ratelimit'
import { fragmentSchema as schema } from '@/lib/schema'
import { streamObject, LanguageModel, CoreMessage } from 'ai'
import { PROMPT } from '@/lib/prompt'
import { AISDKExporter } from 'langsmith/vercel';
import { createOpenAI } from '@ai-sdk/openai'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://ai.sumopod.com/v1',
})


export const maxDuration = 60

const rateLimitMaxRequests = 12
const ratelimitWindow: Duration = '1d'

export async function POST(req: Request) {
  console.log('[CHAT] Incoming POST request to /api/ai/chat')
  
  // POST request should contain messages, model, and config
  const {
    messages,
    model,
    config,
  }: {
    messages: CoreMessage[]
    model: LLMModel
    config: LLMModelConfig
  } = await req.json()

  console.log('[CHAT] Request payload:', {
    messageCount: messages?.length,
    model,
    hasApiKey: !!config?.apiKey,
    config: { ...config, apiKey: config?.apiKey ? '[REDACTED]' : undefined }
  })

  // Rate limit
  const limit = !config.apiKey
    ? await ratelimit(
        req.headers.get('x-forwarded-for'),
        rateLimitMaxRequests,
        ratelimitWindow,
      )
    : false

  if (limit) {
    console.log('[CHAT] Rate limit hit:', {
      limit: limit.amount,
      remaining: limit.remaining,
      reset: limit.reset
    })
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }

  console.log('[CHAT] Rate limit check passed')

  // Validate messages
  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
  const modelClient = getModelClient(model, config)
  
  console.log('[CHAT] Model client created for:', model)

  try {
    console.log('[CHAT] Starting streamObject with model:', model)
    console.log('[CHAT] Model params:', modelParams)
    console.log('[CHAT] Using schema keys:', Object.keys(schema.shape))
    console.log('[CHAT] Using system prompt length:', PROMPT.length)
    console.log('[CHAT] Messages count:', messages.length)
    
    const stream = await streamObject({
      model: openai('gpt-4.1-mini'),
      schema,
      system: PROMPT,
      messages,
      maxRetries: 0, // do not retry on errors
      experimental_telemetry: AISDKExporter.getSettings(),
      ...modelParams,
    })

    console.log('[CHAT] StreamObject created successfully, returning response')
    return stream.toTextStreamResponse()
  } catch (error: any) {
    console.error('[CHAT] Error occurred:', {
      message: error?.message,
      statusCode: error?.statusCode,
      stack: error?.stack
    })
    
    const isRateLimitError =
      error && (error.statusCode === 429 || error.message.includes('limit'))
    const isOverloadedError =
      error && (error.statusCode === 529 || error.statusCode === 503)

    if (isRateLimitError) {
      console.log('[CHAT] Rate limit error detected')
      return new Response(
        'The provider is currently unavailable due to request limit. Try using your own API key.',
        {
          status: 429,
        },
      )
    }

    if (isOverloadedError) {
      console.log('[CHAT] Provider overloaded error detected')
      return new Response(
        'The provider is currently unavailable. Please try again later.',
        {
          status: 529,
        },
      )
    }

    console.error('[CHAT] Unexpected error:', error)

    return new Response(
      'An unexpected error has occurred. Please try again later.',
      {
        status: 500,
      },
    )
  }
}
