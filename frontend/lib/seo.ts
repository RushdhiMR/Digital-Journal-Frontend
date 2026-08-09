export interface ArticleSEOData {
  title: string;
  subheading?: string;
  description?: string;
  content?: string;
  category?: string;
  subcategory?: string;
  authorName?: string;
  authorRole?: string;
  imageUrl?: string;
  imageCaption?: string;
  publishedAt?: string;
  updatedAt?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface SEOScoreResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Improvement';
  color: string;
  checks: {
    label: string;
    passed: boolean;
    recommendation: string;
  }[];
}

const BRAND_NAME = "Digital Journal";
const DOMAIN = "https://www.digitaljournal.com";

/**
 * Generate clean URL slug from title
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Intelligently extract the primary focus keyword as the first three key words of the title
 */
export function extractFocusKeyword(title: string, category: string = ''): string {
  if (!title || !title.trim()) {
    return category ? category.toLowerCase() : 'business';
  }

  // Only filter out minor grammatical connectors so title key words are preserved in order
  const minorConnectors = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'by', 'of', 'for', 
    'with', 'to', 'from', 'as', 'into', 'is', 'are', 'was', 'were', 'be', 'been', 
    'being', 'that', 'this', 'these', 'those', 'its', 'their', 'your', 'our'
  ]);

  const rawWords = title
    .trim()
    .split(/\s+/)
    .map(w => w.toLowerCase().replace(/[^\w]/g, ''))
    .filter(w => w.length > 0 && !minorConnectors.has(w));

  if (rawWords.length >= 3) {
    return `${rawWords[0]} ${rawWords[1]} ${rawWords[2]}`;
  } else if (rawWords.length === 2) {
    return `${rawWords[0]} ${rawWords[1]}`;
  } else if (rawWords.length === 1) {
    return rawWords[0];
  }

  return category ? category.toLowerCase() : 'business';
}

/**
 * Extract relevant keywords from article text and metadata
 */
export function extractKeywords(title: string, content: string = '', category: string = '', subcategory: string = ''): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'to', 'from', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
    'just', 'don', 'should', 'now', 'this', 'that', 'these', 'those', 'with', 'for', 'about',
    'digital', 'journal', 'latest', 'global', 'news', 'insights'
  ]);

  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  const cleanTitle = title.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const titleWords = cleanTitle.split(' ').filter(w => w.length > 2 && !stopWords.has(w));

  const combinedText = `${title} ${cleanContent}`;
  const words = combinedText.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
  
  const frequencyMap: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }
  });

  const sorted = Object.keys(frequencyMap).sort((a, b) => frequencyMap[b] - frequencyMap[a]);

  const result = new Set<string>();
  
  // Prioritize title keywords first
  if (titleWords.length >= 2) {
    result.add(`${titleWords[0]} ${titleWords[1]}`);
  }
  titleWords.forEach(k => result.add(k));
  sorted.forEach(k => result.add(k));
  if (category && category !== 'news') result.add(category.toLowerCase());
  if (subcategory && subcategory !== 'world') result.add(subcategory.toLowerCase().replace(/-/g, ' '));

  const list = Array.from(result).slice(0, 10);
  return list.length > 0 ? list : [category ? category.toLowerCase() : 'business'];
}

/**
 * Generate optimized meta title (aiming for 50-60 characters including brand)
 */
export function generateMetaTitle(title: string): string {
  if (!title) return BRAND_NAME;
  const cleanTitle = title.trim();
  if (cleanTitle.length <= 50) {
    return `${cleanTitle} | ${BRAND_NAME}`;
  }
  if (cleanTitle.length <= 60) {
    return cleanTitle;
  }
  return `${cleanTitle.slice(0, 57)}...`;
}

/**
 * Generate optimized meta description (aiming for 150-160 characters)
 */
export function generateMetaDescription(title: string, subheading: string = '', content: string = ''): string {
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanContent) return '';

  if (cleanContent.length <= 160) return cleanContent;

  const truncated = cleanContent.slice(0, 157);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Generate full automated SEO metadata object
 */
