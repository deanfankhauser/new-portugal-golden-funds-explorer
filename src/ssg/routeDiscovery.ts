import { fetchAllBuildDataCached } from '../lib/build-data-fetcher';
import { generateComparisonsFromFunds } from '../data/services/comparison-service';
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

export interface StaticRoute {
  path: string;
  pageType: string;
  params?: Record<string, any>; // Allow any type for flexible param passing
  fundId?: string;
  isCanonical?: boolean; // true = include in sitemap, false = exclude (non-canonical pages)
}

export class RouteDiscovery {
  static async getAllStaticRoutes(): Promise<StaticRoute[]> {
    const routes: StaticRoute[] = [];

    console.log('🔍 RouteDiscovery: Fetching data from database for route generation...');
    console.log('🔌 Environment check:');
    console.log(`   VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`   VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
    
    // Fetch all data from database (cached for efficiency)
    const { funds, categories, tags, managers, teamMembers } = await fetchAllBuildDataCached();
    
    console.log('📊 Data fetched successfully:');
    console.log(`   Funds: ${funds.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Tags: ${tags.length}`);
    console.log(`   Managers: ${managers.length}`);
    console.log(`   Team Members: ${teamMembers?.length || 0}`);
    if (teamMembers && teamMembers.length > 0) {
      console.log(`   Sample team member slugs: ${teamMembers.slice(0, 3).map(m => m.slug).join(', ')}`);
    }

    // Homepage (main fund listing)
    routes.push({ path: '/', pageType: 'homepage' });

    // Static pages
    routes.push({ path: '/about', pageType: 'about' });
    routes.push({ path: '/disclaimer', pageType: 'disclaimer' });
    routes.push({ path: '/privacy', pageType: 'privacy' });
    routes.push({ path: '/faqs', pageType: 'faqs' });
    routes.push({ path: '/compare', pageType: 'compare' });
    routes.push({ path: '/comparisons', pageType: 'comparisons-hub' });
    routes.push({ path: '/roi-calculator', pageType: 'roi-calculator' });
    routes.push({ path: '/saved-funds', pageType: 'saved-funds' });
    routes.push({ path: '/verified-funds', pageType: 'verified-funds' });
    routes.push({ path: '/verification-program', pageType: 'verification-program' });
    routes.push({ path: '/ira-401k-eligible-funds', pageType: 'ira-401k-eligible' });
    
    routes.push({ path: '/managers', pageType: 'managers-hub' });
    routes.push({ path: '/categories', pageType: 'categories-hub' });
    routes.push({ path: '/tags', pageType: 'tags-hub' });
    routes.push({ path: '/alternatives', pageType: 'alternatives-hub' });

    // Fund detail pages - ONLY the direct route pattern
    funds.forEach(fund => {
      // Only use the new direct route: /fund-id
      routes.push({
        path: `/${fund.id}`,
        pageType: 'fund',
        params: { fundName: fund.name },
        fundId: fund.id,
        isCanonical: true
      });
    });

    // Manager pages
    const { managerProfiles = [] } = await fetchAllBuildDataCached();
    managers.forEach(manager => {
      // Skip managers with empty names (defensive check)
      if (!manager.name || manager.name.trim() === '') {
        console.warn('⚠️ RouteDiscovery: Skipping manager with empty name');
        return;
      }
      
      const slug = managerToSlug(manager.name);
      
      // Skip if slug is empty (defensive check)
      if (!slug) {
        console.warn(`⚠️ RouteDiscovery: Skipping manager with empty slug: "${manager.name}"`);
        return;
      }
      
      // Find matching profile
      const managerProfile = managerProfiles.find(p => 
        p.name.toLowerCase() === manager.name.toLowerCase() ||
        p.company_name.toLowerCase() === manager.name.toLowerCase()
      );
      // Find associated funds
      const managerFunds = funds.filter(f => 
        f.managerName.toLowerCase() === manager.name.toLowerCase()
      );
      
      routes.push({
        path: `/manager/${slug}`,
        pageType: 'manager',
        params: { 
          managerName: manager.name,
          managerProfile,
          funds: managerFunds
        }
      });
    });

    // Team member profile pages
    if (teamMembers && teamMembers.length > 0) {
      teamMembers.forEach(member => {
        routes.push({
          path: `/team/${member.slug}`,
          pageType: 'team-member',
          params: { 
            slug: member.slug,
            name: member.name,
            role: member.role,
            linkedinUrl: member.linkedin_url,
            photoUrl: member.photo_url,
            bio: member.bio,
            companyName: member.company_name
          }
        });
      });
      
      // Validate critical team member exists
      const criticalTeamMemberSlug = 'joaquim-maria-magalhes-luiz-gomes';
      const hasCriticalTeamMember = routes.some(r => r.path === `/team/${criticalTeamMemberSlug}`);
      if (!hasCriticalTeamMember) {
        console.warn(`⚠️ WARNING: Critical team member route /team/${criticalTeamMemberSlug} not discovered!`);
        console.warn(`⚠️ Available team member slugs: ${teamMembers.map(m => m.slug).join(', ')}`);
      }
    } else {
      console.warn('⚠️ WARNING: No team members found in database! Team member routes will not be generated.');
    }

    // Category pages
    categories.forEach(category => {
      const slug = categoryToSlug(category);
      routes.push({
        path: `/categories/${slug}`,
        pageType: 'category',
        params: { categoryName: category }
      });
    });

    // Tag pages
    tags.forEach(tag => {
      const slug = tagToSlug(tag);
      routes.push({
        path: `/tags/${slug}`,
        pageType: 'tag',
        params: { tagName: tag }
      });
    });

    // Fund comparison pages (canonical - keep in sitemap)
    const comparisons = generateComparisonsFromFunds(funds);
    comparisons.forEach(comparison => {
      routes.push({
        path: `/compare/${comparison.slug}`,
        pageType: 'fund-comparison',
        params: { slug: comparison.slug },
        isCanonical: true
      });
    });

    // Fund alternatives pages (non-canonical - exclude from sitemap, canonical points to main fund page)
    funds.forEach(fund => {
      routes.push({
        path: `/${fund.id}/alternatives`,
        pageType: 'fund-alternatives',
        params: { fundName: fund.name },
        fundId: fund.id,
        isCanonical: false
      });
    });

    // Filter out admin and edit suggestion routes from SSG
    const filteredRoutes = routes.filter(route => {
      // Exclude admin panel routes
      if (route.path.startsWith('/admin')) return false;
      // Exclude edit suggestion routes
      if (route.path.includes('/edit-suggestions')) return false;
      // Exclude fund manager routes
      if (route.path.startsWith('/manage-fund')) return false;
      return true;
    });

    // Log route counts by type
    const teamMemberRouteCount = filteredRoutes.filter(r => r.pageType === 'team-member').length;
    const fundRouteCount = filteredRoutes.filter(r => r.pageType === 'fund').length;
    const categoryRouteCount = filteredRoutes.filter(r => r.pageType === 'category').length;
    const tagRouteCount = filteredRoutes.filter(r => r.pageType === 'tag').length;
    const managerRouteCount = filteredRoutes.filter(r => r.pageType === 'manager').length;
    
    console.log(`🔍 RouteDiscovery: Generated ${filteredRoutes.length} static routes from database (filtered from ${routes.length} total)`);
    console.log(`   📄 Route breakdown: ${fundRouteCount} funds, ${teamMemberRouteCount} team members, ${categoryRouteCount} categories, ${tagRouteCount} tags, ${managerRouteCount} managers`);
    console.log(`   🔗 Additional: ${comparisons.length} comparisons, ${funds.length} alternatives pages`);
    
    return filteredRoutes;
  }

}

export const getAllStaticRoutes = () => RouteDiscovery.getAllStaticRoutes();
