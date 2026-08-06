"use client";

import React, { useState } from "react";
import { Sparkles, Search, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ArticleSEOData, generateAutoSEO, analyzeSEOScore } from "@/lib/seo";

interface SEOAssistantPanelProps {
  articleData: ArticleSEOData;
  cardSummary: string;
  focusKeyword: string;
  metaDescription: string;
  onUpdateCardSummary: (val: string) => void;
  onUpdateFocusKeyword: (val: string) => void;
  onUpdateMetaDescription: (val: string) => void;
  onAutoGenerateSEO: () => void;
}

export default function SEOAssistantPanel({
  articleData,
  cardSummary,
  focusKeyword,
  metaDescription,
  onUpdateCardSummary,
  onUpdateFocusKeyword,
  onUpdateMetaDescription,
  onAutoGenerateSEO
}: SEOAssistantPanelProps) {
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState(false);

  // Live computed auto SEO for fallback display in search preview
  const autoSEO = generateAutoSEO(articleData);
  const seoAnalysis = analyzeSEOScore({
    ...articleData,
    metaDescription,
    focusKeyword
  });

  const displayTitle = articleData.title?.trim()
    ? `${articleData.title.trim()} | Digital Journal`
    : "Your Article Title |...";

  const displaySnippet = metaDescription.trim()
    || cardSummary.trim()
    || autoSEO.metaDescription
    || "Add a meta description to control the snippet shown in search...";

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-left font-sans">
      
      {/* 1. AUTO-GENERATE SEO BUTTON & SUBTITLE */}
      <div>
        <button
          type="button"
          onClick={onAutoGenerateSEO}
          className="w-full py-3 px-4 bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all mb-2"
        >
          <Sparkles size={15} />
          AUTO-GENERATE SEO
        </button>

        <p className="text-[10px] text-slate-500 leading-normal font-medium">
          Keyword &amp; meta description fill in automatically from your title and content. Edit any field to override.
        </p>
      </div>

      {/* 2. CARD SUMMARY (SEO LEAD) */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          CARD SUMMARY (SEO LEAD)
        </label>
        <textarea
          rows={3}
          placeholder="Concise 1-2 sentence preview details."
          value={cardSummary}
          onChange={(e) => onUpdateCardSummary(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-orange-100 transition-all resize-none min-h-[90px]"
        />
      </div>

      {/* 3. FOCUS KEYWORD */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          FOCUS KEYWORD
        </label>
        <input
          type="text"
          placeholder="e.g. Vexillum Minerals"
          value={focusKeyword}
          onChange={(e) => onUpdateFocusKeyword(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-orange-100 transition-all"
        />
      </div>

      {/* 4. META DESCRIPTION */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            META DESCRIPTION
          </label>
          <span className={`text-[10px] font-bold ${metaDescription.length > 160 ? "text-red-500" : "text-slate-400"}`}>
            {metaDescription.length}/160
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={160}
          placeholder="Discover why... — the sentence shown under the title in Google."
          value={metaDescription}
          onChange={(e) => onUpdateMetaDescription(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-[#F97316] rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100 transition-all resize-none min-h-[90px]"
        />
      </div>

      {/* 5. PREVIEW IN SEARCH RESULTS (GOOGLE SNIPPET CARD) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Search size={13} className="text-slate-400" />
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PREVIEW IN SEARCH RESULTS
            </label>
          </div>

          {/* Optional SEO Score Gauge Button */}
          <button
            type="button"
            onClick={() => setShowAnalysisDrawer(!showAnalysisDrawer)}
            className="flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            style={{ backgroundColor: `${seoAnalysis.color}20`, color: seoAnalysis.color }}
          >
            <span>Score: {seoAnalysis.score}% ({seoAnalysis.grade})</span>
            {showAnalysisDrawer ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Snippet Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1.5 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#0F172A] text-white text-[9px] font-extrabold flex items-center justify-center shrink-0 border border-slate-700">
              DJ
            </div>
            <div className="truncate min-w-0">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                Digital Journal
              </span>
              <span className="text-[10px] text-slate-500 block truncate leading-none">
                www.digitaljournal.com &gt; article...
              </span>
            </div>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-[#1A0DAB] hover:underline cursor-pointer leading-snug line-clamp-1">
            {displayTitle}
          </h4>

          <p className="text-xs text-slate-600 leading-normal line-clamp-2">
            {displaySnippet}
          </p>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-2">
          This is how the article can appear on Google. Meta description drives the snippet under the link.
        </p>
      </div>

      {/* 6. EXPANDABLE LIVE SEO CHECKLIST DRAWER */}
      {showAnalysisDrawer && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
            <span>Live SEO Recommendations</span>
            <span className="text-[11px] font-semibold" style={{ color: seoAnalysis.color }}>
              {seoAnalysis.checks.filter(c => c.passed).length}/{seoAnalysis.checks.length} Passed
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            {seoAnalysis.checks.map((check, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl text-[11px] flex items-start space-x-2 ${
                  check.passed ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}
              >
                {check.passed ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold">{check.label}: </span>
                  <span className="text-slate-600">{check.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
