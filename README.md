# HandwerkAI — Komplette Projektstruktur

## Ordnerstruktur

```
handwerkai/
├── prisma/
│   ├── schema.prisma          ✅ Vollständiges Datenmodell
│   └── seed.ts                (Demo-Daten)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           (Landing Page)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── trends/
│   │   │   │   ├── route.ts           ✅ GET Trends
│   │   │   │   └── scan/route.ts      ✅ POST Scan auslösen
│   │   │   ├── sources/
│   │   │   │   └── route.ts           ✅ CRUD Quellen
│   │   │   ├── generate/
│   │   │   │   └── route.ts           ✅ POST Post generieren
│   │   │   ├── images/
│   │   │   │   ├── route.ts           (CRUD Bilder)
│   │   │   │   └── watermark/route.ts ✅ POST Watermark anwenden
│   │   │   ├── logo/
│   │   │   │   └── upload/route.ts    ✅ POST Logo hochladen
│   │   │   ├── company/
│   │   │   │   └── route.ts           (CRUD Firmenprofil)
│   │   │   └── planner/
│   │   │       └── route.ts           (Wochenplan CRUD)
│   │   │
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx               (Dashboard Übersicht)
│   │       ├── trends/page.tsx        (Trend Engine)
│   │       ├── sources/page.tsx       (Quellen)
│   │       ├── generator/page.tsx     (Content Generator)
│   │       ├── planner/page.tsx       (Wochenplaner)
│   │       ├── images/page.tsx        (Bilder & Watermark)
│   │       ├── analytics/page.tsx     (Analyse)
│   │       └── profile/page.tsx       (Firmenprofil)
│   │
│   ├── services/
│   │   ├── trendService.ts            ✅ Trend-Pipeline Orchestrator
│   │   ├── crawlerService.ts          ✅ Web Crawler (Cheerio)
│   │   ├── rssService.ts              ✅ RSS Feed Parser (xml2js)
│   │   ├── contentExtractionService.ts ✅ KI-Themenextraktion (Claude)
│   │   ├── trendScoringService.ts     ✅ Trend-Scoring Algorithmus
│   │   ├── contentGenerationService.ts ✅ KI-Post-Generator (Claude)
│   │   ├── watermarkService.ts        ✅ Watermark via Sharp
│   │   └── imageProcessingService.ts  (Bildvorbereitung)
│   │
│   ├── lib/
│   │   ├── prisma.ts                  (Prisma Client Singleton)
│   │   └── auth.ts                    (NextAuth Config)
│   │
│   └── components/
│       ├── ui/                        (shadcn/ui Komponenten)
│       ├── dashboard/
│       │   ├── Sidebar.tsx
│       │   ├── TrendCard.tsx
│       │   ├── PostCard.tsx
│       │   └── WeekPlanner.tsx
│       └── watermark/
│           └── WatermarkEditor.tsx
│
├── package.json                       ✅
└── .env.example
```

## Umgebungsvariablen (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/handwerkai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
ANTHROPIC_API_KEY="sk-ant-..."
UPLOADS_DIR="./uploads"
OUTPUTS_DIR="./public/generated"
```

## Backend Flow (vollständig implementiert)

```
POST /api/trends/scan
  → trendService.runFullScan(companyId)
    → Für jede TrendSource:
      → rssService.fetchFeed() | crawlerService.crawl()
      → CrawledContent speichern (dedupliziert via hash)
      → contentExtractionService.extractTopics() [Claude AI]
      → ExtractedTopic speichern
      → trendScoringService.score()
      → TrendItem erstellen (wenn Score ≥ 50)

POST /api/generate
  → contentGenerationService.generatePost() [Claude AI]
  → GeneratedPost speichern

POST /api/logo/upload
  → Logo via Sharp normalisieren → PNG
  → LogoAsset + WatermarkSettings erstellen

POST /api/images/watermark
  → watermarkService.applyWatermark() [Sharp]
  → ImageAsset aktualisieren (watermarkedUrl)
```

## KI-Prompts (Claude claude-opus-4-5)

1. **Themenextraktion**: Analysiert gecrawlten Content → liefert Topics + Keywords + Relevanz-Score
2. **Post-Generierung**: Trend + Firmenprofil + Platform → fertiger Social-Media-Post + Hashtags + CTA + Bildprompt
3. **Wochenplan**: Trends + Firmenprofil → optimierter 7-Tage-Posting-Plan

## Watermark-Pipeline (Sharp)

```
Logo (PNG/SVG) → resize auf X% der Bildbreite → Transparenz anwenden
→ composite() auf Ziel-Bild an gewählter Position → JPEG export
→ automatisch für 3 Formate: Instagram Square, Story, Facebook Post
```

## Starten

```bash
npm install
npx prisma db push
npm run dev
```
