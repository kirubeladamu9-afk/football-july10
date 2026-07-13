const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Remove HTML tags if any
  const plainText = text.replace(/<[^>]*>/g, ' ');
  
  // Count words
  const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time (minimum 1 minute)
  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
  
  return readingTime > 0 ? readingTime : 1;
}
