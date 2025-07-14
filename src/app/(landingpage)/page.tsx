'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreativePricing } from "./creative-pricing";
import type { PricingTier } from "./creative-pricing";
import { Check, Pencil, Star, Sparkles } from "lucide-react";
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



const typewriterExamples = [
  "Buat landingpage untuk UMKM",
  "Bikin game tetris sederhana",
  "Bikin aplikasi akuntansi",
  "Ceritakan website impianmu di sini..."
];

const sampleTiers: PricingTier[] = [
    {
        name: "Website Starter",
        icon: <Pencil className="w-6 h-6" />,
        price: "Free",
        description: "Perfect for short video beginners",
        color: "amber",
        features: [
            "60-second Video Export",
            "10 Trending Templates",
            "Auto Text-to-Speech",
            "Basic Transitions",
        ],
    },
    {
        name: "Website Pro",
        icon: <Star className="w-6 h-6" />,
        price: "Free",
        description: "For serious content creators",
        color: "blue",
        features: [
            "3-minute Video Export",
            "Voice Effects & Filters",
            "Trending Sound Library",
            "Auto Captions & Subtitles",
        ],
        popular: true,
    },
    {
        name: "Website Pro Max",
        icon: <Sparkles className="w-6 h-6" />,
        price: "Free",
        description: "For viral content masters",
        color: "purple",
        features: [
            "Multi-clip Editing",
            "Green Screen Effects",
            "Viral Sound Detection",
            "Engagement Analytics",
        ],
    },
];

function CreativePricingDemo() {
    return <CreativePricing  tiers={sampleTiers} />
}

const testimonials = [
  {
    name: "Ahmad faris",
    avatarUrl: "/form/pp.jpg",
    rating: 5,
    content: "Di local biasa aja, production luar biasa.\nAnda bingung?",
  },
  {
    name: "Harry Saputra",
    avatarUrl: "/form/pp.jpg",
    rating: 5,
    content: "udah dicoba beberapa perintah untuk bikin website yang sederhana, berfungsi dengan baik. semoga bisa di-monetisasi mas",
  },
  {
    name: "Hari Putra",
    avatarUrl: "/form/hari.png",
    rating: 5,
    content: "Cakep",
  },
  {
    name: "Faiz intifada",
    avatarUrl: "/form/faiz.png",
    rating: 5,
    content: "waaah gokill nih 😃",
  },
  {
    name: "Satrio Wicaksono",
    avatarUrl: "/form/pp.jpg",
    rating: 5,
    content: "Mantep gini",
  },
  {
    name: "Dimas Alfiansyah",
    avatarUrl: "/form/pp.jpg",
    rating: 5,
    content: "Mirip chatgpt yah",
  },
  {
    name: "Bayu Krisnayana",
    avatarUrl: "/form/bayu.png",
    rating: 5,
    content: "Kerenn mas",
  },
  // Tambahkan testimonial lain di sini sesuai kebutuhan
];

const Page = () => {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [placeholder, setPlaceholder] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Typewriter effect for placeholder, multi-example, no cursor
  useEffect(() => {
    const current = typewriterExamples[exampleIdx];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, 60);
    } else if (!isDeleting && charIdx === current.length) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setPlaceholder(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, 30);
    } else if (isDeleting && charIdx === 0) {
      // Next example
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setExampleIdx((exampleIdx + 1) % typewriterExamples.length);
      }, 400);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, exampleIdx]);

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
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center w-full px-4 py-20 sm:py-24 md:py-32">
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
            placeholder={placeholder}
          >
            {null}
          </ChatInput>
          <div className='text-center text-xs text-neutral-500 mt-4'>
            Start for free. No credit card required.
          </div>
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
      </section>

      {/* Features Section */}
      <section className="w-full flex flex-col items-center py-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10">Explore your potential with Bisa Website</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl mb-12 px-4">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 rounded-xl p-3 mb-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#a259ff" opacity="0.15"/><path d="M7 11V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4M7 11v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6M7 11h10" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Free for a week</h3>
            <p className="text-sm text-accent-foreground">Start building your web app with a 7-day free trial after sign up.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 rounded-xl p-3 mb-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#a259ff" opacity="0.15"/><path d="M8 12h8M8 16h8M8 8h8" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="4" width="16" height="16" rx="8" stroke="#a259ff" strokeWidth="2"/></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Build by prompting</h3>
            <p className="text-sm text-accent-foreground">Describe your idea and get a web app instantly. Edit it by chatting with AI.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 rounded-xl p-3 mb-3">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#a259ff" opacity="0.15"/><path d="M12 8v8M8 12h8" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Go live with 1 click</h3>
            <p className="text-sm text-accent-foreground">Publish your project under a custom domain whenever you're ready.</p>
          </div>
        </div>
        <Button size="lg" className='bg-[#a259ff] hover:bg-[#7c3aed] text-white'>
          Start Now
        </Button>
      </section>

      {/* Pricing Section */}
      <section className=" w-full flex flex-col items-center py-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10">Pricing</h2>
        <div className="w-full max-w-4xl">
          <CreativePricingDemo />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className=" w-full flex flex-col items-center py-24">
        <div className="w-full max-w-2xl px-4">
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full flex flex-col items-center py-20 bg-neutral-50 dark:bg-neutral-900">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">What people are saying</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-center mb-12 max-w-2xl">
          Thousands of developers and businesses trust Bisa Website to build their dream projects
        </p>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 w-full max-w-6xl px-4 space-y-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 break-inside-avoid p-4 hover:border-purple-500 transition-colors">
              <CardContent className="p-2">
                <div className="flex items-start space-x-3 mb-2">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-white font-semibold text-xs">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <div className="flex text-yellow-400 text-lg">
                      {"★".repeat(t.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {t.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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