export function generateAutoSEO(data: ArticleSEOData) {
  const title = data.title || '';
  const subheading = data.subheading || data.description || '';
  const content = data.content || '';
  const category = data.category || 'news';
  const subcategory = data.subcategory || 'world';
  const slug = data.slug || generateSlug(title);

  const metaTitle = data.metaTitle || generateMetaTitle(title);
  const metaDescription = data.metaDescription || generateMetaDescription(title, subheading, content);
  const keywords = (data.keywords && data.keywords.length > 0) 
    ? data.keywords 
    : extractKeywords(title, content, category, subcategory);
  
  const focusKeyword = (data.focusKeyword && data.focusKeyword.trim()) 
    ? data.focusKeyword 
    : extractFocusKeyword(title, category);
  const canonicalUrl = data.canonicalUrl || `${DOMAIN}/${category}/${subcategory}/${slug}`;
  const ogImage = data.ogImage || data.imageUrl || `${DOMAIN}/icon.png`;

  const publishedAtIso = data.publishedAt 
    ? new Date(data.publishedAt).toISOString() 
    : new Date().toISOString();
  
  const updatedAtIso = data.updatedAt 
    ? new Date(data.updatedAt).toISOString() 
    : publishedAtIso;

  // Schema.org NewsArticle JSON-LD
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": title,
    "description": metaDescription,
    "image": [ogImage],
    "datePublished": publishedAtIso,
    "dateModified": updatedAtIso,
    "author": {
      "@type": "Person",
      "name": data.authorName || "Digital Journal Staff",
      "jobTitle": data.authorRole || "Journalist"
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/icon.png`
      }
    },
    "articleSection": category,
    "keywords": keywords.join(", ")
  };

  return {
    metaTitle,
    metaDescription,
    keywords,
    focusKeyword,
    canonicalUrl,
    ogImage,
    slug,
    jsonLdSchema,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
      site: "@digitaljournal"
    }
  };
}

/**
 * Calculate dynamic SEO Score (0-100) and actionable recommendations
 */
export function analyzeSEOScore(data: ArticleSEOData): SEOScoreResult {
  const autoSeo = generateAutoSEO(data);
  const title = data.title || '';
  const metaTitle = data.metaTitle || autoSeo.metaTitle;
  const metaDesc = data.metaDescription || autoSeo.metaDescription;
  const focusKw = (data.focusKeyword || autoSeo.focusKeyword || '').toLowerCase();
  const contentText = (data.content || '').replace(/<[^>]*>/g, '').toLowerCase();

  const checks = [
    {
      label: "Article Title Length",
      passed: title.length >= 25 && title.length <= 90,
      recommendation: title.length < 25 
        ? "Title is too short. Expand it to at least 25 characters for better search relevance." 
        : title.length > 90 
        ? "Title is quite long. Try keeping it under 90 characters."
        : "Optimal article title length."
    },
    {
      label: "Meta Title Length (50-60 chars)",
      passed: metaTitle.length >= 40 && metaTitle.length <= 65,
      recommendation: metaTitle.length < 40 
        ? "Meta title is too short. Include more descriptive keywords." 
        : metaTitle.length > 65 
        ? "Meta title exceeds 65 characters and may be cut off in search results." 
        : "Ideal meta title length for search engines."
    },
    {
      label: "Meta Description Length (120-160 chars)",
      passed: metaDesc.length >= 120 && metaDesc.length <= 165,
      recommendation: metaDesc.length < 120 
        ? "Meta description is under 120 chars. Add context to improve click-through rates." 
        : metaDesc.length > 165 
        ? "Meta description is over 165 chars and will be truncated by Google." 
        : "Perfect meta description length!"
    },
    {
      label: "Focus Keyword in Title",
      passed: focusKw ? title.toLowerCase().includes(focusKw) : false,
      recommendation: focusKw 
        ? (title.toLowerCase().includes(focusKw) ? "Focus keyword appears in title!" : `Include your focus keyword "${focusKw}" in the article title.`)
        : "Specify a focus keyword to target in search engines."
    },
    {
      label: "Focus Keyword in Content",
      passed: focusKw ? contentText.includes(focusKw) : false,
      recommendation: focusKw 
        ? (contentText.includes(focusKw) ? "Focus keyword used within article content!" : `Mention "${focusKw}" inside the main article body.`)
        : "Add focus keyword to content."
    },
    {
      label: "Featured Image Attached (OpenGraph)",
      passed: Boolean(data.imageUrl || data.ogImage),
      recommendation: (data.imageUrl || data.ogImage) 
        ? "Featured image attached for rich social previews and Google Discover." 
        : "Add a high-quality featured image URL."
    },
    {
      label: "Content Word Count",
      passed: contentText.split(/\s+/).filter(Boolean).length >= 150,
      recommendation: contentText.split(/\s+/).filter(Boolean).length >= 150 
        ? "Good article length for depth and indexability." 
        : "Article content is sparse. Aim for at least 150-300 words for indexing."
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  let grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Improvement' = 'Needs Improvement';
  let color = '#ef4444';

  if (score >= 90) {
    grade = 'A+';
    color = '#10b981';
  } else if (score >= 80) {
    grade = 'A';
    color = '#22c55e';
  } else if (score >= 65) {
    grade = 'B';
    color = '#f59e0b';
  } else if (score >= 50) {
    grade = 'C';
    color = '#eab308';
  }

  return {
    score,
    grade,
    color,
    checks
  };
}
