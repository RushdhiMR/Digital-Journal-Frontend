import { MetadataRoute } from 'next';

const DOMAIN = 'https://www.digitaljournal.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/news',
    '/business',
    '/industry-insights',
    '/technology',
    '/innovation',
    '/events',
    '/about',
    '/writer'
  ].map((route) => ({
    url: `${DOMAIN}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  const sampleArticles = [
    {
      category: 'news',
      subcategory: 'world',
      slug: 'airbus-puts-a-price-on-canadian-jet-fuel-security'
    },
    {
      category: 'industry-insights',
      subcategory: 'venture-capital',
      slug: 'venture-capital-firms-shift-focus-to-sustainable-tech-sector-pipelines'
    },
    {
      category: 'industry-insights',
      subcategory: 'remote-leadership',
      slug: 'how-remote-leadership-models-are-evolving-to-meet-product-goals'
    },
    {
      category: 'technology',
      subcategory: 'semiconductors',
      slug: 'silicon-valley-chip-manufacturers-announce-breakthrough-architectural-updates'
    },
    {
      category: 'business',
      subcategory: 'companies',
      slug: 'new-exclusive-decoration-design-fit-out-llc-structural-acrylic-pioneers-in-the-uae'
    }
  ].map((art) => ({
    url: `${DOMAIN}/${art.category}/${art.subcategory}/${art.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }));

  return [...routes, ...sampleArticles];
}
