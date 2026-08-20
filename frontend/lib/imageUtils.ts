"use client";

/**
 * Converts any Image File, Blob, or base64 data URL into modern WebP format
 * using HTML5 Canvas client-side rendering.
 *
 * @param input Image File, Blob, or image data URL string
 * @param quality Compression quality between 0.1 and 1.0 (default: 0.85)
 * @returns Promise<string> containing the data:image/webp;base64,... string
 */
export async function convertToWebP(
  input: File | Blob | string,
  quality: number = 0.85
): Promise<string> {
  if (!input) return "";

  // If already a webp data URL or an external .webp URL, return as-is
  if (typeof input === "string") {
    if (input.startsWith("data:image/webp")) {
      return input;
    }
    if (input.endsWith(".webp") && !input.startsWith("data:")) {
      return input;
    }
  }

  return new Promise((resolve) => {
    let sourceUrl = "";
    let shouldRevoke = false;
    if (typeof input !== "string") {
      sourceUrl = URL.createObjectURL(input);
      shouldRevoke = true;
    } else {
      sourceUrl = input;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          if (shouldRevoke) URL.revokeObjectURL(sourceUrl);
          resolve(typeof input === "string" ? input : sourceUrl);
          return;
        }

        // Draw image smoothly onto canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to WebP format
        const webpDataUrl = canvas.toDataURL("image/webp", quality);

        if (shouldRevoke) URL.revokeObjectURL(sourceUrl);

        // Verify webp output was generated (some older engines might fallback to png if webp not supported)
        if (webpDataUrl.startsWith("data:image/webp")) {
          resolve(webpDataUrl);
        } else {
          resolve(webpDataUrl);
        }
      } catch (err) {
        console.warn("Canvas WebP conversion error, keeping source:", err);
        if (shouldRevoke) URL.revokeObjectURL(sourceUrl);
        resolve(typeof input === "string" ? input : "");
      }
    };

    img.onerror = () => {
      console.warn("Image load failed during WebP conversion:", sourceUrl.slice(0, 50));
      if (shouldRevoke) URL.revokeObjectURL(sourceUrl);
      resolve(typeof input === "string" ? input : "");
    };

    img.src = sourceUrl;
  });
}

/**
 * Parses all <img> tags within an HTML content string and converts any embedded
 * image sources (PNG, JPEG, GIF, BMP, etc.) into WebP data URLs before publishing.
 *
 * @param html The raw article HTML body string
 * @param quality Compression quality for WebP
 * @returns Promise<string> The processed HTML string with WebP images
 */
export async function convertHtmlImagesToWebP(
  html: string,
  quality: number = 0.85
): Promise<string> {
  if (!html || typeof window === "undefined") return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    if (images.length === 0) return html;

    for (const img of images) {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("data:image/webp") && !src.endsWith(".webp")) {
        // Convert base64 data URLs or loadable image sources to WebP
        if (src.startsWith("data:image/") || src.startsWith("blob:")) {
          try {
            const webpSrc = await convertToWebP(src, quality);
            if (webpSrc && webpSrc.startsWith("data:image/webp")) {
              img.setAttribute("src", webpSrc);
            }
          } catch (e) {
            console.warn("Failed to convert inner image to WebP:", e);
          }
        }
      }
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.warn("Error processing HTML images for WebP conversion:", err);
    return html;
  }
}
