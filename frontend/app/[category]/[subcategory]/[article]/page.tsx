import SubcategoryPage from '../page';

interface ThreeSegmentPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    article: string;
  }>;
}

export async function generateStaticParams() {
  return [
    {
      category: "business",
      subcategory: "companies",
      article: "new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae"
    },
    {
      category: "news",
      subcategory: "politics",
      article: "trump-declares-iran-ceasefire-over-raising-questions-about-the-next-phase-of-the-conflict"
    },
    {
      category: "news",
      subcategory: "markets",
      article: "us-stocks-end-higher-as-sk-hynixs-wall-street-debut-and-metas-ai-momentum-lift-markets"
    },
    {
      category: "news",
      subcategory: "world",
      article: "argentina-edge-switzerland-in-extra-time-to-set-up-world-cup-semi-final-clash-with-england"
    },
    {
      category: "news",
      subcategory: "politics",
      article: "trumps-hormuz-retreat-highlights-struggles-to-end-iran-conflict"
    },
    {
      category: "business",
      subcategory: "corporate-news",
      article: "ice-suspends-most-vehicle-stops-after-fatal-shootings-in-texas-and-maine"
    },
    {
      category: "industry-insights",
      subcategory: "health",
      article: "us-explosive-diarrhoea-outbreak-remains-unsolved-as-cases-near-7000"
    },
    {
      category: "news",
      subcategory: "markets",
      article: "crypto-news-today-july-15-bitcoin-reclaims-65000-jpmorgan-warns-of-hyperliquid-risks"
    },
    {
      category: "news",
      subcategory: "markets",
      article: "crypto-market-overview-bitcoin-stabilizes-zcash-targets-new-highs"
    }
  ];
}

export default async function ThreeSegmentArticlePage({ params }: ThreeSegmentPageProps) {
  const resolved = await params;
  
  // Delegate rendering to the article page handler using the article slug
  return SubcategoryPage({
    params: Promise.resolve({
      category: resolved.category,
      subcategory: resolved.article || resolved.subcategory
    })
  });
}
