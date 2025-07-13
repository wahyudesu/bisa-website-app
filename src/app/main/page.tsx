'use client'

import { Chat } from '@/components/chat'
import { ChatInput } from '@/components/chat-input'
import { ChatPicker } from '@/components/chat-picker'
import { NavBar } from '@/components/navbar'
import { Preview } from '@/components/preview'
import { Message, toAISDKMessages, toMessageImage } from '@/lib/messages'
import { LLMModelConfig } from '@/lib/models'
import modelsList from '@/lib/models.json'
import { FragmentSchema, fragmentSchema as schema } from '@/lib/schema'
import { supabase } from '@/lib/supabase'
import { ExecutionResult } from '@/lib/types'
import { DeepPartial } from 'ai'
import { experimental_useObject as useObject } from 'ai/react'
import { SetStateAction, useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useUser } from '@clerk/nextjs'

export default function Home() {
  const [chatInput, setChatInput] = useLocalStorage('chat', '')
  const [files, setFiles] = useState<File[]>([])
  const [languageModel, setLanguageModel] = useLocalStorage<LLMModelConfig>(
    'languageModel',
    {
      model: 'gpt-4.1-mini',
    },
  )

  const [result, setResult] = useState<ExecutionResult>()
  const [messages, setMessages] = useState<Message[]>([])
  const [fragment, setFragment] = useState<DeepPartial<FragmentSchema>>()
  const [currentTab, setCurrentTab] = useState<'code' | 'fragment'>('code')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isAuthDialogOpen, setAuthDialog] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  // const { session, userTeam } = useAuth(setAuthDialog, setAuthView)
  const { user, isSignedIn } = useUser()

  // Check for data from landing page
  useEffect(() => {
    const landingInput = localStorage.getItem('landingPageInput');
    const landingModel = localStorage.getItem('landingPageModel');
    const landingFiles = localStorage.getItem('landingPageFiles');
    
    if (landingInput) {
      setChatInput(landingInput);
      localStorage.removeItem('landingPageInput');
    }
    // Remove template handling since we only use enggan-ngoding
    localStorage.removeItem('landingPageTemplate');
    if (landingModel) {
      setLanguageModel(JSON.parse(landingModel));
      localStorage.removeItem('landingPageModel');
    }
    if (landingFiles) {
      // Note: Files from localStorage will be empty arrays since File objects can't be serialized
      localStorage.removeItem('landingPageFiles');
    }
    
    // Auto submit if there's input from landing page
    if (landingInput && isSignedIn) {
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
      }, 500);
    }
  }, [isSignedIn]);

  // Only OpenAI models (modelsList is an array)
  const filteredModels = (modelsList as any)
    .filter((model: any) => model.providerId === 'openai')
    .map((model: any) => ({
      ...model,
      provider: 'openai' as const, // Cast to match LLMModel type
      providerId: 'openai' as const, // Ensure providerId is the literal type "openai"
    }))

  const currentModel = filteredModels.find(
    (model: any) => model.id === languageModel.model,
  )
  const lastMessage = messages[messages.length - 1]

  const { object, submit, isLoading, stop, error } = useObject({
    api: '/api/ai', // Using ai endpoint for chat
    schema,
    onError: (error) => {
      console.error('[FRONTEND] Error submitting request:', error)
      console.error('[FRONTEND] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      })
      if (error.message.includes('limit')) {
        setIsRateLimited(true)
      }

      setErrorMessage(error.message)
    },
    onFinish: async ({ object: fragment, error }) => {
      console.log('[FRONTEND] onFinish called with:', { fragment, error })
      
      if (!error) {
        // send it to ai endpoint for execution
        console.log('[FRONTEND] Fragment generated successfully, sending to sandbox:', fragment)
        setIsPreviewLoading(true)

        try {
          const response = await fetch('/api/ai?action=execute', { // Using ai endpoint for sandbox execution
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fragment,
              userID: user?.id,
              teamID: undefined, // No team concept in Clerk
              accessToken: undefined, // No access token needed
            }),
          })

          console.log('[FRONTEND] Sandbox response status:', response.status)
          
          if (!response.ok) {
            throw new Error(`Sandbox execution failed: ${response.status}`)
          }

          const result = await response.json()
          console.log('[FRONTEND] Sandbox execution result:', result)

          setResult(result)
          setCurrentPreview({ fragment, result })
          setMessage({ result })
          setCurrentTab('fragment')
          setIsPreviewLoading(false)
        } catch (error) {
          console.error('[FRONTEND] Sandbox execution error:', error)
          setIsPreviewLoading(false)
        }
      } else {
        console.error('[FRONTEND] Fragment generation failed:', error)
      }
    },
  })

  console.log('[FRONTEND] Current object state:', object)
  console.log('[FRONTEND] Current isLoading state:', isLoading)
  console.log('[FRONTEND] Current error state:', error)

  useEffect(() => {
    console.log('[FRONTEND] useEffect triggered - object changed:', object)
    
    if (object) {
      console.log('[FRONTEND] Setting fragment from object:', object)
      setFragment(object)
      const content: Message['content'] = [
        { type: 'text', text: object.commentary || '' },
        { type: 'code', text: object.code || '' },
      ]

      if (!lastMessage || lastMessage.role !== 'assistant') {
        console.log('[FRONTEND] Adding new assistant message')
        addMessage({
          role: 'assistant',
          content,
          object,
        })
      }

      if (lastMessage && lastMessage.role === 'assistant') {
        console.log('[FRONTEND] Updating existing assistant message')
        setMessage({
          content,
          object,
        })
      }
    }
  }, [object])

  useEffect(() => {
    if (error) stop()
  }, [error])

  function setMessage(message: Partial<Message>, index?: number) {
    setMessages((previousMessages) => {
      const updatedMessages = [...previousMessages]
      updatedMessages[index ?? previousMessages.length - 1] = {
        ...previousMessages[index ?? previousMessages.length - 1],
        ...message,
      }

      return updatedMessages
    })
  }

  async function handleSubmitAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!isSignedIn) {
      return setAuthDialog(true)
    }

    if (isLoading) {
      stop()
    }

    const content: Message['content'] = [{ type: 'text', text: chatInput }]
    const images = await toMessageImage(files)

    if (images.length > 0) {
      images.forEach((image) => {
        content.push({ type: 'image', image })
      })
    }

    const updatedMessages = addMessage({
      role: 'user',
      content,
    })

    submit({
      userID: user?.id,
      teamID: undefined,
      messages: toAISDKMessages(updatedMessages),
      model: currentModel,
      config: languageModel,
    })

    setChatInput('')
    setFiles([])
    setCurrentTab('code')

  }

  function retry() {
    submit({
      userID: user?.id,
      teamID: undefined,
      messages: toAISDKMessages(messages),
      model: currentModel,
      config: languageModel,
    })
  }

  function addMessage(message: Message) {
    setMessages((previousMessages) => [...previousMessages, message])
    return [...messages, message]
  }

  function handleSaveInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value)
  }

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change)
  }

  function logout() {
    supabase
      ? supabase.auth.signOut()
      : console.warn('Supabase is not initialized')
  }

  function handleLanguageModelChange(e: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...e })
  }

  function handleClearChat() {
    stop()
    setChatInput('')
    setFiles([])
    setMessages([])
    setFragment(undefined)
    setResult(undefined)
    setCurrentTab('code')
    setIsPreviewLoading(false)
  }

  function setCurrentPreview(preview: {
    fragment: DeepPartial<FragmentSchema> | undefined
    result: ExecutionResult | undefined
  }) {
    setFragment(preview.fragment)
    setResult(preview.result)
  }

  function handleUndo() {
    setMessages((previousMessages) => [...previousMessages.slice(0, -2)])
    setCurrentPreview({ fragment: undefined, result: undefined })
  }

  return (
    <main className="flex min-h-screen max-h-screen">
      <div className="grid w-full" style={{ gridTemplateColumns: fragment ? '40% 60%' : '100%' }}>
        <div
          className={`flex flex-col w-full max-h-full max-w-[800px] mx-auto px-4 overflow-auto ${fragment ? '' : 'col-span-2'}`}
        >          <NavBar
            user={user || null}
            showLogin={() => setAuthDialog(true)}
            signOut={() => {}}
            onClear={handleClearChat}
            canClear={messages.length > 0}
            canUndo={messages.length > 1 && !isLoading}
            onUndo={handleUndo}
          />
          <Chat
        messages={messages}
        isLoading={isLoading}
        setCurrentPreview={setCurrentPreview}
          />
          <ChatInput
        retry={retry}
        isErrored={error !== undefined}
        errorMessage={errorMessage}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        stop={stop}
        input={chatInput}
        handleInputChange={handleSaveInputChange}
        handleSubmit={handleSubmitAuth}
        isMultiModal={currentModel?.multiModal || false}
        files={files}
        handleFileChange={handleFileChange}
          >
        <ChatPicker
          models={filteredModels}
          languageModel={languageModel}
          onLanguageModelChange={handleLanguageModelChange}
        />
          </ChatInput>
        </div>        {fragment && (
          <Preview
            teamID={undefined}
            accessToken={undefined}
            selectedTab={currentTab}
            onSelectedTabChange={setCurrentTab}
            isChatLoading={isLoading}
            isPreviewLoading={isPreviewLoading}
            fragment={fragment}
            result={result as ExecutionResult}
            onClose={() => setFragment(undefined)}
          />
        )}
      </div>
    </main>
  )
}
