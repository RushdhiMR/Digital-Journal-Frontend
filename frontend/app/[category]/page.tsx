"use client";

import { use, useEffect, useState } from "react";
import CategoryPageLayout from "@/components/CategoryPageLayout";
import { getCategoryData, CategoryData } from "@/lib/categoryData";

interface DynamicCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function DynamicCategoryPage({ params }: DynamicCategoryPageProps) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams?.category || "lifestyle";

  const [data, setData] = useState<CategoryData>(() => getCategoryData(categorySlug));

  useEffect(() => {
    const baseData = getCategoryData(categorySlug);

    try {
      if (typeof window !== "undefined") {
        const savedStr = localStorage.getItem("dj_writer_submitted_articles");
        if (savedStr) {
          const posts: any[] = JSON.parse(savedStr);
          const normCat = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, "");

          const approved = posts.filter(
            (p) =>
              p.status === "Published" &&
              (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "").includes(normCat)
          );

          if (approved.length > 0) {
            const formatted = approved.map((post) => ({
              title: post.title,
              image: post.imageUrl || baseData.featured.image,
              date: post.date || "July 2026",
              description: post.summary || post.content?.replace(/<[^>]+>/g, "").slice(0, 140) + "...",
              author: post.authorName || "Staff Journalist",
              category: post.category?.toUpperCase() || baseData.categoryName.toUpperCase()
            }));

            setData({
              ...baseData,
              newsArticles: [...formatted, ...baseData.newsArticles]
            });
          }
        }
      }
    } catch (e) {
      console.warn("Could not load user articles for dynamic category:", e);
    }
  }, [categorySlug]);

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
