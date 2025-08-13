"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main page with news tab selected
    router.replace('/?tab=news');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-woso-purple mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to news...</p>
      </div>
    </div>
  );
}