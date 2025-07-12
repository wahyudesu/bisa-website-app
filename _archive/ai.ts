import { Duration } from '@/lib/duration'
import { getModelClient } from '@/lib/models'
import { LLMModel, LLMModelConfig } from '@/lib/models'
import ratelimit from '@/lib/ratelimit'
import { FragmentSchema, fragmentSchema as schema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import { streamObject, LanguageModel, CoreMessage } from 'ai'
import { Sandbox } from '@e2b/code-interpreter'
import { PROMPT } from '@/lib/prompt'
import { NextResponse } from 'next/server'
import { currentUser, auth } from '@clerk/nextjs/server'
import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";
import { invoke } from "braintrust";
import { AISDKExporter } from 'langsmith/vercel';

export const maxDuration = 60

const rateLimitMaxRequests = 12
const ratelimitWindow: Duration = '1d'

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export async function POST(req: Request) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') // 'chat' or 'execute'

  if (action === 'execute') {
    return handleSandboxExecution(req)
  } else {
    return handleChatGeneration(req)
  }
}

async function handleChatGeneration(req: Request) {
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

  // Rate limit
  const limit = !config.apiKey
    ? await ratelimit(
        req.headers.get('x-forwarded-for'),
        rateLimitMaxRequests,
        ratelimitWindow,
      )
    : false

  if (limit) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.amount.toString(),
        'X-RateLimit-Remaining': limit.remaining.toString(),
        'X-RateLimit-Reset': limit.reset.toString(),
      },
    })
  }

  // Validate messages
  const { model: modelNameString, apiKey: modelApiKey, ...modelParams } = config
  const modelClient = getModelClient(model, config)

  try {
    const stream = await streamObject({
      model: modelClient as LanguageModel,
      schema,
      system: PROMPT,
      messages,
      maxRetries: 0, // do not retry on errors
      // experimental_telemetry: { isEnabled: true, functionId: "ai-website" },
      experimental_telemetry: AISDKExporter.getSettings(),
      ...modelParams,
    })

    return stream.toTextStreamResponse()
  } catch (error: any) {
    const isRateLimitError =
      error && (error.statusCode === 429 || error.message.includes('limit'))
    const isOverloadedError =
      error && (error.statusCode === 529 || error.statusCode === 503)

    if (isRateLimitError) {
      return new Response(
        'The provider is currently unavailable due to request limit. Try using your own API key.',
        {
          status: 429,
        },
      )
    }

    if (isOverloadedError) {
      return new Response(
        'The provider is currently unavailable. Please try again later.',
        {
          status: 529,
        },
      )
    }

    console.error('Error:', error)

    return new Response(
      'An unexpected error has occurred. Please try again later.',
      {
        status: 500,
      },
    )
  }
}

async function handleSandboxExecution(req: Request) {
  const { userId } = await auth()
  const {
    fragment,
  }: {
    fragment: FragmentSchema
    accessToken: string | undefined
  } = await req.json()

  console.log('fragment', fragment)
  console.log('userID', userId)

  console.log('[SANDBOX] Creating sandbox with template:', fragment.template)
  const sbx = await Sandbox.create("enggan-ngoding", {
    metadata: {
      template: fragment.template,
      userID: userId ?? '',
    },
    timeoutMs: sandboxTimeout,
  })
  console.log('[SANDBOX] Created sandbox:', sbx.sandboxId)

  // Install packages
  if (fragment.has_additional_dependencies) {
    console.log('[SANDBOX] Installing dependencies:', fragment.additional_dependencies)
    await sbx.commands.run(fragment.install_dependencies_command)
    console.log(
      `[SANDBOX] Installed dependencies: ${fragment.additional_dependencies.join(', ')} in sandbox ${sbx.sandboxId}`,
    )
  }

  // Copy code to fs
  if (fragment.code && Array.isArray(fragment.code)) {
    console.log('[SANDBOX] Writing multiple files:', fragment.code.map(f => f.file_path))
    for (const file of fragment.code) {
      await sbx.files.write(file.file_path, file.file_content)
      console.log(`[SANDBOX] Copied file to ${file.file_path} in ${sbx.sandboxId}`)
    }
  } else {
    console.log('[SANDBOX] Writing single file:', fragment.file_path)
    await sbx.files.write(fragment.file_path, fragment.code)
    console.log(`[SANDBOX] Copied file to ${fragment.file_path} in ${sbx.sandboxId}`)
  }

  // Execute code or return a URL to the running sandbox
  console.log('[SANDBOX] Returning web URL:', `https://${sbx?.getHost(fragment.port || 3000)}`)
  return new Response(
    JSON.stringify({
      sbxId: sbx?.sandboxId,
      template: fragment.template,
      url: `https://${sbx?.getHost(fragment.port || 3000)}`,
    } as ExecutionResult),
  )
}
