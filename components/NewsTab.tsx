"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeader from './SectionHeader';
import Link from 'next/link';
import { Clock, User, Share2, Copy, Instagram, Facebook, Mail, Check, ExternalLink } from 'lucide-react';

// Blog posts sorted by newest first
const blogPosts = [
  {
    id: 1,
    title: "NWSL Rivalry Week: Cascadia Cup? Thorns Take It. Courage? Fumble the PR Bag. Cantore? Makes History.",
    excerpt: "Week 15 had it all — if by 'all' you mean one real rivalry worth the hype, a coaching sacking that turned into a media meme, the first-ever Italian in the NWSL, and Kansas City looking down at everyone else from the top of the table like the teacher's pet they are.",
    author: "WoSoLive Editorial",
    publishedAt: "2024-08-12T14:00:00Z",
    readTime: "8 min read",
    category: "Analysis",
    image: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/7BFRSRzy5kbHxBAqxPtHI/chat-gpt-image-aug-13-2025-07-16-38-am.png",
    tags: ["NWSL", "Rivalry Week", "Cascadia Cup", "Analysis", "Thorns", "Current"],
    fullContent: `Week 15 had it all — if by "all" you mean one real rivalry worth the hype, a coaching sacking that turned into a media meme, the first-ever Italian in the NWSL, and Kansas City looking down at everyone else from the top of the table like the teacher's pet they are.

🌋 Cascadia Cup: The Only Rivalry That Understood the Assignment

Portland Thorns vs. Seattle Reign. The 24th edition of the Cascadia Cup. Final score: Thorns 4 – Reign 2.

Seattle came out swinging — Emeri Adames scored before the Riveters had finished their first tifo chant — but the Thorns, in classic "we start slow but finish loud" fashion, roared back. Sam Coffey equalized from the spot, Reilyn Turner and Pietra Tordin piled on, and Reyna Reyes capped it off with a goal and a post-match interview about culture shifts, defensive ambitions, and how sweet it feels to sink your regional rival.

Shoutout to the Riveters for once again proving they could out-sing a jet engine.

🥱 Elsewhere in "Rivalry" Week: Participation Trophies All Around

• San Diego Wave 1–1 Angel City — Late goals from Makenzy Robbe and Alanna Kennedy couldn't disguise that this rivalry has all the tension of a polite neighborhood barbecue.
• Gotham FC 0–0 Washington Spirit — The highlight? Gotham fans cheering Trinity Rodman's entrance. Enough said.
• Utah Royals 0–1 Kansas City Current — Ally Sentnor got booed on her return to Utah, but KC took the points without breaking a sweat.

🎤 The Courage's "Multitude of Factors" PR Meltdown

North Carolina Courage fired head coach Sean Nahas last week — and then held a masterclass in how not to communicate it.

Phase 1: A 39-word statement colder than a February night game.
Phase 2: A press conference so combative that "a multitude of factors" became a drinking game.
Phase 3 (Two days later): Finally admitting it was due to "confounding performance issues, culture issues, and a perceived lack of fit."

By then, the Courage had lost not just their coach but another chunk of credibility.

🇮🇹 History Made: Cantore's NWSL Debut

Sofia Cantore stepped onto the pitch for the Washington Spirit, becoming the first-ever Italian player in NWSL history. Will she be a game-changer? Possibly. Will she need time to adjust to the league's pace and physicality? Absolutely. Either way, it's a milestone — and a much-needed injection of international flair for the Spirit.

🏆 Attacking Third's Week 15 Honors

CBS Sports' Attacking Third crew rolled out their Week 15 Best XI with plenty of Cascadia flavor. Jordan Bloomer earned the goalkeeper spot, while Reyna Reyes represented the Thorns on the defensive line. Hina Sugita got the nod in midfield, and Reilyn Turner took a forward spot after her standout rivalry performance.

The show also named Ella Massar as Coach of the Week and Khloe Lash as Honorary Captain — a nod to the week's best moments on and off the field.

📊 Standings Snapshot (Week 15)

1. KC Current – 39 pts (13W–0D–2L) — flawless and smug about it.
2. Orlando Pride – 27 pts
3. Washington Spirit – 27 pts
4. San Diego Wave – 26 pts
5. Portland Thorns – 25 pts (still undefeated at home)
6. Seattle Reign – 24 pts
7. Racing Louisville – 21 pts
8. Gotham FC – 20 pts

🌍 Around the WoSo World

• Spain ditches Montse Tomé for Sonia Bermúdez. New coach, same Rubiales baggage.
• Brazil wins Copa América Femenina in a shootout over Colombia — title number nine for them.
• Jess Carter calls out racism, England stops taking the knee.

📅 What's Next

Mark KC Current vs. Orlando Pride on your calendar. Top of the table, possible playoff preview, and maybe the second match of Rivalry Week that actually feels like a rivalry.

💬 WoSoLive Take

Cascadia brought the fire. Cantore brought history. KC brought the receipts. North Carolina brought… a masterclass in saying nothing.`
  }
];

export default function NewsTab() {
  const [copySuccess, setCopySuccess] = useState<{ [key: number]: boolean }>({});
  
  console.log('NewsTab rendered - simple article list with direct links');

  const getArticleUrl = (articleId: number) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/news/${articleId}`;
    }
    return `/news/${articleId}`;
  };

  const copyToClipboard = async (text: string, articleId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(prev => ({ ...prev, [articleId]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [articleId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const shareToSocial = (platform: string, url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Analysis': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0',
      'Feature': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0',
      'Profiles': 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0',
      'Transfer News': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0',
      'Behind the Scenes': 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0'
    };
    return colors[category as keyof typeof colors] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <SectionHeader 
        title="WoSo News" 
        subtitle="Latest stories, analysis, and insights from women's soccer"
        showViewAll={false}
      />

      {/* Articles List */}
      <div className="space-y-6">
        {blogPosts.map((post, index) => (
          <Card 
            key={post.id} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-l-4 border-l-woso-purple"
          >
            <div className="md:flex">
              {/* Image */}
              <Link href={`/news/${post.id}`} className="block md:w-80 flex-shrink-0">
                <div className="relative h-48 md:h-64 overflow-hidden cursor-pointer">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                        Latest
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <Link href={`/news/${post.id}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-woso-purple transition-colors leading-tight cursor-pointer" data-macaly="article-title">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                
                {/* Meta Information and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-woso-purple font-medium">{formatDate(post.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Quick Share Buttons */}
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          shareToSocial('instagram', getArticleUrl(post.id), post.title);
                        }}
                        className="p-1 h-8 w-8 hover:bg-pink-50 hover:text-pink-600"
                        title="Share on Instagram"
                      >
                        <Instagram size={14} />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(getArticleUrl(post.id), post.id);
                        }}
                        className={`p-1 h-8 w-8 transition-colors ${
                          copySuccess[post.id] 
                            ? 'text-green-600 bg-green-50' 
                            : 'hover:bg-gray-50 hover:text-gray-700'
                        }`}
                        title="Copy link"
                      >
                        {copySuccess[post.id] ? <Check size={14} /> : <Copy size={14} />}
                      </Button>
                      
                      <Link href={`/news/${post.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1 h-8 w-8 hover:bg-woso-purple/10 hover:text-woso-purple"
                          title="Read full article"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 ml-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs hover:bg-woso-purple/10 transition-colors">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>



    </div>
  );
}