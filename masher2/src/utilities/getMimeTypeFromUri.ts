export const getMimeTypeFromUri = (uri: string): string => {
    const extension = uri.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
        return "image/jpeg";
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream"; // Fallback MIME type
    }
  };