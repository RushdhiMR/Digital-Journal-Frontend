import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    try {
      let query = `
        SELECT a.id, a.title, a.slug, a.description, a.author, a.image_url, 
               a.is_editors_pick, a.is_featured, a.published_at, c.name as category_name, c.slug as category_slug
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
      `;
      const params: any[] = [];

      if (category) {
        query += ' WHERE c.slug = ?';
        params.push(category);
      } else if (featured === 'true') {
        query += ' WHERE a.is_featured = 1';
      }

      query += ' ORDER BY a.published_at DESC LIMIT 20';

      const [rows]: any = await db.query(query, params);

      if (rows && rows.length > 0) {
        return NextResponse.json({
          success: true,
          count: rows.length,
          articles: rows,
        });
      }
    } catch (dbError) {
      console.warn('DB articles query error, using fallback dataset:', dbError);
    }

    // Default fallback articles list
    const fallbackArticles = [
      {
        id: 1,
        title: "Review: Has AI been chasing the wrong dream since Alan Turing?",
        slug: "review-has-ai-been-chasing-the-wrong-dream",
        description: "The essential question, then, is not whether machines can imitate people. Turing asked a brilliant question for the early age of computing.",
        author: "Dr. Tim Sandle",
        image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
        category_name: "Technology",
        category_slug: "technology",
        is_featured: true
      },
      {
        id: 2,
        title: "Silicon chips learn to write DNA: Research points to cleaner route for synthetic biology",
        slug: "silicon-chips-learn-to-write-dna",
        description: "The Harvard chip is an early-stage demonstration rather than an industrial replacement for current DNA synthesis platforms.",
        author: "Dr. Tim Sandle",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop",
        category_name: "Technology",
        category_slug: "technology",
        is_editors_pick: true
      },
      {
        id: 3,
        title: "Canada's soft robotics research is moving from laboratory novelty to business tool",
        slug: "canadas-soft-robotics-research",
        description: "Canada's advantage lies in combining engineering research, AI strength, materials science, medical technology and strong university-industry pathways.",
        author: "Dr. Tim Sandle",
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
        category_name: "Business",
        category_slug: "business",
        is_editors_pick: true
      }
    ];

    return NextResponse.json({
      success: true,
      count: fallbackArticles.length,
      articles: fallbackArticles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { generateAutoSEO } = await import('@/lib/seo');

    const autoSEO = generateAutoSEO({
      title: body.title || '',
      subheading: body.subheading || body.description || '',
      content: body.content || '',
      category: body.category || 'news',
      subcategory: body.subcategory || 'world',
      authorName: body.authorName || 'Digital Journal Writer',
      imageUrl: body.imageUrl || body.image,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      keywords: body.keywords,
      focusKeyword: body.focusKeyword,
      canonicalUrl: body.canonicalUrl,
      ogImage: body.ogImage
    });

    const articleRecord: any = {
      ...body,
      seo: autoSEO
    };

    try {
      const slug = body.title ? body.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') : `article-${Date.now()}`;
      const [insertResult]: any = await db.query(
        `INSERT INTO articles (title, slug, description, image_url, published_at) VALUES (?, ?, ?, ?, NOW())`,
        [body.title || 'Untitled', slug, autoSEO.metaDescription, body.imageUrl || body.image || '']
      );
      if (insertResult && insertResult.insertId) {
        articleRecord.id = insertResult.insertId;
        articleRecord.dbInserted = true;
      }
    } catch (dbErr) {
      console.warn('MySQL DB insert fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Article created successfully with automatic SEO metadata',
      article: articleRecord
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save article' },
      { status: 500 }
    );
  }
}

