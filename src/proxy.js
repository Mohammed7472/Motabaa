// Simple proxy function to handle CORS issues
export const proxyFetch = async (url, options = {}) => {
  try {
    // Try direct fetch first
    return await fetch(url, options);
  } catch (error) {
    console.log("Direct fetch failed, trying with CORS proxy:", error);
    
    // If direct fetch fails, try with a CORS proxy
    // Note: This is a public proxy and may have rate limits
    const corsProxyUrl = "https://corsproxy.io/?";
    return await fetch(corsProxyUrl + encodeURIComponent(url), options);
  }
};