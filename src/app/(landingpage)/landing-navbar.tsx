"use client";
import ThemeToggle from '@/components/ui/theme-toggle';

export default function LandingNavBar() {
  return (
    <header className="flex items-center justify-between w-full px-48 mx-auto py-6 bg-transparent">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">❤️ Lovable</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="font-bold text-xs">M</span>
          <span className="text-xs font-semibold ml-1">My Lovable</span>
        </div>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
