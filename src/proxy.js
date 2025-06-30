// Simple proxy function to handle CORS issues
export const proxyFetch = async (url, options = {}) => {
  try {
    // Try direct fetch first
    return await fetch(url, options);
  } catch (error) {
    // ...existing code...

    // If direct fetch fails, try with a CORS proxy
    // Note: This is a public proxy and may have rate limits
    const corsProxyUrl = "https://corsproxy.io/?";
    return await fetch(corsProxyUrl + encodeURIComponent(url), options);
  }
};
