import { FragmentSchema } from '@/lib/schema'
import { ExecutionResult } from '@/lib/types'
import { Sandbox } from '@e2b/code-interpreter'
import { auth } from '@clerk/nextjs/server'

export const maxDuration = 60

const sandboxTimeout = 10 * 60 * 1000 // 10 minute in ms

export async function POST(req: Request) {
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
