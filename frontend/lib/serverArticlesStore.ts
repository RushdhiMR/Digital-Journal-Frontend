import { getDbPool } from '@/lib/db';

export interface ArticleRecord {
  id: string | number;
  title: string;
  subheading?: string;
  summary?: string;
  description?: string;
  content?: string;
  category?: string;
  category_name?: string;
  category_slug?: string;
  subcategories?: string[];
  tags?: string[];
  imageUrl?: string;
  image?: string;
  image_url?: string;
  caption?: string;
  image_caption?: string;
  status: string; // "Published" | "Pending review" | "Draft" | "Trash" | "Rejected"
  date?: string;
  published_at?: string;
  reads?: number;
  readDuration?: string;
  placement?: string;
  authorEmail?: string;
  authorName?: string;
  authorAvatar?: string;
  authorBio?: string;
  author?: string;
  seo?: any;
  slug?: string;
  is_featured?: boolean;
  is_editors_pick?: boolean;
  [key: string]: any;
}

export async function readArticlesStore(): Promise<ArticleRecord[]> {
  try {
    const db = getDbPool();
    const [rows]: any = await db.query(`
      SELECT 
        a.*,
        c.name AS category_name,
        c.slug AS category_slug,
        sc.name AS subcategory_name,
        sc.slug AS subcategory_slug,
        au.name AS author_rel_name,
        au.avatar AS author_rel_avatar,
        au.bio AS author_rel_bio
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN subcategories sc ON a.subcategory_id = sc.id
      LEFT JOIN authors au ON a.author_id = au.id
      ORDER BY a.published_at DESC, a.id DESC
    `);

    if (Array.isArray(rows)) {
      return rows.map((r: any) => {
        let parsedSubcategories: string[] = [];
        if (r.subcategories) {
          try {
            parsedSubcategories = typeof r.subcategories === 'string' ? JSON.parse(r.subcategories) : r.subcategories;
          } catch (e) {
            parsedSubcategories = typeof r.subcategories === 'string' ? r.subcategories.split(',').map((s: string) => s.trim()) : [];
          }
        }
        if (parsedSubcategories.length === 0 && r.subcategory_name) {
          parsedSubcategories = [r.subcategory_name];
        }

        let parsedTags: string[] = [];
        if (r.tags) {
          try {
            parsedTags = typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags;
          } catch (e) {
            parsedTags = typeof r.tags === 'string' ? r.tags.split(',').map((s: string) => s.trim()) : [];
          }
        }

        let parsedSeo: any = null;
        if (r.seo) {
          try {
            parsedSeo = typeof r.seo === 'string' ? JSON.parse(r.seo) : r.seo;
          } catch (e) {}
        }

        const rawAuthor = (r.author_name || r.author || r.author_rel_name || '').trim();
        const authorName = (rawAuthor && rawAuthor.toLowerCase() !== 'system administrator' && rawAuthor.toLowerCase() !== 'administrator' && rawAuthor.toLowerCase() !== 'admin')
          ? rawAuthor
          : (r.author_rel_name || 'Rushdhi MR');
        const authorAvatar = r.author_avatar || r.author_rel_avatar || '/author_bluesuit.jpg';
        const authorBio = r.author_bio || r.author_rel_bio || `${authorName} is a journalist for Digital Journal.`;
        const cat = r.category_name || (r.category_id ? String(r.category_id) : 'News');

        const pubDate = r.published_at ? new Date(r.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jul 2026';

        return {
          id: r.id,
          title: r.title,
          slug: r.slug,
          summary: r.summary || r.description || '',
          description: r.description || r.summary || '',
          subheading: r.summary || r.description || '',
          content: r.content || '',
          category: cat,
          category_name: cat,
          category_slug: r.category_slug || (cat ? cat.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'news'),
          subcategories: parsedSubcategories,
          tags: parsedTags,
          imageUrl: r.image_url || '/ai_hero.png',
          image: r.image_url || '/ai_hero.png',
          image_url: r.image_url || '/ai_hero.png',
          caption: r.image_caption || `${r.title}.`,
          image_caption: r.image_caption || `${r.title}.`,
          is_featured: Boolean(r.is_featured),
          is_editors_pick: Boolean(r.is_editors_pick),
          status: r.status || 'Published',
          date: pubDate,
          published_at: r.published_at,
          readDuration: r.read_duration || '4 MIN READ',
          reads: r.reads_count || 0,
          placement: r.placement || 'Standard Post',
          authorName,
          author: authorName,
          authorEmail: r.author_email || 'writer@digitaljournal.com',
          authorAvatar,
          authorBio,
          seo: parsedSeo
        };
      });
    }
  } catch (err) {
    console.error('[serverArticlesStore] MySQL read error:', err);
  }
  return [];
}

export async function writeArticlesStore(articles: ArticleRecord[]): Promise<void> {
  // Sync each article to MySQL
  for (const article of articles) {
    await upsertArticleStore(article);
  }
}

export async function upsertArticleStore(article: ArticleRecord): Promise<ArticleRecord[]> {
  try {
    const db = getDbPool();
    const slug = article.slug || (article.title ? article.title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') : `article-${Date.now()}`);
    
    // Find category ID if category name provided; auto-create if missing
    let categoryId = article.category_id || null;
    if (!categoryId && (article.category || article.category_name)) {
      const catName = (article.category || article.category_name || '').trim();
      const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const [cats]: any = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) OR LOWER(slug) = LOWER(?) LIMIT 1', [catName, catSlug]);
      if (cats && cats.length > 0) {
        categoryId = cats[0].id;
      } else if (catName) {
        // Auto-create the category so future reads return the correct name
        try {
          const [ins]: any = await db.query(
            'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)',
            [catName, catSlug]
          );
          if (ins && ins.insertId) {
            categoryId = ins.insertId;
          } else {
            // Re-query in case INSERT IGNORE hit a duplicate
            const [recats]: any = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1', [catName]);
            if (recats && recats.length > 0) categoryId = recats[0].id;
          }
        } catch (insErr) {
          console.warn('[serverArticlesStore] Could not auto-create category:', insErr);
        }
      }
    }

    const subcategoriesJson = JSON.stringify(Array.isArray(article.subcategories) ? article.subcategories : (Array.isArray(article.subCategories) ? article.subCategories : []));
    const tagsJson = JSON.stringify(Array.isArray(article.tags) ? article.tags : []);
    const seoJson = article.seo ? JSON.stringify(article.seo) : null;
    const authorName = article.authorName || article.author || 'Staff Journalist';
    const authorAvatar = article.authorAvatar || '/author_bluesuit.jpg';
    const authorBio = article.authorBio || `${authorName} is a journalist for Digital Journal.`;
    const authorEmail = article.authorEmail || 'writer@digitaljournal.com';
    const imageUrl = article.imageUrl || article.image || article.image_url || '/ai_hero.png';
    const description = article.summary || article.description || article.subheading || '';
    const content = article.content || '';
    const status = article.status || 'Published';
    const placement = article.placement || 'Standard Post';
    const readDuration = article.readDuration || '4 MIN READ';
    const isFeatured = article.is_featured ? 1 : 0;
    const isEditorsPick = article.is_editors_pick ? 1 : 0;

    // Check if article with this id or slug already exists in MySQL
    let isExisting = false;
    let targetId = article.id;
    if (targetId && !isNaN(Number(targetId))) {
      const [chk]: any = await db.query('SELECT id FROM articles WHERE id = ? LIMIT 1', [Number(targetId)]);
      if (chk && chk.length > 0) isExisting = true;
    }
    if (!isExisting && slug) {
      const [chkSlug]: any = await db.query('SELECT id FROM articles WHERE slug = ? LIMIT 1', [slug]);
      if (chkSlug && chkSlug.length > 0) {
        isExisting = true;
        targetId = chkSlug[0].id;
      }
    }

    if (isExisting) {
      await db.query(`
        UPDATE articles SET
          category_id = COALESCE(?, category_id),
          title = ?,
          slug = ?,
          description = ?,
          summary = ?,
          content = ?,
          image_url = ?,
          status = ?,
          placement = ?,
          subcategories = ?,
          tags = ?,
          read_duration = ?,
          author_name = ?,
          author_email = ?,
          author_avatar = ?,
          author_bio = ?,
          seo = ?,
          is_featured = ?,
          is_editors_pick = ?
        WHERE id = ?
      `, [
        categoryId,
        article.title,
        slug,
        description,
        description,
        content,
        imageUrl,
        status,
        placement,
        subcategoriesJson,
        tagsJson,
        readDuration,
        authorName,
        authorEmail,
        authorAvatar,
        authorBio,
        seoJson,
        isFeatured,
        isEditorsPick,
        targetId
      ]);
    } else {
      await db.query(`
        INSERT INTO articles (
          category_id,
          title,
          slug,
          description,
          summary,
          content,
          image_url,
          image_caption,
          status,
          placement,
          subcategories,
          tags,
          read_duration,
          author_name,
          author_email,
          author_avatar,
          author_bio,
          seo,
          is_featured,
          is_editors_pick,
          published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `, [
        categoryId,
        article.title,
        slug,
        description,
        description,
        content,
        imageUrl,
        article.caption || `${article.title}.`,
        status,
        placement,
        subcategoriesJson,
        tagsJson,
        readDuration,
        authorName,
        authorEmail,
        authorAvatar,
        authorBio,
        seoJson,
        isFeatured,
        isEditorsPick
      ]);
    }
  } catch (err) {
    console.error('[serverArticlesStore] MySQL upsert error:', err);
  }

  return readArticlesStore();
}

export async function updateArticleStatusStore(id: string | number, status: string): Promise<ArticleRecord[]> {
  try {
    const db = getDbPool();
    await db.query('UPDATE articles SET status = ? WHERE id = ? OR slug = ?', [status, id, String(id)]);
  } catch (err) {
    console.error('[serverArticlesStore] MySQL update status error:', err);
  }
  return readArticlesStore();
}

export async function deleteArticleStore(id: string | number): Promise<ArticleRecord[]> {
  try {
    const db = getDbPool();
    await db.query('DELETE FROM articles WHERE id = ? OR slug = ?', [id, String(id)]);
  } catch (err) {
    console.error('[serverArticlesStore] MySQL delete error:', err);
  }
  return readArticlesStore();
}
