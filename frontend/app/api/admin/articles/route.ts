import { NextResponse } from 'next/server';

// GET all articles for admin management
export async function GET() {
  try {
    const fallbackArticles = [
      {
        id: 1,
        title: "Airbus puts a price on Canadian jet fuel security",
        slug: "airbus-puts-a-price-on-canadian-jet-fuel-security",
        description: "Airbus has signaled a strategic focus on Canadian jet fuel supply pipelines, evaluating sustainable aviation fuel procurement.",
        author_name: "Jennifer Friesen",
        category_name: "News",
        category_slug: "news",
        is_featured: true,
        is_editors_pick: true,
        published_at: "2026-07-22 18:08:00"
      },
      {
        id: 2,
        title: "Venture capital firms shift focus to sustainable tech sector pipelines",
        slug: "venture-capital-firms-shift-focus-to-sustainable-tech-sector-pipelines",
        description: "Venture capital firms across North America are pivoting investment thesis parameters toward green computing.",
        author_name: "Jennifer Friesen",
        category_name: "Industry Insights",
        category_slug: "industry-insights",
        is_featured: true,
        is_editors_pick: true,
        published_at: "2026-07-22 16:30:00"
      },
      {
        id: 3,
        title: "How remote leadership models are evolving to meet product goals",
        slug: "how-remote-leadership-models-are-evolving-to-meet-product-goals",
        description: "Engineering leads and executive directors are overhauling synchronous management paradigms in favor of outcome-driven asynchronous workflows.",
        author_name: "Jennifer Friesen",
        category_name: "Industry Insights",
        category_slug: "industry-insights",
        is_featured: false,
        is_editors_pick: true,
        published_at: "2026-07-21 14:15:00"
      },
      {
        id: 4,
        title: "Global logistics platforms integrate machine learning for routing",
        slug: "global-logistics-platforms-integrate-machine-learning-for-routing",
        description: "Freight operators and global supply chain hubs have begun deploying predictive machine learning algorithms.",
        author_name: "Pramod Jain",
        category_name: "Industry Insights",
        category_slug: "industry-insights",
        is_featured: false,
        is_editors_pick: false,
        published_at: "2026-07-20 11:45:00"
      },
      {
        id: 5,
        title: "Silicon Valley chip manufacturers announce breakthrough architectural updates",
        slug: "silicon-valley-chip-manufacturers-announce-breakthrough-architectural-updates",
        description: "Leading semiconductor foundries have unveiled 2-nanometer ribbon field-effect transistor architectures.",
        author_name: "David Potter",
        category_name: "Technology",
        category_slug: "technology",
        is_featured: true,
        is_editors_pick: true,
        published_at: "2026-07-22 11:20:00"
      }
    ];

    return NextResponse.json({ success: true, articles: fallbackArticles });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, is_featured, is_editors_pick } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article: {
        id: Date.now(),
        title,
        slug,
        description,
        category_name: 'Technology',
        author_name: 'Jennifer Friesen',
        is_featured: !!is_featured,
        is_editors_pick: !!is_editors_pick,
        published_at: new Date().toISOString()
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

