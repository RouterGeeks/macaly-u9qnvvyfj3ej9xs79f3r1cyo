
# WoSoLive - Live Women's Soccer Scores

A real-time women's soccer scores application built with Next.js and powered by TheSportsDB API.

## Features

- **Live Matches**: Real-time scores and updates for women's soccer matches (updates every 60 seconds)
- **Fixtures & Results**: Upcoming matches and recent results (updates every 60 seconds)
- **League Tables**: Live standings for all major women's soccer leagues (updates every 60 seconds)
- **Comprehensive Coverage**: Coverage of major women's soccer leagues and competitions worldwide including:

### Domestic Leagues
**North America:**
- NWSL (USA)
- USL Super League (USA)
- Liga MX Femenil (Mexico)
- Northern Super League (Canada)
- League1 Canada Women

**Europe:**
- Barclays WSL (England)
- Frauen-Bundesliga (Germany)
- D1 Arkema (France)
- Serie A Femminile (Italy)
- Liga F (Spain)
- Eredivisie Women (Netherlands)
- Scottish Women's Premier League
- Damallsvenskan (Sweden)
- Toppserien (Norway)
- NIFL Women's Premiership (Northern Ireland)

**Asia & Oceania:**
- WE League (Japan)
- WK League (South Korea)
- A-League Women (Australia)
- Indian Women's League

**South America:**
- Brasileirão Feminino A1 (Brazil)
- Primera División A Women (Argentina)

**Africa:**
- Hollywoodbets Super League (South Africa)

### International Competitions
**Major Tournaments:**
- FIFA Women's World Cup
- Olympic Women's Football
- UEFA Women's Euro
- AFC Women's Asian Cup
- Copa América Femenina
- CONCACAF W Gold Cup
- CAF Women's Africa Cup of Nations

**Continental Club Competitions:**
- UEFA Women's Champions League
- Copa Libertadores Femenina
- CAF Women's Champions League
- AFC Women's Club Championship

**Invitational Tournaments:**
- SheBelieves Cup
- Arnold Clark Cup
- Tournoi de France
- Pinatar Cup
- Algarve Cup
- The Women's Cup
- World Sevens Women

## Current Status

**✅ FULLY LIVE DATA ENABLED** - The application now uses real-time data from TheSportsDB API with 60-second refresh intervals across all tabs.

### API Configuration
- Uses TheSportsDB Premium API (Key: 515171)
- All tabs refresh every 60 seconds for live updates
- Live scores, fixtures, and standings all use real-time data
- Comprehensive women's soccer league coverage
- Zero mock data - 100% live API integration

### Recent Changes
- **LIVE UPDATES**: All tabs now refresh every 60 seconds
- **NO MOCK DATA**: Completely removed all mock data
- **WOMEN'S SOCCER ONLY**: Filtered to show only women's soccer matches and leagues
- **USL SUPER LEAGUE FIXED**: Updated USL Super League competition ID from 5220 to correct 5498
- Enhanced error handling for API timeouts
- Improved filtering for women's soccer matches only

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **API**: TheSportsDB.com Premium
- **Deployment**: Macaly Platform

## Development

The app is configured to fetch live data from TheSportsDB API with 60-second refresh intervals. All mock data has been completely removed to ensure only real match data is displayed.


