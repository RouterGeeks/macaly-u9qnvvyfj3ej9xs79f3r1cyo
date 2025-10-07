"use client";
// Force server restart to fix 524 timeout

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import LiveTab from '@/components/LiveTab';
import FixturesTab from '@/components/FixturesTab';
import StandingsTab from '@/components/StandingsTab';
import NewsTab from '@/components/NewsTab';
import TabHandler from '@/components/TabHandler';

function HomeContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize with URL parameter if available
    const tabParam = searchParams.get('tab');
    if (tabParam && ['home', 'fixtures', 'standings', 'news'].includes(tabParam)) {
      return tabParam;
    }
    return 'home';
  });
  
  // Add debugging for tab changes
  const handleTabChange = (newTab: string) => {
    console.log('Tab changing from', activeTab, 'to', newTab);
    setActiveTab(newTab);
    console.log('New active tab set to:', newTab);
  };

  console.log('Home page rendered with activeTab:', activeTab);

  const renderActiveTab = () => {
    console.log('Rendering tab:', activeTab);
    switch (activeTab) {
      case 'home':
        return <LiveTab />;
      case 'fixtures':
        console.log('About to render FixturesTab');
        return <FixturesTab />;
      case 'standings':
        return <StandingsTab />;
      case 'news':
        return <NewsTab />;
      default:
        return <LiveTab />;
    }
  };

  return (
    <div className="min-h-screen bg-woso-gradient">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <TabHandler activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-4xl" data-macaly="main-content">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

