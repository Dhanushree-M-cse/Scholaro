/**
 * Validates and sanitizes URLs to prevent security risks like javascript: protocol execution.
 * Returns true only for valid http/https URLs.
 */
function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim().toLowerCase();
  
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('file:') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (err) {
    return false;
  }
}

function sanitizeUrl(urlString) {
  if (!isValidUrl(urlString)) return null;
  return urlString.trim();
}

module.exports = {
  isValidUrl,
  sanitizeUrl
};
