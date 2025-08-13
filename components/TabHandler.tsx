"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface TabHandlerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabHandler({ activeTab, setActiveTab }: TabHandlerProps) {
  const searchParams = useSearchParams();
  
  // Set initial tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['home', 'fixtures', 'standings', 'news'].includes(tabParam)) {
      console.log('Setting initial tab from URL:', tabParam);
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  // This component doesn't render anything
  return null;
}