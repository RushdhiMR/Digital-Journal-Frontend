"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SEOAssistantPanel from "@/components/SEOAssistantPanel";
import { generateAutoSEO, extractFocusKeyword } from "@/lib/seo";
import { getUserProfile } from "@/lib/userProfiles";
import {
  ArrowLeft,
  Eye,
  Save,
  Send,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon,
  Settings,
  X,
  Check,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  Trash2,
  Search,
  Bookmark,
  Share2,
  MessageSquare,
  Loader2,
  Edit3
} from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();

  // Current User State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string; avatar: string } | null>({
    name: "rushdhi",
    email: "rushdhiriyaj2005@gmail.com",
    role: "Writer",
    avatar: "/author_bluesuit.jpg"
  });

  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem("dj_writer_user") || localStorage.getItem("dj_user");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        const role = parsed.role;
        if (role !== "Writer" && role !== "Admin" && role !== "Co-Admin") {
          localStorage.setItem("dj_toast", "Access Denied: Only authors approved by Admin can write stories.");
          window.location.href = "/reader";
          return;
        }
        setCurrentUser(parsed);
      } else {
        window.location.href = "/login";
        return;
      }

      // Check if editing existing post
      const storedEditingPost = localStorage.getItem("dj_editing_post");
      if (storedEditingPost) {
        const post = JSON.parse(storedEditingPost);
        if (post && post.id) {
          setEditingPostId(post.id);
          setTitle(post.title || "");
          setSubheading(post.summary || post.subheading || "");
          setContent(post.content || "");
          if (editorRef.current) {
            editorRef.current.innerHTML = post.content || "";
          }
          if (post.category) {
            setCategory(post.category.toUpperCase());
          }
          setImageUrl(post.imageUrl || "");
          if (Array.isArray(post.tags)) {
            setTags(post.tags);
          }
          if (post.readDuration) {
            setReadDuration(post.readDuration);
          }
          if (post.seo) {
            setCardSummary(post.seo.cardSummary || post.summary || "");
            setFocusKeyword(post.seo.focusKeyword || "");
            setMetaDescription(post.seo.metaDescription || "");
            setMetaTitle(post.seo.metaTitle || "");
            setCanonicalUrl(post.seo.canonicalUrl || "");
            if (Array.isArray(post.seo.keywords)) {
              setKeywords(post.seo.keywords.join(", "));
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load user state or post to edit:", e);
    }
  }, []);

  // Form State
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Image Modal Form State
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageSize, setImageSize] = useState("Medium (Width: 450px)");
  const [imageAlignment, setImageAlignment] = useState("Center (No Wrap)");
  const [imageFileName, setImageFileName] = useState("No file chosen");

  // Selected Image Element in Editor for Interactive Resizing & Adjustment
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [selectedImgWidth, setSelectedImgWidth] = useState<number>(450);
  const [selectedImgAlign, setSelectedImgAlign] = useState<"left" | "center" | "right">("center");
  const [imgBoundingRect, setImgBoundingRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const updateImgBoundingRect = () => {
    if (selectedImg && editorRef.current) {
      const imgRect = selectedImg.getBoundingClientRect();
      const parentRect = editorRef.current.getBoundingClientRect();
      setImgBoundingRect({
        top: imgRect.top - parentRect.top,
        left: imgRect.left - parentRect.left,
        width: imgRect.width,
        height: imgRect.height,
      });
    } else {
      setImgBoundingRect(null);
    }
  };

  // Event listener to track image selection in editor canvas
  useEffect(() => {
    const handleEditorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        img.ondragstart = (dragEv) => dragEv.preventDefault();
        setSelectedImg(img);
        const currentWidth = img.offsetWidth || parseInt(img.style.width) || 450;
        setSelectedImgWidth(currentWidth);

        const parentFig = (img.closest("figure") as HTMLElement) || img;
        if (parentFig.style.float === "left" || img.style.float === "left") {
          setSelectedImgAlign("left");
        } else if (parentFig.style.float === "right" || img.style.float === "right") {
          setSelectedImgAlign("right");
        } else {
          setSelectedImgAlign("center");
        }
      } else {
        // Don't deselect if clicking inside the image resize control bar or handles
        const resizeBar = document.getElementById("img-resize-toolbar");
        const isHandle = target.getAttribute("data-resize-handle") === "true";
        if ((resizeBar && resizeBar.contains(target)) || isHandle) return;
        setSelectedImg(null);
      }
    };

    const ed = editorRef.current;
    if (ed) {
      ed.addEventListener("click", handleEditorClick);
      return () => ed.removeEventListener("click", handleEditorClick);
    }
  }, []);

  useEffect(() => {
    updateImgBoundingRect();
    window.addEventListener("resize", updateImgBoundingRect);
    return () => window.removeEventListener("resize", updateImgBoundingRect);
  }, [selectedImg, selectedImgWidth, selectedImgAlign]);

  // Smooth Drag Handle Resize Logic (Corners & Side Edges)
  const handleStartResizeDrag = (e: React.MouseEvent, handlePos: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImg) return;

    const startX = e.clientX;
    const startWidth = selectedImg.offsetWidth;
    document.body.style.cursor = handlePos.includes("left") || handlePos.includes("right") ? "ew-resize" : "nwse-resize";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let diffX = moveEvent.clientX - startX;
      if (handlePos.includes("left")) diffX = -diffX;
      const newWidth = Math.max(120, Math.min(1100, startWidth + diffX));
      selectedImg.style.width = `${newWidth}px`;
      selectedImg.style.maxWidth = "100%";
      setSelectedImgWidth(newWidth);
      updateImgBoundingRect();
    };

    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeImage = (widthPx: number) => {
    if (selectedImg) {
      selectedImg.style.width = `${widthPx}px`;
      selectedImg.style.maxWidth = "100%";
      setSelectedImgWidth(widthPx);
      setTimeout(updateImgBoundingRect, 50);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleSetImageAlignment = (alignment: "left" | "center" | "right") => {
    if (selectedImg) {
      const parentFigure = (selectedImg.closest("figure") as HTMLElement) || selectedImg;
      setSelectedImgAlign(alignment);

      if (alignment === "left") {
        parentFigure.style.float = "left";
        parentFigure.style.margin = "0.5rem 1.25rem 0.5rem 0";
        parentFigure.style.display = "inline-block";
        selectedImg.style.display = "block";
      } else if (alignment === "right") {
        parentFigure.style.float = "right";
        parentFigure.style.margin = "0.5rem 0 0.5rem 1.25rem";
        parentFigure.style.display = "inline-block";
        selectedImg.style.display = "block";
      } else {
        parentFigure.style.float = "none";
        parentFigure.style.margin = "1rem auto";
        parentFigure.style.display = "block";
        selectedImg.style.display = "block";
        selectedImg.style.marginLeft = "auto";
        selectedImg.style.marginRight = "auto";
      }
      setTimeout(updateImgBoundingRect, 50);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleMoveImageUp = () => {
    if (selectedImg) {
      const elem = selectedImg.closest("figure") || selectedImg;
      const prev = elem.previousElementSibling;
      if (prev) {
        prev.before(elem);
        setTimeout(updateImgBoundingRect, 50);
        if (editorRef.current) setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleMoveImageDown = () => {
    if (selectedImg) {
      const elem = selectedImg.closest("figure") || selectedImg;
      const next = elem.nextElementSibling;
      if (next) {
        next.after(elem);
        setTimeout(updateImgBoundingRect, 50);
        if (editorRef.current) setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleDeleteSelectedImage = () => {
    if (selectedImg) {
      const parentFigure = selectedImg.closest("figure") || selectedImg;
      parentFigure.remove();
      setSelectedImg(null);
      setImgBoundingRect(null);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleEditSelectedImage = () => {
    if (selectedImg) {
      setImageUrl(selectedImg.src || "");
      const fig = selectedImg.closest("figure");
      if (fig) {
        const captionElem = fig.querySelector("figcaption span:first-child") || fig.querySelector("figcaption");
        if (captionElem) {
          setImageCaption(captionElem.textContent?.replace(/\(PHOTO:.*\)/gi, "").trim() || "");
        } else {
          setImageCaption(selectedImg.alt || "");
        }
      } else {
        setImageCaption(selectedImg.alt || "");
      }
      setShowImageModal(true);
    }
  };

  // Textarea / ContentEditable Ref
  const editorRef = useRef<HTMLDivElement>(null);

  // Active formatting state toggles for toolbar highlights
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({});

  const handleInsertImageToCanvas = () => {
    if (!imageUrl.trim()) {
      alert("Please paste an image URL or choose a file.");
      return;
    }

    if (selectedImg) {
      // UPDATE EXISTING SELECTED IMAGE
      selectedImg.src = imageUrl.trim();
      selectedImg.alt = imageCaption.trim() || "Article Image";

      let widthStyle = "max-width: 450px; width: 100%;";
      if (imageSize.includes("Small")) widthStyle = "max-width: 300px; width: 100%;";
      if (imageSize.includes("Full")) widthStyle = "width: 100%;";
      selectedImg.style.cssText = `${widthStyle} border-radius: 0.75rem; object-fit: cover;`;

      const fig = selectedImg.closest("figure");
      if (fig) {
        let alignStyle = "margin: 1rem auto; display: block;";
        if (imageAlignment.includes("Left")) alignStyle = "float: left; margin: 0.5rem 1rem 0.5rem 0;";
        if (imageAlignment.includes("Right")) alignStyle = "float: right; margin: 0.5rem 0 0.5rem 1rem;";
        fig.style.cssText = alignStyle;

        let figcaption = fig.querySelector("figcaption");
        if (imageCaption.trim() || imageCredit.trim()) {
          const captionHtml = `<span style="font-style: italic; color: #475569;">${imageCaption.trim()}</span>${
            imageCredit.trim()
              ? `<span style="font-weight: 700; color: #94A3B8; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em;">(PHOTO: ${imageCredit.trim().toUpperCase()})</span>`
              : ""
          }`;
          if (figcaption) {
            figcaption.innerHTML = captionHtml;
          } else {
            const newCap = document.createElement("figcaption");
            newCap.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: 0.75rem; color: #64748B; margin-top: 0.5rem; width: 100%; font-family: sans-serif;";
            newCap.innerHTML = captionHtml;
            fig.appendChild(newCap);
          }
        } else if (figcaption) {
          figcaption.remove();
        }
      }

      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
        setTimeout(() => {
          if (selectedImg && editorRef.current) {
            const rect = selectedImg.getBoundingClientRect();
            const parentRect = editorRef.current.getBoundingClientRect();
            setImgBoundingRect({
              top: rect.top - parentRect.top,
              left: rect.left - parentRect.left,
              width: rect.width,
              height: rect.height,
            });
            setSelectedImgWidth(Math.round(rect.width));
          }
        }, 50);
      }

      setShowImageModal(false);
      return;
    }

    // INSERT NEW IMAGE
    let widthStyle = "max-width: 450px; width: 100%;";
    if (imageSize.includes("Small")) widthStyle = "max-width: 300px; width: 100%;";
    if (imageSize.includes("Full")) widthStyle = "width: 100%;";

    let alignStyle = "margin: 1rem auto; display: block;";
    if (imageAlignment.includes("Left")) alignStyle = "float: left; margin: 0.5rem 1rem 0.5rem 0;";
    if (imageAlignment.includes("Right")) alignStyle = "float: right; margin: 0.5rem 0 0.5rem 1rem;";

    const captionHtml = (imageCaption.trim() || imageCredit.trim())
      ? `<figcaption style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: 0.75rem; color: #64748B; margin-top: 0.5rem; width: 100%; font-family: sans-serif;">
          <span style="font-style: italic; color: #475569;">${imageCaption.trim()}</span>
          ${imageCredit.trim() ? `<span style="font-weight: 700; color: #94A3B8; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em;">(PHOTO: ${imageCredit.trim().toUpperCase()})</span>` : ''}
        </figcaption>`
      : "";

    const imgTag = `<figure style="${alignStyle}"><img src="${imageUrl.trim()}" alt="${
      imageCaption.trim() || "Article Image"
    }" style="${widthStyle} border-radius: 0.75rem; object-fit: cover;" />${captionHtml}</figure><p><br/></p>`;

    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, imgTag);
      setContent(editorRef.current.innerHTML);
    }

    setShowImageModal(false);
  };

  // Apply Rich Text Formatting natively to ContentEditable Canvas
  const applyTextFormat = (command: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Toggle visual active state on toolbar button
    setActiveFormats((prev) => ({ ...prev, [command]: !prev[command] }));

    switch (command) {
      case "bold":
        document.execCommand("bold", false, undefined);
        break;
      case "italic":
        document.execCommand("italic", false, undefined);
        break;
      case "underline":
        document.execCommand("underline", false, undefined);
        break;
      case "link":
        const url = prompt("Enter Link URL:", "https://");
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      case "bullet":
        document.execCommand("insertUnorderedList", false, undefined);
        break;
      case "number":
        document.execCommand("insertOrderedList", false, undefined);
        break;
      case "quote":
        document.execCommand("formatBlock", false, "blockquote");
        break;
      case "code":
        document.execCommand("formatBlock", false, "pre");
        break;
      case "undo":
        document.execCommand("undo", false, undefined);
        break;
      case "redo":
        document.execCommand("redo", false, undefined);
        break;
      default:
        break;
    }

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Article Settings State
  const [sidebarTab, setSidebarTab] = useState<"DETAILS" | "SEO">("DETAILS");
  const [category, setCategory] = useState("Business");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [readDuration, setReadDuration] = useState("5 min read");

  // SEO State & Live Reactive Sync
  const [cardSummary, setCardSummary] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [isMetaDescCustom, setIsMetaDescCustom] = useState(false);
  const [isCardSummaryCustom, setIsCardSummaryCustom] = useState(false);
  const [isFocusKwCustom, setIsFocusKwCustom] = useState(false);

  // Live real-time SEO auto-generation as user types in title, subheading, or body content (3rd row)
  useEffect(() => {
    const cleanContent = content
      .replace(/<[^>]*>?/gm, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const auto = generateAutoSEO({
      title: title.trim(),
      subheading: subheading.trim(),
      content: cleanContent,
      category: category.toLowerCase(),
      authorName: currentUser?.name || "Rushdhi Riyaj",
      imageUrl: imageUrl.trim()
    });

    if (title.trim()) {
      setFocusKeyword(extractFocusKeyword(title.trim(), category));
    } else {
      setFocusKeyword(category.toLowerCase());
    }

    if (!isMetaDescCustom) {
      setMetaDescription(auto.metaDescription);
    }
    if (!isCardSummaryCustom) {
      const summarySource = subheading.trim() || cleanContent || title.trim();
      setCardSummary(
        summarySource
          ? summarySource.slice(0, 140) + (summarySource.length > 140 ? "..." : "")
          : "Digital Journal - Latest global news and technological insights."
      );
    }
    setMetaTitle(auto.metaTitle);
    setKeywords(auto.keywords.join(", "));
  }, [title, subheading, content, category, imageUrl, currentUser]);

  const handleAutoGenerateSEO = () => {
    setIsMetaDescCustom(false);
    setIsCardSummaryCustom(false);
    setIsFocusKwCustom(false);

    const cleanContent = content
      .replace(/<[^>]*>?/gm, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const auto = generateAutoSEO({
      title: title.trim(),
      subheading: subheading.trim(),
      content: cleanContent,
      category: category.toLowerCase(),
      authorName: currentUser?.name || "Rushdhi Riyaj",
      imageUrl: imageUrl.trim()
    });

    setFocusKeyword(auto.focusKeyword);
    setMetaDescription(auto.metaDescription);
    const summarySource = subheading.trim() || cleanContent || title.trim();
    setCardSummary(
      summarySource
        ? summarySource.slice(0, 140) + (summarySource.length > 140 ? "..." : "")
        : "Digital Journal - Latest global news and technological insights."
    );
    setMetaTitle(auto.metaTitle);
    setKeywords(auto.keywords.join(", "));
  };

  // Modals
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available Subcategories List
  const subcategoryList = [
    "US",
    "World",
    "Politics",
    "Economy & Markets",
    "Crypto",
    "Technology",
    "Travel",
    "Opinion",
    "CEO Spotlight",
    "Sports"
  ];

  const handleSubcategoryToggle = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      setSelectedSubcategories(selectedSubcategories.filter((item) => item !== sub));
    } else {
      if (selectedSubcategories.length < 5) {
        setSelectedSubcategories([...selectedSubcategories, sub]);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      let newTag = tagInput.trim().replace(/^#+/, "").replace(/,/g, "").trim();
      if (newTag) {
        const uppercaseTag = newTag.toUpperCase();
        if (!tags.includes(uppercaseTag)) {
          setTags([...tags, uppercaseTag]);
        }
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, tags.length - 1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const [submittingAction, setSubmittingAction] = useState<"draft" | "publish" | null>(null);

  const handleSaveDraft = () => {
    if (!title.trim()) {
      alert("Please enter a title before saving draft.");
      return;
    }
    setSubmittingAction("draft");
    savePost("Draft");
  };

  const handleSubmitReview = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both a title and article body content before submitting.");
      return;
    }
    setSubmittingAction("publish");
    savePost("Pending review");
  };

  const savePost = (status: "Published" | "Draft" | "Pending review") => {
    setIsSubmitting(true);

    let activeEmail = "";
    let activeName = "";
    let activeAvatar = "";
    let activeBio = "";
    try {
      const userStr = localStorage.getItem("dj_user") || localStorage.getItem("dj_writer_user");
      if (userStr) {
        const parsed = JSON.parse(userStr);
        activeEmail = parsed.email || "";
        activeName = parsed.name || "";
        activeAvatar = parsed.avatar || "";
        activeBio = parsed.bio || "";
      }
    } catch (e) {
      console.warn("Could not read current user for article:", e);
    }

    const savedProf = getUserProfile(activeEmail || currentUser?.email || "");
    const finalAuthorName = savedProf?.name || activeName || currentUser?.name || "Rushdhi MR";
    const finalAuthorAvatar = savedProf?.avatar || activeAvatar || currentUser?.avatar || "";
    const finalAuthorBio = savedProf?.bio || activeBio || "Journalist for Digital Journal.";

    const autoSeo = generateAutoSEO({
      title: title.trim(),
      subheading: subheading.trim(),
      content: content.trim(),
      category: category.toLowerCase(),
      authorName: finalAuthorName,
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      focusKeyword: focusKeyword.trim() || undefined,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      ogImage: imageUrl.trim() || undefined
    });

    const postToSave = {
      id: editingPostId || `post-${Date.now()}`,
      title: title.trim(),
      category: category.toUpperCase(),
      summary: subheading.trim() || title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
      status: status,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      reads: 0,
      tags: tags,
      readDuration: readDuration,
      authorEmail: activeEmail ? activeEmail.toLowerCase().trim() : "rushdhiriyaj2005@gmail.com",
      authorName: finalAuthorName,
      authorAvatar: finalAuthorAvatar,
      authorBio: finalAuthorBio,
      seo: autoSeo
    };

    try {
      const existingStr = localStorage.getItem("dj_writer_submitted_articles");
      let existingPosts: any[] = [];
      if (existingStr) {
        existingPosts = JSON.parse(existingStr);
      }

      let updated;
      if (editingPostId) {
        updated = existingPosts.map((p) => (p.id === editingPostId ? postToSave : p));
        localStorage.removeItem("dj_editing_post");
      } else {
        updated = [postToSave, ...existingPosts];
      }

      localStorage.setItem("dj_writer_submitted_articles", JSON.stringify(updated));
      localStorage.setItem(
        "dj_toast",
        status === "Pending review"
          ? `✓ Story "${title.trim()}" submitted for review! Admin approval is pending before publication.`
          : "✓ Draft saved successfully."
      );
    } catch (err) {
      console.warn("Error saving post to localStorage:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittingAction(null);
      router.push("/writer");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans antialiased text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* FIXED TOP NAVBAR HEADER WITH EMERALD ACCENT */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1E293B]/95 border-t-2 border-emerald-500 border-b border-slate-700/80 text-white px-6 py-3 flex items-center justify-between shadow-lg w-full backdrop-blur-md">
        {/* Left Side: Cancel Link & Context Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link
            href="/writer"
            onClick={() => {
              try {
                localStorage.removeItem("dj_editing_post");
              } catch (e) {}
            }}
            className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:translate-x-0.5"
          >
            <ArrowLeft size={15} className="stroke-[2.5]" />
            CANCEL
          </Link>

          <span className="text-slate-600 font-light">|</span>

          <span className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase bg-slate-800/80 px-3 py-1 rounded-xl border border-emerald-500/30 shadow-2xs">
            {editingPostId ? "EDIT" : "NEW"} {category.toUpperCase()} HEADLINE
          </span>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
              setShowPreviewModal(true);
            }}
            disabled={isSubmitting}
            className="border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider shadow-xs disabled:opacity-50"
          >
            <Eye size={14} className="text-slate-400 group-hover:text-emerald-400" />
            PREVIEW
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="border border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 text-slate-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && submittingAction === "draft" ? (
              <>
                <Loader2 size={14} className="animate-spin text-emerald-400" />
                <span>SAVING DRAFT...</span>
              </>
            ) : (
              <>
                <Save size={14} className="text-slate-400 group-hover:text-emerald-400" />
                <span>SAVE DRAFT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98] text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm shadow-orange-500/20 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && submittingAction === "publish" ? (
              <>
                <Loader2 size={14} className="animate-spin text-white" />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>SUBMIT FOR REVIEW</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE GRID */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-20 pb-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAIN RICH TEXT ARTICLE CANVAS */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-all min-h-[750px] flex flex-col">
            
            {/* WYSIWYG TOOLBAR BOX */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 mb-8 flex items-center flex-wrap gap-2 text-slate-600 select-none">
              <button
                type="button"
                onClick={() => applyTextFormat("undo")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Undo"
              >
                <Undo size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("redo")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Redo"
              >
                <Redo size={15} />
              </button>

              <span className="text-slate-300">|</span>

              <button
                type="button"
                onClick={() => applyTextFormat("bold")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  activeFormats.bold ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-slate-200/80 text-slate-700"
                }`}
                title="Bold (**text**)"
              >
                <Bold size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("italic")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  activeFormats.italic ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-slate-200/80 text-slate-700"
                }`}
                title="Italic (*text*)"
              >
                <Italic size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("underline")}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  activeFormats.underline ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-slate-200/80 text-slate-700"
                }`}
                title="Underline (<u>text</u>)"
              >
                <Underline size={15} />
              </button>

              <span className="text-slate-300">|</span>

              <button
                type="button"
                onClick={() => applyTextFormat("link")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Insert Link ([text](url))"
              >
                <Link2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("bullet")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Bullet List (• item)"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("number")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Numbered List (1. item)"
              >
                <ListOrdered size={15} />
              </button>

              <span className="text-slate-300">|</span>

              <button
                type="button"
                onClick={() => applyTextFormat("quote")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Blockquote (> quote)"
              >
                <Quote size={15} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("code")}
                className="p-1.5 hover:bg-slate-200/80 rounded text-slate-700 transition-colors cursor-pointer"
                title="Code (`code`)"
              >
                <Code size={15} />
              </button>

              <span className="text-slate-300">|</span>

              {/* INSERT IMAGE BUTTON */}
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="border border-orange-200 bg-orange-50/80 text-[#F97316] hover:bg-orange-100 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase tracking-wider transition-colors shadow-2xs"
              >
                <ImageIcon size={14} />
                INSERT IMAGE
              </button>
            </div>

            {/* TITLE INPUT - MULTI-LINE AUTO-EXPANDING TEXTAREA */}
            <textarea
              placeholder="Add Title..."
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                setFocusKeyword(extractFocusKeyword(newTitle, category));
              }}
              rows={2}
              className="w-full font-serif text-3xl sm:text-4xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none border-none py-2 mb-2 bg-transparent resize-none leading-tight overflow-hidden whitespace-normal break-words"
              onInput={(e: any) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            {/* SUBHEADING / DECK INPUT - MULTI-LINE AUTO-EXPANDING TEXTAREA */}
            <textarea
              placeholder="Add Subheading / Deck..."
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              rows={1}
              className="w-full font-serif text-lg sm:text-xl font-normal text-slate-600 placeholder:text-slate-300 focus:outline-none border-none py-2 mb-6 bg-transparent resize-none leading-relaxed overflow-hidden whitespace-normal break-words"
              onInput={(e: any) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            {/* BODY PARAGRAPHS RICH TEXT EDITABLE CANVAS CONTAINER */}
            <div className="relative flex-1 flex flex-col min-h-[400px]">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (editorRef.current) {
                    setContent(editorRef.current.innerHTML);
                  }
                  updateImgBoundingRect();
                }}
                onKeyUp={() => {
                  if (editorRef.current) {
                    setContent(editorRef.current.innerHTML);
                  }
                }}
                onBlur={() => {
                  if (editorRef.current) {
                    setContent(editorRef.current.innerHTML);
                  }
                }}
                onPaste={() => {
                  setTimeout(() => {
                    if (editorRef.current) {
                      setContent(editorRef.current.innerHTML);
                    }
                  }, 10);
                }}
                data-placeholder="Start writing or type / for plugins"
                className="w-full font-sans text-slate-800 text-sm sm:text-base leading-relaxed focus:outline-none border-none py-2 min-h-[400px] flex-1 outline-none relative empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 empty:before:pointer-events-none [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-3 [&_pre]:rounded-xl [&_a]:text-blue-600 [&_a]:underline"
              />

              {/* FLOATING TOP NAVY PILL TOOLBAR */}
              {imgBoundingRect && selectedImg && (
                <div
                  id="img-resize-toolbar"
                  style={{
                    top: `${Math.max(-44, imgBoundingRect.top - 46)}px`,
                    left: `${imgBoundingRect.left + imgBoundingRect.width / 2}px`,
                    transform: "translateX(-50%)",
                  }}
                  className="absolute z-30 bg-[#0B132B] text-white rounded-xl shadow-2xl px-3.5 py-1.5 flex items-center gap-2.5 text-xs font-semibold border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap select-none"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SIZE
                  </span>

                  <button
                    type="button"
                    onClick={() => handleResizeImage(250)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      selectedImgWidth <= 300
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 text-slate-200"
                    }`}
                  >
                    S
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResizeImage(480)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      selectedImgWidth > 300 && selectedImgWidth < 700
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 text-slate-200"
                    }`}
                  >
                    M
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResizeImage(900)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                      selectedImgWidth >= 700
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 text-slate-200"
                    }`}
                  >
                    FULL
                  </button>

                  <span className="text-slate-600 font-normal">|</span>

                  <button
                    type="button"
                    onClick={() => handleSetImageAlignment("left")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      selectedImgAlign === "left"
                        ? "bg-blue-600 text-white font-bold"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                    title="Align Left (Wrap Text)"
                  >
                    <AlignLeft size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetImageAlignment("center")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      selectedImgAlign === "center"
                        ? "bg-blue-600 text-white font-bold"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                    title="Align Center (No Wrap)"
                  >
                    <AlignCenter size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetImageAlignment("right")}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      selectedImgAlign === "right"
                        ? "bg-blue-600 text-white font-bold"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                    title="Align Right (Wrap Text)"
                  >
                    <AlignRight size={14} />
                  </button>

                  <span className="text-slate-600 font-normal">|</span>

                  <button
                    type="button"
                    onClick={handleEditSelectedImage}
                    className="p-1 px-2 hover:bg-slate-800 bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded transition-colors cursor-pointer flex items-center gap-1 font-bold"
                    title="Edit / Replace Image & Caption"
                  >
                    <Edit3 size={13} />
                    <span className="text-[10px] uppercase">Edit Image</span>
                  </button>

                  <span className="text-slate-600 font-normal">|</span>

                  <button
                    type="button"
                    onClick={handleMoveImageUp}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleMoveImageDown}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown size={14} />
                  </button>

                  <span className="text-slate-600 font-normal">|</span>

                  <button
                    type="button"
                    onClick={handleDeleteSelectedImage}
                    className="p-1 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {/* BLUE SELECTION BORDER AND INTERACTIVE DRAG HANDLES */}
              {imgBoundingRect && selectedImg && (
                <div
                  style={{
                    top: `${imgBoundingRect.top}px`,
                    left: `${imgBoundingRect.left}px`,
                    width: `${imgBoundingRect.width}px`,
                    height: `${imgBoundingRect.height}px`,
                  }}
                  className="absolute pointer-events-none border-2 border-blue-500 z-20 transition-all duration-75"
                >
                  {/* Left Edge Drag Strip */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "left")}
                    className="pointer-events-auto absolute top-0 -left-1 w-2 h-full cursor-ew-resize"
                  />

                  {/* Right Edge Drag Strip */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "right")}
                    className="pointer-events-auto absolute top-0 -right-1 w-2 h-full cursor-ew-resize"
                  />

                  {/* Top-Left Handle */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "top-left")}
                    className="pointer-events-auto absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform ring-2 ring-blue-100"
                  />
                  {/* Top-Right Handle */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "top-right")}
                    className="pointer-events-auto absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform ring-2 ring-blue-100"
                  />
                  {/* Bottom-Left Handle */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "bottom-left")}
                    className="pointer-events-auto absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform ring-2 ring-blue-100"
                  />
                  {/* Bottom-Right Handle */}
                  <div
                    data-resize-handle="true"
                    onMouseDown={(e) => handleStartResizeDrag(e, "bottom-right")}
                    className="pointer-events-auto absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform ring-2 ring-blue-100"
                  />
                </div>
              )}
            </div>


          </div>

          {/* RIGHT COLUMN: ARTICLE SETTINGS SIDEBAR PANEL */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs sticky top-20">
            
            {/* Sidebar Title Header */}
            <div className="flex items-center gap-2 mb-5 text-slate-800">
              <Settings size={18} className="text-slate-500" />
              <h3 className="font-serif text-sm font-bold tracking-wider uppercase text-slate-900">
                ARTICLE SETTINGS
              </h3>
            </div>

            {/* Segmented Tabs: DETAILS | SEO */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center mb-6">
              <button
                type="button"
                onClick={() => setSidebarTab("DETAILS")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === "DETAILS"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                DETAILS
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("SEO")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  sidebarTab === "SEO"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                SEO
              </button>
            </div>

            {/* TAB CONTENT: DETAILS */}
            {sidebarTab === "DETAILS" && (
              <div className="space-y-5">
                
                {/* 1. SELECT CATEGORY (MAIN) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    SELECT CATEGORY (MAIN)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Business">Business</option>
                    <option value="News">News</option>
                    <option value="Technology">Technology</option>
                    <option value="Politics">Politics</option>
                    <option value="Innovation">Innovation</option>
                    <option value="World">World</option>
                  </select>
                </div>

                {/* 2. SELECT SUB-CATEGORIES (OPTIONAL, MAX 5) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    SELECT SUB-CATEGORIES (OPTIONAL, MAX 5)
                  </label>
                  
                  <div className="border border-slate-200/90 rounded-xl p-3 bg-slate-50/50 max-h-48 overflow-y-auto mb-2 scrollbar-thin">
                    <div className="grid grid-cols-2 gap-2">
                      {subcategoryList.map((sub) => {
                        const isChecked = selectedSubcategories.includes(sub);
                        return (
                          <label
                            key={sub}
                            onClick={() => handleSubcategoryToggle(sub)}
                            className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none py-1 px-1.5 rounded hover:bg-slate-100/80 transition-colors"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                            }`}>
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className="truncate">{sub}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    SELECTED: {selectedSubcategories.length} / 5
                  </p>
                </div>

                {/* 3. TAGS */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    TAGS
                  </label>

                  {/* TAGS INPUT BOX MATCHING REFERENCE IMAGE */}
                  <div
                    onClick={() => {
                      const inputElem = document.getElementById("writer-tag-input");
                      if (inputElem) inputElem.focus();
                    }}
                    className="w-full bg-white border-2 border-[#F97316] rounded-2xl p-3 flex flex-wrap items-center gap-2 min-h-[56px] cursor-text focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-xs"
                  >
                    {/* DARK NAVY TAG PILLS WITH WHITE TEXT & # PREFIX */}
                    {tags.map((t) => (
                      <span
                        key={t}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(t);
                        }}
                        className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs group"
                        title="Click to remove"
                      >
                        #{t}
                        <X size={11} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                      </span>
                    ))}

                    {/* INLINE TEXT INPUT */}
                    <input
                      id="writer-tag-input"
                      type="text"
                      placeholder={tags.length > 0 ? "Add more tags..." : "e.g. BreakingNews, Football, WorldCup2026"}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 min-w-[120px] bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none py-1 border-none"
                    />
                  </div>

                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                    PRESS ENTER, COMMA OR SPACE TO ADD • CLICK TAG TO REMOVE • {tags.length} TAGS
                  </p>
                </div>

                {/* 4. READ DURATION */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    READ DURATION
                  </label>
                  <input
                    type="text"
                    value={readDuration}
                    onChange={(e) => setReadDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

              </div>
            )}

            {/* TAB CONTENT: SEO */}
            {sidebarTab === "SEO" && (
              <div className="animate-in fade-in duration-200">
                <SEOAssistantPanel
                  articleData={{
                    title: title.trim(),
                    subheading: subheading.trim(),
                    description: cardSummary.trim() || subheading.trim(),
                    content: content.trim(),
                    category: category.toLowerCase(),
                    authorName: currentUser?.name || "Rushdhi Riyaj",
                    imageUrl: imageUrl.trim()
                  }}
                  cardSummary={cardSummary}
                  focusKeyword={focusKeyword}
                  metaDescription={metaDescription}
                  onUpdateCardSummary={(val) => {
                    setCardSummary(val);
                    setIsCardSummaryCustom(true);
                  }}
                  onUpdateFocusKeyword={(val) => {
                    setFocusKeyword(val);
                    setIsFocusKwCustom(true);
                  }}
                  onUpdateMetaDescription={(val) => {
                    setMetaDescription(val);
                    setIsMetaDescCustom(true);
                  }}
                  onAutoGenerateSEO={handleAutoGenerateSEO}
                />
              </div>
            )}

          </div>

        </div>
      </main>

      {/* INSERT ARTICLE IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-sans text-left overflow-hidden border border-slate-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2.5 mb-5">
              <ImageIcon size={20} className="text-[#F97316] flex-shrink-0" />
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {selectedImg ? "Edit / Replace Image" : "Insert Article Image"}
              </h3>
            </div>

            <div className="space-y-4">
              
              {/* Field 1: PASTE IMAGE URL */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  PASTE IMAGE URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition-all"
                />
              </div>

              {/* Divider: OR UPLOAD FILE */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  OR UPLOAD FILE
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Field 2: CHOOSE COMPUTER FILE */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  CHOOSE COMPUTER FILE
                </label>
                
                <label className="border-2 border-dashed border-slate-200 hover:border-orange-300 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-100/50 transition-all flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-mono font-medium text-slate-700 truncate">
                    {imageFileName}
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 group-hover:underline shrink-0">
                    Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFileName(file.name);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setImageUrl(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Field 3: IMAGE CAPTION / ALT TEXT */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  IMAGE CAPTION / ALT TEXT
                </label>
                <input
                  type="text"
                  placeholder="Describe this image..."
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition-all"
                />
              </div>

              {/* Field 4: IMAGE CREDIT / SOURCE (OPTIONAL) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  IMAGE CREDIT / SOURCE (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Getty Images, AP Photo"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 transition-all"
                />
              </div>

              {/* Field 5 & 6 (2 columns): IMAGE SIZE & POSITION ALIGNMENT */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    IMAGE SIZE
                  </label>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Medium (Width: 450px)">Medium (Width: 450px)</option>
                    <option value="Small (Width: 300px)">Small (Width: 300px)</option>
                    <option value="Full Width (100%)">Full Width (100%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    POSITION ALIGNMENT
                  </label>
                  <select
                    value={imageAlignment}
                    onChange={(e) => setImageAlignment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Center (No Wrap)">Center (No Wrap)</option>
                    <option value="Left (Wrap Text)">Left (Wrap Text)</option>
                    <option value="Right (Wrap Text)">Right (Wrap Text)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleInsertImageToCanvas}
                  className="flex-1 py-3 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                >
                  {selectedImg ? "UPDATE IMAGE" : "INSERT IMAGE"}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* FULL-SCREEN ARTICLE PREVIEW OVERLAY MATCHING REFERENCE IMAGES */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto font-sans text-slate-900 animate-in fade-in duration-200">
          
          {/* 1. FIXED TOP NAVY BANNER */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] text-white px-6 py-3 flex items-center justify-between shadow-md border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="bg-[#B45309] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                PREVIEW MODE
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                This is how your article with inline images will render on the live feed.
              </span>
            </div>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <X size={14} />
              EXIT PREVIEW
            </button>
          </header>

          {/* 2. MAIN PREVIEW ARTICLE CONTENT CONTAINER */}
          <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 pt-20 pb-20">
            
            {/* BACK BREADCRUMB & UTILITY ACTIONS BAR */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8 pt-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                &lt; BACK TO NEWSFEED
              </button>

              <div className="flex items-center gap-2.5">
                {/* Font Size Selector */}
                <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/80 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 select-none">
                  <span className="text-[10px] text-slate-500">A</span>
                  <span className="text-xs text-slate-900 font-extrabold">A</span>
                  <span className="text-sm text-slate-500">A</span>
                </div>

                {/* Bookmark Button */}
                <button className="w-8 h-8 rounded-full border border-slate-200/90 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Bookmark size={14} />
                </button>

                {/* Share Button */}
                <button className="w-8 h-8 rounded-full border border-slate-200/90 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            {/* 2-COLUMN LAYOUT: MAIN ARTICLE (LEFT) & RECENT SIDEBAR (RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* LEFT COLUMN: MAIN ARTICLE */}
              <div className="lg:col-span-8">
                
                {/* CATEGORY TAG */}
                <span className="text-xs text-[#0F172A] tracking-widest font-black uppercase mb-3 block">
                  {category || "BUSINESS"}
                </span>

                {/* HEADLINE TITLE */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
                  {title.trim() || "Untitled Story"}
                </h1>

                {/* SUBHEADING / DECK */}
                {subheading.trim() && (
                  <p className="font-serif text-lg sm:text-xl text-slate-600 italic mb-4 leading-relaxed">
                    {subheading.trim()}
                  </p>
                )}

                {/* AUTHOR META ROW */}
                <div className="flex items-center gap-3.5 border-b border-slate-100 pb-6 mb-8 mt-4">
                  <img
                    src={currentUser?.avatar || "/author_bluesuit.jpg"}
                    alt={currentUser?.name || "rushdhi"}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span>By {currentUser?.name || "rushdhi"}</span>
                      <span className="bg-[#0077B5] text-white text-[8px] font-extrabold px-1 py-0.2 rounded inline-flex items-center justify-center">
                        in
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans tracking-wide uppercase mt-0.5">
                      PUBLISHED {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })} AT 4:12 PM EDT
                    </p>
                  </div>
                </div>

                {/* ARTICLE BODY & INLINE IMAGES CANVAS WITH MID-ARTICLE NEWSLETTER WIDGET */}
                <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-serif text-base sm:text-lg space-y-4 [&_a]:text-[#F97316] [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-[#EA580C] [&_figure]:my-6 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-slate-500 [&_figcaption]:italic [&_img]:rounded-xl [&_b]:font-bold [&_strong]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
                  {(() => {
                    const newsletterWidget = (
                      <div className="my-8 bg-amber-50/40 border-t-2 border-b-2 border-[#B45309]/30 py-6 px-1 text-left not-prose">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#B45309] mb-1">
                          Digital Journal Fast Start — Let the best of news come to you
                        </h3>
                        <p className="text-xs text-slate-600 mb-4 font-sans">
                          Sign up and stay up to date with our daily newsletter.
                        </p>

                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3 flex-wrap">
                          <input
                            type="email"
                            placeholder="Enter your email."
                            className="px-4 py-2.5 bg-white border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#B45309] flex-1 min-w-[220px] max-w-md"
                          />
                          <button
                            type="submit"
                            className="bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs uppercase px-6 py-2.5 rounded-md tracking-wider transition-colors cursor-pointer"
                          >
                            SIGN UP NOW
                          </button>
                        </form>

                        <p className="text-[9px] text-slate-400 font-sans mt-2.5">
                          You can unsubscribe at any time. By signing up you are agreeing to our{" "}
                          <a href="#" className="underline text-slate-500">Terms &amp; Conditions</a> and{" "}
                          <a href="#" className="underline text-slate-500">Privacy Policy</a>.
                        </p>
                      </div>
                    );

                    if (!content.trim()) {
                      return (
                        <>
                          <p className="text-slate-400 italic font-sans py-8 border-y border-dashed border-slate-200 my-4 text-center">
                            No article body content written yet. Start writing in the editor to see your live preview here.
                          </p>
                          {newsletterWidget}
                        </>
                      );
                    }

                    // Unescape any encoded HTML entities so the browser renders actual styled images, figures, and text
                    let rawHtml = content;
                    if (rawHtml.includes("&lt;") || rawHtml.includes("&gt;")) {
                      rawHtml = rawHtml
                        .replace(/&lt;/g, "<")
                        .replace(/&gt;/g, ">")
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&amp;/g, "&");
                    }

                    const pMatches = rawHtml.split("</p>");
                    if (pMatches.length >= 3) {
                      const mid = Math.min(2, Math.floor(pMatches.length / 2));
                      const firstPart = pMatches.slice(0, mid).join("</p>") + (pMatches[mid - 1]?.includes("</p>") ? "" : "</p>");
                      const secondPart = pMatches.slice(mid).join("</p>");

                      return (
                        <>
                          <div dangerouslySetInnerHTML={{ __html: firstPart }} />
                          {newsletterWidget}
                          <div dangerouslySetInnerHTML={{ __html: secondPart }} />
                        </>
                      );
                    }

                    return (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
                        {newsletterWidget}
                      </>
                    );
                  })()}
                </div>

                {/* HASHTAGS SECTION IN PREVIEW - TEXT ONLY NO BORDERS NO BACKGROUND COLOURS */}
                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      TAGS:
                    </span>
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="text-slate-800 hover:text-[#1B50E8] font-bold text-xs cursor-pointer transition-colors"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* COMMENTS SECTION (MATCHING REFERENCE IMAGE 5) */}
                <div className="pt-6 border-t border-slate-200 mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-slate-800" />
                    <h4 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider">
                      COMMENTS (0)
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                    />
                    <button
                      type="button"
                      className="bg-slate-400 hover:bg-slate-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      POST
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 italic mt-2.5">
                    No comments yet. Be the first to share your thoughts.
                  </p>
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN: RECENT IN CATEGORY */}
              <div className="lg:col-span-4 pl-0 lg:pl-6 border-l-0 lg:border-l border-slate-100 min-h-[300px]">
                <h3 className="font-serif text-xs font-bold text-slate-900 tracking-wider uppercase border-b-2 border-slate-900 pb-1.5 mb-4">
                  RECENT IN {category.toUpperCase() || "BUSINESS"}
                </h3>
                
                <p className="text-xs text-slate-400 italic font-serif">
                  No other recent articles in this category.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
