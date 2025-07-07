'use client';

// import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

// import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { GradientBars } from '@/components/ui/gradient-bars';

import { NavBar } from '@/components/navbar';
import ThemeToggle from '@/components/ui/theme-toggle';

const suggestions = [
  "Social media feed",
  "Music player",
  "Crypto portfolio tracker",
  "Recharts dashboard",
];

const Page = () => {
  const [value, setValue] = useState("");

  return (
    <div className="min-h-screen dark:bg-neutral-800 bg-neutral-200 flex flex-col relative overflow-hidden">
      {/* Main Content */}
      <GradientBars/>
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4">

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">Ingin bikin landingpage namun malas ngoding</h1>
        <p className="text-lg text-gray-200 text-center mb-8">Create apps and websites by chatting with AI</p>
        <div className="w-full max-w-2xl">
          <Card className="w-full p-0 bg-neutral-800 border border-transparent hover:border-neutral-500 rounded-3xl relative transition-all duration-200">
            <CardContent className="p-4 m-2">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className="w-full h-full bg-transparent border-none text-white placeholder:text-gray-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 shadow-none outline-none"
                  style={{ boxShadow: 'none' }}
                  placeholder="Ask Lovable to create a dashboard..."
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-2">
                    <Button className="bg-neutral-700 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" size="sm">
                      <span className="text-base">＋</span> Public
                    </Button>
                    <Button className="bg-green-700 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" size="sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Supabase
                    </Button>
                  </div>
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
