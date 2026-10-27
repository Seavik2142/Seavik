/**
 * Media detection and formatting utility for handling all image and PDF types.
 */

export const IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "svg",
  "gif",
  "avif",
  "bmp",
  "ico",
];

export const PDF_EXTENSIONS = ["pdf"];

/**
 * Clean a URL or path of query strings and hashes.
 */
export function cleanUrl(url) {
  if (!url) return "";
  return url.split("?")[0].split("#")[0];
}

/**
 * Safely encode a media URL (spaces, unicode characters like narrow no-break space),
 * while preserving slashes, query params, and hashes. Idempotent.
 */
export function safeMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;

  try {
    const [pathPart, rest] = url.split("?");
    const [path, hash] = pathPart.split("#");
    const encodedSegments = path
      .split("/")
      .map((segment) => {
        if (!segment) return "";
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      });
    let result = encodedSegments.join("/");
    if (hash !== undefined) {
      result += "#" + hash;
    }
    if (rest !== undefined) {
      result += "?" + rest;
    }
    return result;
  } catch {
    return encodeURI(url);
  }
}


/**
 * Get file extension (lowercase, no dot).
 */
export function getExtension(url) {
  const clean = cleanUrl(url);
  const parts = clean.split(".");
  if (parts.length <= 1) return "";
  return parts.pop().toLowerCase();
}

/**
 * Checks if URL is a PDF document.
 */
export function isPdf(url) {
  if (!url) return false;
  const ext = getExtension(url);
  return PDF_EXTENSIONS.includes(ext);
}

/**
 * Checks if URL is any supported image format.
 */
export function isImage(url) {
  if (!url) return false;
  const ext = getExtension(url);
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Determine the media type: 'pdf' | 'image' | 'external'
 */
export function getMediaType(url) {
  if (!url) return "unknown";
  if (isPdf(url)) return "pdf";
  if (isImage(url)) return "image";
  return "external";
}

/**
 * Get a user-friendly format badge label (e.g. 'PDF', 'PNG', 'JPEG', 'WEBP').
 */
export function getFormatLabel(url) {
  const ext = getExtension(url);
  if (!ext) {
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return "LINK";
    }
    return "FILE";
  }
  return ext.toUpperCase();
}

/**
 * Extract clean basename from URL or path.
 */
export function getFileBasename(url) {
  const clean = cleanUrl(url);
  const segments = clean.split("/");
  return decodeURIComponent(segments.pop() || "");
}
