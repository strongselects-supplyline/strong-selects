import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectImageUrl(url?: string): string | null {
  if (!url) return null;

  // Handle Google Drive links
  // Format: drive.google.com/file/d/ID/view -> drive.google.com/uc?export=view&id=ID
  // Format: drive.google.com/open?id=ID -> drive.google.com/uc?export=view&id=ID
  if (url.includes("drive.google.com")) {
    let id = "";
    const parts = url.split("/");
    const dIndex = parts.indexOf("d");

    if (dIndex !== -1 && parts[dIndex + 1]) {
      id = parts[dIndex + 1];
    } else {
      // Try regex for id= parameter
      const match = url.match(/[?&]id=([^&]+)/);
      if (match) id = match[1];
    }

    if (id) {
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }

  return url;
}
