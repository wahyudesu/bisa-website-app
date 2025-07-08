"use client";
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function LandingNavBar() {
  return (
    <header className="flex items-center justify-between w-full px-48 mx-auto py-6 bg-transparent">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">Enggan ngoding</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="ml-4">
          <ThemeToggle />
        </div>
        <div className="cursor-move">
          <Button>Getting started</Button>
        </div>
      </div>
    </header>
  );
}
