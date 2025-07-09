import { createOpenAI } from '@ai-sdk/openai'

export type LLMModel = {
  id: string
  name: string
  provider: 'openai'
  providerId: 'openai'
}

export type LLMModelConfig = {
  model?: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  maxTokens?: number
}

export function getModelClient(model: LLMModel, config: LLMModelConfig) {
  const { id: modelNameString } = model;
  const { apiKey, baseURL } = config;
  return createOpenAI({
    apiKey,
    baseURL: baseURL || 'https://ai.sumopod.com',
  })(modelNameString);
}
