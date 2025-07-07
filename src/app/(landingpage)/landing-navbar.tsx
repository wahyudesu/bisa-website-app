"use client";
import ThemeToggle from '@/components/ui/theme-toggle';

export default function LandingNavBar() {
  return (
    <header className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-6 bg-red-500 dark:bg-red-700">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">❤️ Lovable</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="text-white font-bold text-xs">M</span>
          <span className="text-white text-xs font-semibold ml-1">My Lovable</span>
        </div>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
