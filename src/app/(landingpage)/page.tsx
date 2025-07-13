'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ChatInput } from '@/components/chat-input';
import { SetStateAction } from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

const suggestions = [
  "Landingpage umkm",
  "Game tetris sederhana",
  "Aplikasi todo list",
  "Inventori Keuangan",
];

const Page = () => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  function handleFileChange(change: SetStateAction<File[]>) {
    setFiles(change);
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
      localStorage.setItem('landingPageFiles', JSON.stringify(files));
      
      // Redirect to main page
      router.push('/main');
    }
  }

  return (
    <div className="min-h-screen dark:bg-transparent bg-transparent flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 pt-44 sm:pt-48 md:pt-48">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">Ingin bikin website namun malas ngoding</h1>
        <p className="text-base sm:text-lg md:text-xl text-center py-4 font-semibold sm:py-6">Ketikin aja!</p>
        <div className="w-full max-w-2xl pb-8">
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
            isMultiModal={false}
            files={files}
            handleFileChange={handleFileChange}
          >
          
            {null}
          </ChatInput>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 sm:mt-6">
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
      <div className='bg-[#9323e3] mt-24 sm:mt-36 flex flex-col items-center w-full'>
        <section className="w-full max-w-2xl mt-8 sm:mt-12 mb-8 px-2 sm:px-0">
          <Card className="bg-white dark:bg-neutral-900 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">FAQ</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">Website apa ini?</AccordionTrigger>
                  <AccordionContent>
                    Ini tools AI untuk bikin website modal ngetik.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Mengapa harus bisa website?</AccordionTrigger>
                  <AccordionContent>
                    Aplikasi ini adalah buatan anak bangsa, jangan terus terusan pake tools AI buatan luar negeri, yuk dukung karya anak bangsa!
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Apakah gratis digunakan?</AccordionTrigger>
                  <AccordionContent>
                    Saat ini aplikasi dapat digunakan secara gratis untuk sementara. Namun, penggunaan di masa depan mungkin akan berbayar
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Bagaimana cara kerjanya?</AccordionTrigger>
                  <AccordionContent>
                    Anda cukup memasukkan deskripsi aplikasi/website yang ingin dibuat, semakin detail, maka hasilnya semakin bagus, preview yang bisa langsung Anda lihat dan gunakan.
                  </AccordionContent>
                </AccordionItem>
        
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Apakah saya perlu login?</AccordionTrigger>
                  <AccordionContent>
                    Ya, Anda perlu login untuk menggunakan fitur penuh dan menyimpan hasil kerja Anda.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full bg-background text-accent-foreground my-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Bisa website</h3>
              <p className="text-neutral-400 text-sm">
                Build beautiful websites and applications with the power of AI. No coding required.
              </p>
            </div>
          </div>
          <Separator className="my-6 bg-neutral-800" />
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-400 gap-2">
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
            <p className="text-center">&copy; 2025 Bisa website.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;