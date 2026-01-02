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
  // GSC 404s - team members that no longer exist or have different slugs
  'sofia-lapa',
  'diogo-saraiva-ponte', // actual slug is 'diogo-saraiva-de-ponte'
  'antonio-pereira', // actual slug is 'antnio-pereira' (no accent)
  'francisco-giao', // actual slug is 'francisco-gio'
  'goncalo-mendes', // actual slug is 'gonalo-mendes'
  'ines-borges-de-carvalho', // doesn't exist
  'miguel-realista', // actual slug is 'miguel-bicker-realista'
  'antonio-ferreira', // actual slug is 'afonso-ferreira' or doesn't exist
  'mariana-mello-e-castro', // doesn't exist
  'tomas-sa', // doesn't exist
]);

/**
 * Check if a team member slug should return 410 Gone
 */
export function isGoneTeamMember(slug: string): boolean {
  if (!slug) return false;
  return GONE_TEAM_MEMBER_SLUGS.has(slug.toLowerCase().trim());
}
