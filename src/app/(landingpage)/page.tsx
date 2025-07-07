'use client';

// import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

// import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

const suggestions = [
  "Social media feed",
  "Music player",
  "Crypto portfolio tracker",
  "Recharts dashboard",
];


import { ChatPicker } from '@/components/chat-picker';
import modelsList from '@/lib/models.json';
import templates, { TemplateId } from '@/lib/templates';
import { LLMModelConfig } from '@/lib/models';

const Page = () => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'auto' | TemplateId>('auto');
  const [languageModel, setLanguageModel] = useState<LLMModelConfig>({ model: 'gpt-4.1' });

  // Only OpenAI models
  const filteredModels = modelsList.models
    .filter((model) => model.providerId === 'openai')
    .map((model) => ({
      ...model,
      provider: 'openai',
      providerId: 'openai',
    }));

  function handleFileChange(change: React.SetStateAction<File[]>) {
    setFiles(change);
  }

  function handleLanguageModelChange(config: LLMModelConfig) {
    setLanguageModel({ ...languageModel, ...config });
  }

  return (
    <div className="min-h-screen dark:bg-transparent bg-transparent flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Ingin bikin landingpage namun malas ngoding</h1>
        <p className="text-lg text-center mb-8">Create apps and websites by chatting with AI</p>
        <div className="w-full max-w-2xl">
          <Card className="w-full p-0 bg-neutral-800 border border-transparent hover:border-neutral-500 rounded-3xl relative transition-all duration-200">
            <CardContent className="p-4 m-2">
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  className="w-full h-full bg-transparent border-none text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 shadow-none outline-none"
                  style={{ boxShadow: 'none' }}
                  placeholder="Ask Lovable to create a dashboard..."
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-2">
                  {/* File input, using the same mechanism as main chat */}
                  <input
                    type="file"
                    multiple
                    className="block text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-neutral-700 file:text-white hover:file:bg-neutral-600"
                    onChange={e => {
                      if (e.target.files) {
                        handleFileChange(Array.from(e.target.files));
                      }
                    }}
                  />
                  <ChatPicker
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onSelectedTemplateChange={setSelectedTemplate}
                    models={filteredModels}
                    languageModel={languageModel}
                    onLanguageModelChange={handleLanguageModelChange}
                  />
                  <Button
                    className="w-10 h-10 rounded-full bg-[#666] text-white hover:bg-[#ff6f3c] border-none shadow-none p-0 flex items-center justify-center"
                    aria-label="Send"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
