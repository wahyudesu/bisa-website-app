import { ExecutionError, Result } from '@e2b/code-interpreter'

type ExecutionResultBase = {
  sbxId: string
}

export type ExecutionResult = ExecutionResultBase & {
  template: 'enggan-ngoding'
  url: string
}