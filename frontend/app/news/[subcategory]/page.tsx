"use client";

import { use, useEffect, useState } from "react";
import CategoryPageLayout from "@/components/CategoryPageLayout";
import { getCategoryData, CategoryData } from "@/lib/categoryData";
import { useLiveArticles } from "@/lib/articlesSync";

interface NewsSubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

export default function NewsSubcategoryPage({ params }: NewsSubcategoryPageProps) {
  const resolvedParams = use(params);
  const subcategorySlug = resolvedParams?.subcategory || "world";

  const [data, setData] = useState<CategoryData>(() => getCategoryData(subcategorySlug));
  const { articles: liveArticles } = useLiveArticles();

  useEffect(() => {
    const baseData = getCategoryData(subcategorySlug);

    try {
      if (Array.isArray(liveArticles)) {
        const normSub = subcategorySlug.toLowerCase().replace(/[^a-z0-9]/g, "");

        const approved = liveArticles.filter((p) => {
          if (!p || p.status !== "Published") return false;
          const cat = (p.category || p.category_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          let subs: string[] = [];
          if (Array.isArray(p.subcategories)) {
            subs = p.subcategories.map((s: any) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
          } else if (Array.isArray(p.subCategories)) {
            subs = p.subCategories.map((s: any) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
          } else if (typeof p.subcategories === "string") {
            try {
              const parsed = JSON.parse(p.subcategories);
              if (Array.isArray(parsed)) {
                subs = parsed.map((s: any) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
              } else {
                subs = p.subcategories.split(",").map((s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
              }
            } catch (e) {
              subs = p.subcategories.split(",").map((s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean);
            }
          }
          return cat === normSub || cat.includes(normSub) || normSub.includes(cat) || subs.some((s: string) => s === normSub || s.includes(normSub) || normSub.includes(s));
        });

        if (approved.length > 0) {
          const formatted = approved.map((post) => ({
            title: post.title,
            image: post.imageUrl || post.image || baseData.featured.image,
            date: post.date || "July 2026",
            description: post.summary || post.content?.replace(/<[^>]+>/g, "").slice(0, 140) + "...",
            author: post.authorName || "Staff Journalist",
            category: post.category?.toUpperCase() || baseData.categoryName.toUpperCase()
          }));

          setData({
            ...baseData,
            newsArticles: [...formatted, ...baseData.newsArticles]
          });
        } else {
          setData(baseData);
        }
      }
    } catch (e) {
      console.warn("Could not load user articles for news subcategory:", e);
    }
  }, [subcategorySlug, liveArticles]);

  return (
    <CategoryPageLayout
      categoryName={data.categoryName}
      categoryColor={data.categoryColor}
      infoBoxText={data.infoBoxText}
      featured={data.featured}
      secondaryArticles={data.secondaryArticles}
      guidesTitle={data.guidesTitle}
      guidesDescription={data.guidesDescription}
      guides={data.guides}
      newsTitle={data.newsTitle}
      newsDescription={data.newsDescription}
      newsArticles={data.newsArticles}
    />
  );
}
