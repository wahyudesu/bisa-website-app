'use client';

// import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/chat-input';
import { ChatPicker } from '@/components/chat-picker';
import modelsList from '@/lib/models.json';
import templates, { TemplateId } from '@/lib/templates';
import { LLMModelConfig } from '@/lib/models';
import { SetStateAction } from 'react';

const suggestions = [
  "Social media feed",
  "Music player",
  "Crypto portfolio tracker",
  "Recharts dashboard",
];

const Page = () => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>('auto');
  const [languageModel, setLanguageModel] = useState<LLMModelConfig>({ model: 'gpt-4o-mini' });
  const router = useRouter();

  // Only OpenAI models (modelsList is an array)
  const filteredModels = (modelsList as any)
    .filter((model: any) => model.providerId === 'openai')
    .map((model: any) => ({ 
      ...model,
      provider: 'openai' as const,
      providerId: 'openai' as const,
    }));

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change);
  }

  function handleLanguageModelChange(config: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...config });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Store the input data and redirect to main page
    if (value.trim()) {
      // Store in localStorage to be used by main page
      localStorage.setItem('landingPageInput', value);
      localStorage.setItem('landingPageTemplate', selectedTemplate);
      localStorage.setItem('landingPageModel', JSON.stringify(languageModel));
      localStorage.setItem('landingPageFiles', JSON.stringify(files));
      
      // Redirect to main page
      router.push('/main');
    }
  }

  const currentModel = filteredModels.find(
    (model: any) => model.id === languageModel.model,
  );

  return (
    <div className="min-h-screen dark:bg-transparent bg-transparent flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Ingin bikin landingpage namun malas ngoding</h1>
        <p className="text-lg text-center mb-8">Create apps and websites by chatting with AI</p>
        <div className="w-full max-w-2xl">
          <ChatInput
            retry={() => {}}
            isErrored={false}
            errorMessage=""
            isLoading={false}
            isRateLimited={false}
            stop={() => {}}
            input={value}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isMultiModal={currentModel?.multiModal || false}
            files={files}
            handleFileChange={handleFileChange}
          >
            <ChatPicker
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectedTemplateChange={setSelectedTemplate}
              models={filteredModels}
              languageModel={languageModel}
              onLanguageModelChange={handleLanguageModelChange}
            />
          </ChatInput>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            {suggestions.map((s, i) => (
              <Button key={i} className="bg-neutral-900 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-neutral-700" size="sm">
                {s}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
