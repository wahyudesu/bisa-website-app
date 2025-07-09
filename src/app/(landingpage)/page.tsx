'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ChatInput } from '@/components/chat-input';
import { ChatPicker } from '@/components/chat-picker';
import modelsList from '@/lib/models.json';
import templates, { TemplateId } from '@/lib/templates';
import { LLMModelConfig } from '@/lib/models';
import { SetStateAction } from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

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
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 h-screen">
        <h1 className="text-4xl md:text-5xl font-bold text-center pt-40">Ingin bikin landingpage namun malas ngoding</h1>
        <p className="text-lg text-center py-8">Create apps and websites by chatting with AI</p>
        
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
              <Button 
                key={i} 
                className="bg-neutral-900 text-white rounded-full px-4 py-2 text-xs font-medium hover:bg-neutral-700" 
                size="sm"
                onClick={() => setValue(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {/* FAQ Section - Improved */}
      <div className='bg-[#8d10e8] mt-40 justify-center items-center flex flex-col'>
        <section className="w-full max-w-2xl mt-12 mb-8">
          <Card className="bg-white dark:bg-neutral-900 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">Apa itu Enggan Ngoding?</AccordionTrigger>
                  <AccordionContent>
                    Enggan Ngoding adalah aplikasi yang membantu Anda membuat landing page atau aplikasi web hanya dengan mendeskripsikan kebutuhan Anda ke AI, tanpa perlu menulis kode secara manual.
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Apakah gratis digunakan?</AccordionTrigger>
                  <AccordionContent>
                    Saat ini aplikasi dapat digunakan secara gratis untuk percobaan. Namun, penggunaan model AI tertentu mungkin memiliki batasan.
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Bagaimana cara kerjanya?</AccordionTrigger>
                  <AccordionContent>
                    Anda cukup memasukkan deskripsi aplikasi/website yang ingin dibuat, lalu AI akan menghasilkan kode dan preview yang bisa langsung Anda lihat dan gunakan.
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Apakah saya perlu login?</AccordionTrigger>
                  <AccordionContent>
                    Ya, Anda perlu login untuk menggunakan fitur penuh dan menyimpan hasil kerja Anda.
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Model AI apa yang digunakan?</AccordionTrigger>
                  <AccordionContent>
                    Aplikasi ini hanya menggunakan model OpenAI (gpt-4o, gpt-4.1, gpt-4o-mini, gpt-4.1-mini, gpt-4.1-nano).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-background text-accent-foreground mt-auto">
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Enggan Ngoding</h3>
              <p className="text-neutral-400 text-sm">
                Build beautiful websites and applications with the power of AI. No coding required.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <Separator className="my-6 bg-neutral-800" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
            <p>&copy; 2024 Enggan Ngoding. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;