"use client";
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';

export default function LandingNavBar() {
  return (
    <header className="flex items-center justify-between w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 mx-auto py-4 sm:py-6 bg-transparent">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
        <span className="text-lg sm:text-2xl font-bold">Bisa website</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="ml-2 sm:ml-4">
          <ThemeToggle />
        </div>
        <div>
          <Button asChild size="sm">
            <a href="/sign-up">Getting started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
