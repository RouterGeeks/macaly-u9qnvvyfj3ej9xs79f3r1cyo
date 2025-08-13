"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Trophy, Menu, X, Newspaper } from 'lucide-react';

const NavigationTabs = [
  { id: 'home', label: 'Live', icon: Home },
  { id: 'fixtures', label: 'Fixtures', icon: Calendar },
  { id: 'standings', label: 'Tables', icon: Trophy },
  { id: 'news', label: 'News', icon: Newspaper },
];

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('Navigation rendered with activeTab:', activeTab);

  return (
    <>
      {/* Header */}
      <header className="bg-woso-black/90 backdrop-blur-lg shadow-2xl relative border-b-4 border-woso-purple-500">
        <div className="px-4 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4" data-macaly="app-logo">
            <img 
              src="https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/N4lc3Jp4Wl1LZhnw4hY3b/woso-emoji.png"
              alt="WoSoLive Logo"
              className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-lg"
            />
            <div className="flex flex-col">
              <div className="text-woso-cream text-2xl sm:text-3xl font-extrabold tracking-tight">
                WoSo<span className="text-woso-purple-400">Live</span>
              </div>
              <div className="text-woso-teal-400 text-sm sm:text-base font-semibold tracking-wide">
                Women's Soccer Live
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-woso-cream p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {NavigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  onClick={() => {
                    console.log('Tab clicked:', tab.id);
                    onTabChange(tab.id);
                  }}
                  className={`text-woso-cream font-semibold hover:bg-woso-gradient-purple/60 transition-all duration-300 ${
                    activeTab === tab.id ? 'bg-woso-gradient-electric text-woso-cream border-2 border-woso-blue-400 shadow-xl' : 'hover:shadow-lg'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-woso-black/95 backdrop-blur-lg border-t border-woso-purple-500">
            <nav className="px-4 py-4 space-y-2">
              {NavigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => {
                      console.log('Mobile tab clicked:', tab.id);
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start text-woso-cream font-semibold hover:bg-woso-gradient-purple/60 transition-all duration-300 ${
                      activeTab === tab.id ? 'bg-woso-gradient-electric border-l-4 border-woso-teal-400 shadow-lg' : ''
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-woso-black/90 border-t-2 border-woso-purple-500 z-50 backdrop-blur-lg shadow-2xl">
        <div className="flex">
          {NavigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  console.log('Bottom nav clicked:', tab.id);
                  onTabChange(tab.id);
                }}
                className={`flex-1 py-3 px-2 flex flex-col items-center space-y-1 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-woso-teal-400 bg-woso-gradient-electric/20 border-t-2 border-woso-blue-400' 
                    : 'text-woso-cream/70 hover:text-woso-cream hover:bg-woso-purple-800/30'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}