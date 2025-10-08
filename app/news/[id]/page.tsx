





"use client";

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, User, Share2, Copy, Instagram, Facebook, Mail, Check } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Blog posts data (same as NewsTab)
const blogPosts = [
  {
    id: 3,
    title: "Legends, Drama & The Future of WoSo: Sinclair's Curtain Call, Riley's Goodbye, and a League That Just Won't Chill",
    excerpt: "If the NWSL had a middle name, it'd be \"plot twist.\" This week gave us teary tributes, chaotic comebacks, and just enough off-field debate to keep the offseason group chats alive.",
    author: "WoSoLive Editorial",
    publishedAt: "2025-10-07T12:58:00Z",
    readTime: "6 min read",
    category: "Analysis",
    image: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/BbG-D8Z-d7RbXTJqi9l_W/tmpw9vhqenq.jpg",
    tags: ["NWSL", "Sinclair", "Riley", "Legends", "Analysis", "Current"],
    fullContent: `If the NWSL had a middle name, it'd be "plot twist." This week gave us teary tributes, chaotic comebacks, and just enough off-field debate to keep the offseason group chats alive.

---

###  Sinclair's Farewell: One Last Win for No. 12

In Portland, the **Christine Sinclair Era** officially entered the history books. The Thorns retired her iconic **No. 12** in front of a roaring Providence Park crowd — the club's first-ever jersey retirement.

The ceremony was pure Portland: smoke, scarves, and a sea of red and black chanting her name. But the team didn't stop at nostalgia. **Olivia Moultrie** scored both goals in a 2–1 win over Bay FC, with **Sam Coffey** pulling the strings like a future captain-in-waiting.

Sinclair's resume reads like soccer folklore:

* 12 seasons with the Thorns
* 3 NWSL titles, 2 Shields
* 237 appearances, 79 goals, 18,000+ minutes
* And, of course, *190 international goals* — the most by any player, ever.

The No. 12 is officially retired. Her impact? Untouchable.

---

###  Ali Riley's Final Lap: Class, Grit, and the Heart of L.A.

Down the coast, **Ali Riley** — captain, creator, and certified locker-room legend — confirmed that this season will be her last.

After nearly two decades of global footballing, Riley says she's ready to bow out on her own terms. As she told *The Athletic*:

> "My body still wants to be here, but I also want to go out while I'm proud of the player I am."

From Stanford to Chelsea to Angel City, Riley has been the gold standard for professionalism and perspective. She helped turn Angel City from an idea into a culture, setting a blueprint for every expansion club that follows.

This isn't just a retirement — it's a changing of the guard.

---

###  Money Moves & Mayhem

The headlines keep cashing in.

* **Alyssa Thompson** officially made her **Chelsea debut**, cementing her $1.3 million transfer as one of the biggest in NWSL history.
* **Gisele Thompson**, meanwhile, locked in with **Angel City through 2029**, because L.A. needed *some* good news this month.
* **Jaedyn Shaw's Gotham deal** might've cooled off the timeline, but it lit a fire under every GM in the league.

And then there's **Chicago**, still out here causing chaos for fun. The Stars dropped five on Orlando in their new lakeside home, led by **Ludmila**, who's out here turning the Golden Boot race into Cirque du Soleil.

Over in D.C., the **Washington Spirit** delivered pure chaos theatre: a 95th-minute equalizer from **Delphine Cascarino**, followed by a **97th-minute winner** from **Rosemonde Kouassi**. Oh, and they broke their single-season *attendance* record while doing it. No notes.

---

###  Europe's Calling — and the NWSL's Watching

While all this unfolded stateside, the **Champions League** returned with U.S. stars everywhere:

* **Alyssa Thompson** and **Cat Macario** in Chelsea blue,
* **Caitlin Foord** and **Delphine Cascarino** in Arsenal-Lyon chaos,
* and a reminder that the transatlantic talent flow isn't slowing down.

The question hanging in the air: can the NWSL keep its stars *and* its soul? Because the transfer fees are going up, and so are the expectations.

---

###  WoSoLive Take

This week felt like watching a timeline hand itself off in real time:

* **Sinclair** took her final bow.
* **Riley** started her goodbye tour.
* **Thompson**, **Moultrie**, and **Shaw** showed us the next act.

The NWSL is no longer a fledgling league — it's a living, breathing ecosystem of legacy, ambition, and beautiful chaos. And that chaos? It's exactly why we watch.`
  },
  {
    id: 2,
    title: "Introducing WoSoLive: Your New Home for Women's Soccer Scores and Competitions",
    excerpt: "Women's soccer is exploding in popularity around the world — from the sold-out stadiums of the NWSL and WSL to the magic of the Women's World Cup. Fans want more ways to follow their favorite clubs, leagues, and national teams in one place. That's where WoSoLive comes in.",
    author: "WoSoLive Editorial",
    publishedAt: "2024-09-07T21:55:00Z",
    readTime: "4 min read",
    category: "Feature",
    image: "https://assets.macaly-user-data.dev/lqya212xf2v8ds14rlaczojb/u9qnvvyfj3ej9xs79f3r1cyo/hUQfocJKZvW2zVrFB-Jh8/tmp34bshfi5.jpg",
    tags: ["WoSoLive", "Introduction", "Women's Soccer", "Platform", "Community", "Instagram"],
    fullContent: `Women's soccer is exploding in popularity around the world — from the sold-out stadiums of the NWSL and WSL to the magic of the Women's World Cup. Fans want more ways to follow their favorite clubs, leagues, and national teams in one place. That's where WoSoLive comes in.

🌍 What is WoSoLive?

WoSoLive is a brand-new website dedicated to women's soccer scores, fixtures, and standings across the globe. Instead of digging through multiple sites or apps that mix men's and women's football together, WoSoLive puts the women's game front and center.

Here's what you'll find:
• 📅 Live Fixtures & Results: Stay up to date with the NWSL, WSL, Liga F, Frauen-Bundesliga, and more.
• 🌎 International Competitions: Follow the FIFA Women's World Cup, UEFA Women's Champions League, Copa América Femenina, and beyond.
• 🔍 Smart Filters: Browse by region (North America, Europe, South America, etc.) or by competition type (league, cup, invitational).
• ⭐ Focus on WoSo Only: No distractions — just women's soccer, all in one place.

📱 WoSoLive on Instagram

We're also building a community on Instagram! Follow @WoSoLive for:
• Matchday graphics
• Standout performances
• Tournament highlights
• Kit drops and behind-the-scenes moments

The website brings you the data, while Instagram brings you the story.

🚀 Why WoSoLive?

Because the women's game deserves a platform designed for it — with the respect, coverage, and detail fans are asking for. Whether you're following the NWSL playoffs, a Champions League night in Europe, or discovering new leagues like USL Super League or Liga MX Femenil, WoSoLive is here to make it easy.

🌟 What Makes Us Different

• Real-Time Updates: Live scores and standings that refresh every 60 seconds
• Comprehensive Coverage: From top-tier leagues like NWSL and WSL to emerging competitions worldwide
• Women's Soccer First: Built specifically for the women's game, not as an afterthought
• Community Focus: Connect with fellow fans through our growing Instagram community

👉 Ready to explore? You're already here at WoSoLive.com — check out today's fixtures and standings. And don't forget to follow us on Instagram @WoSoLive to keep the conversation going.

Welcome to the future of women's soccer coverage. Welcome to WoSoLive.`
  },
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

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [article, setArticle] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        console.log('ArticlePage rendered for ID:', resolvedParams.id);
        
        const id = parseInt(resolvedParams.id);
        setArticleId(id);
        
        const foundArticle = blogPosts.find(post => post.id === id);
        if (!foundArticle) {
          notFound();
          return;
        }
        setArticle(foundArticle);
      } catch (error) {
        console.error('Error loading article params:', error);
        notFound();
      }
    };
    
    loadParams();
  }, [params, router]);
  
  if (!article) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const shareToSocial = (platform: string, url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    switch (platform) {
      case 'instagram':
        // Instagram doesn't have a direct web share URL, so we copy the link
        copyToClipboard(url);
        return;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/?tab=news">
            <Button variant="ghost" className="text-woso-purple hover:text-woso-purple/80 p-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{article.readTime}</span>
              </div>
              <span className="text-woso-purple font-medium">{formatDate(article.publishedAt)}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6" data-macaly="article-title">
            {article.title}
          </h1>
        </div>

        {/* Article Image */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg mb-8">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
            data-macaly="article-image"
          />
        </div>

        {/* Article Content */}
        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed text-lg" data-macaly="article-content">
              <ReactMarkdown 
                components={{
                  h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                  hr: ({node, ...props}) => <hr className="my-8 border-gray-200" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="mb-4 ml-6 list-disc" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                  em: ({node, ...props}) => <em className="italic" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-woso-purple pl-4 italic text-gray-700 my-6" {...props} />
                }}
              >
                {article.fullContent}
              </ReactMarkdown>
            </div>
          </div>
        </Card>

        {/* Article Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm hover:bg-woso-purple/10 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Bottom Share Section */}
        <Card className="p-6 bg-gradient-to-r from-woso-purple/5 to-blue-50/50 border-woso-purple/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enjoyed this article?</h3>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <Button 
                onClick={() => shareToSocial('instagram', currentUrl, article.title)}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Share on Instagram
              </Button>
              
              <Button 
                onClick={() => shareToSocial('facebook', currentUrl, article.title)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Share on Facebook
              </Button>
              
              <Button 
                onClick={() => copyToClipboard(currentUrl)}
                variant="outline"
                className={`transition-colors ${copySuccess 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'hover:bg-woso-purple/5 hover:border-woso-purple'
                }`}
              >
                {copySuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}






