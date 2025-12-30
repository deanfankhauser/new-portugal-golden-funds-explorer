/**
 * Registry of permanently removed team member slugs.
 * These return 410 Gone instead of 404 Not Found.
 * 
 * Add slugs here when a team member profile is intentionally removed
 * to signal to search engines that the content is permanently gone.
 */
export const GONE_TEAM_MEMBER_SLUGS = new Set<string>([
  'pedro-rebelo',
  'octanova-team',
  // Add other removed slugs as needed
]);

/**
 * Check if a team member slug should return 410 Gone
 */
export function isGoneTeamMember(slug: string): boolean {
  if (!slug) return false;
  return GONE_TEAM_MEMBER_SLUGS.has(slug.toLowerCase().trim());
}
