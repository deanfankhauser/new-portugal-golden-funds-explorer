/**
 * Extracts education information from a biographical text
 */
export const extractEducation = (bio: string): { degree?: string; institution?: string } | null => {
  if (!bio) return null;

  // Patterns to match common education descriptions
  const patterns = [
    // "degree in X from Y"
    /(?:holds?\s+a?\s*)?(?:degree|bachelor|master|mba|phd)(?:'s)?\s+in\s+([^from]+?)\s+from\s+([^.,;]+)/i,
    // "studied X at Y"
    /studied\s+([^at]+?)\s+at\s+([^.,;]+)/i,
    // "graduated from Y with X" or "graduated from Y"
    /graduated\s+from\s+([^with.,;]+?)(?:\s+with\s+(?:a\s+)?([^.,;]+))?/i,
    // "X, Y" (less specific)
    /(?:degree|bachelor|master|mba|phd)(?:'s)?\s+in\s+([^,]+),\s+([^.,;]+)/i,
  ];

  for (const pattern of patterns) {
    const match = bio.match(pattern);
    if (match) {
      // Different patterns capture groups differently
      if (pattern.source.includes('graduated from')) {
        return {
          institution: match[1]?.trim(),
          degree: match[2]?.trim()
        };
      }
      
      return {
        degree: match[1]?.trim(),
        institution: match[2]?.trim()
      };
    }
  }

  // Try to find just institution names with common education keywords
  const institutionPattern = /(?:university|college|school|institute|academy)\s+(?:of\s+)?([^.,;]+)/i;
  const institutionMatch = bio.match(institutionPattern);
  
  if (institutionMatch) {
    return {
      institution: institutionMatch[0]?.trim()
    };
  }

  return null;
};
