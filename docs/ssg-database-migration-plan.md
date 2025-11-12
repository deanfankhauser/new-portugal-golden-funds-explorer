# SSG Database Migration Plan

## Overview
Migrate all build-time static site generation (SSG) and sitemap creation from mock data to live Supabase database to ensure SEO consistency between pre-rendered content and runtime content.

## Problem Statement
Currently, SSG files use mock data from `src/data/mock/funds/` while runtime pages fetch from Supabase. This creates:
- **Sitemap accuracy issues**: New funds missing from sitemaps
- **Content mismatch**: Pre-rendered HTML differs from hydrated content (cloaking risk)
- **Stale modification dates**: Sitemaps use mock `dateModified` instead of real `updated_at`
- **Missing comparison pages**: New fund combinations not in sitemap
- **Core Web Vitals impact**: Content shifts during hydration hurt performance

## Files Requiring Migration

### Phase 1: Core Data Services (Priority: Critical)
1. **`src/ssg/routeDiscovery.ts`**
   - Currently: Uses `fundsData` from mock files
   - Change: Fetch from Supabase during build
   - Impact: Ensures all routes in sitemap reflect database state

2. **`scripts/ssg/sitemap-funds-generator.ts`**
   - Currently: Uses `funds` from funds-service (mock data)
   - Change: Direct Supabase query for all funds
   - Impact: Sitemap-funds.xml accuracy

3. **`scripts/ssg/comprehensive-sitemap-generator.ts`**
   - Currently: Uses mock data for all URL generation
   - Change: Database queries for funds, categories, tags, managers
   - Impact: Complete sitemap accuracy

### Phase 2: Enhanced Sitemap Services (Priority: High)
4. **`src/services/enhancedSitemapService.ts`**
   - Currently: Imports `funds` from mock data
   - Change: Accept funds as parameter or fetch directly
   - Impact: Enhanced sitemap XML generation

5. **`src/services/comprehensiveSitemapService.ts`**
   - Currently: Uses mock services for all data
   - Change: Database queries for all entity types
   - Impact: Comprehensive sitemap accuracy

### Phase 3: SEO Metadata Services (Priority: Medium)
6. **`src/services/consolidatedSEOService.ts`**
   - Currently: Uses mock data for structured data
   - Change: Fetch real fund data for meta tags
   - Impact: Accurate structured data in pre-rendered HTML

7. **`scripts/ssg/sitemap-generator.ts`**
   - Currently: Processes routes from mock data
   - Change: Work with database-sourced routes
   - Impact: Main sitemap.xml accuracy

## Technical Implementation Strategy

### 1. Supabase Connection for Build Scripts
```typescript
// Create: src/lib/supabase-build.ts
import { createClient } from '@supabase/supabase-js';

export function getSupabaseBuildClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables for build');
  }
  
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
```

### 2. Data Fetching Utilities
```typescript
// Create: src/lib/build-data-fetcher.ts
import { getSupabaseBuildClient } from './supabase-build';
import type { Fund } from '@/data/types/funds';

export async function fetchAllFundsForBuild(): Promise<Fund[]> {
  const supabase = getSupabaseBuildClient();
  
  const { data: funds, error } = await supabase
    .from('funds')
    .select('*')
    .order('final_rank', { ascending: true, nullsFirst: false });
    
  if (error) {
    console.error('Build: Failed to fetch funds', error);
    throw new Error(`Database fetch failed: ${error.message}`);
  }
  
  return funds || [];
}

export async function fetchAllManagersForBuild() { /* ... */ }
export async function fetchAllCategoriesForBuild() { /* ... */ }
export async function fetchAllTagsForBuild() { /* ... */ }
```

### 3. Migration Pattern for Each File

**Before:**
```typescript
import { funds } from '../data/services/funds-service'; // Mock data

export function generateRoutes() {
  funds.forEach(fund => {
    // Generate routes
  });
}
```

**After:**
```typescript
import { fetchAllFundsForBuild } from '../lib/build-data-fetcher';

export async function generateRoutes() {
  const funds = await fetchAllFundsForBuild();
  
  funds.forEach(fund => {
    // Generate routes
  });
}
```

### 4. Error Handling Strategy
```typescript
// Graceful degradation during build failures
export async function generateRoutesWithFallback() {
  try {
    const funds = await fetchAllFundsForBuild();
    return generateRoutes(funds);
  } catch (error) {
    console.warn('Build: Database fetch failed, using fallback', error);
    // Option A: Fail build (recommended for production)
    throw error;
    
    // Option B: Use minimal static routes (emergency fallback)
    // return getMinimalStaticRoutes();
  }
}
```

## Migration Steps (Ordered)

### Step 1: Create Infrastructure ✅
- [ ] Create `src/lib/supabase-build.ts` for build-time Supabase client
- [ ] Create `src/lib/build-data-fetcher.ts` with typed fetch functions
- [ ] Add error handling and logging utilities
- [ ] Test connection in isolation

### Step 2: Migrate Route Discovery ✅
- [ ] Update `src/ssg/routeDiscovery.ts` to use `fetchAllFundsForBuild()`
- [ ] Update comparison generation to use database funds
- [ ] Update manager/category/tag routes to fetch from database
- [ ] Test route generation locally

### Step 3: Migrate Sitemap Generators ✅
- [ ] Update `scripts/ssg/sitemap-funds-generator.ts`
- [ ] Update `scripts/ssg/comprehensive-sitemap-generator.ts`
- [ ] Update `scripts/ssg/sitemap-generator.ts`
- [ ] Verify sitemap.xml output matches database

### Step 4: Migrate Enhanced Services ✅
- [ ] Update `src/services/enhancedSitemapService.ts`
- [ ] Update `src/services/comprehensiveSitemapService.ts`
- [ ] Update `src/services/consolidatedSEOService.ts`
- [ ] Test structured data generation

### Step 5: Update Build Scripts ✅
- [ ] Update `scripts/ssg/ssg-orchestrator.ts` to await async operations
- [ ] Update `scripts/build-ssg.js` if needed
- [ ] Ensure `scripts/compile-ssg.js` handles async properly

### Step 6: Testing & Validation ✅
- [ ] Run full build locally: `npm run build`
- [ ] Verify sitemap.xml contains all database funds
- [ ] Check pre-rendered HTML for fund pages
- [ ] Compare build output vs runtime data
- [ ] Test with added/removed funds in database

### Step 7: Performance Optimization ✅
- [ ] Add parallel fetching where possible
- [ ] Cache fetched data during build (single fetch, multiple uses)
- [ ] Monitor build time impact
- [ ] Add build-time metrics logging

## Performance Considerations

### Expected Build Time Impact
- **Current**: ~30-60 seconds (mock data, instant access)
- **After Migration**: +15-30 seconds (database fetches)
- **Mitigation**: Parallel queries, connection pooling, caching

### Optimization Strategies
1. **Batch Fetching**: Fetch all data types in parallel
2. **Build Caching**: Cache fetched data during single build
3. **Incremental Builds**: Only regenerate changed routes (future enhancement)
4. **Connection Reuse**: Single Supabase client for all operations

## Environment Variables Required

Build process needs access to:
```bash
VITE_SUPABASE_URL=https://bkmvydnfhmkjnuszroim.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

Ensure these are set in:
- Local `.env` file
- Vercel project environment variables
- CI/CD pipeline (if applicable)

## Rollback Plan

If migration causes build failures:
1. **Immediate**: Revert to mock data temporarily
2. **Debug**: Check Supabase connection, credentials, network
3. **Fallback**: Implement hybrid approach (try database, fallback to mock)
4. **Monitor**: Add comprehensive logging to identify issues

## Success Criteria

✅ **Build succeeds** with database connection  
✅ **Sitemap contains all database funds** (not just mock funds)  
✅ **Pre-rendered HTML matches runtime data** (no content mismatch)  
✅ **Modification dates accurate** (uses `updated_at` from database)  
✅ **New funds appear in sitemap** after adding to database  
✅ **Build time acceptable** (<2 minutes total)  
✅ **No SEO cloaking warnings** in Google Search Console  

## SEO Benefits

1. **Accurate Indexing**: All funds discoverable by search engines
2. **Fresh Content Signals**: Real modification dates trigger re-crawling
3. **Consistency**: Pre-rendered content matches hydrated content
4. **Core Web Vitals**: Reduced Cumulative Layout Shift (CLS)
5. **Trust**: No risk of Google penalizing for cloaking

## Next Steps

**Option A: Full Migration** (Recommended)
- Implement all 7 steps above
- Complete migration to database for all build processes
- Maximum SEO benefit, single source of truth

**Option B: Phased Approach** (Lower Risk)
- Start with Phase 1 only (route discovery + fund sitemap)
- Monitor build performance and stability
- Gradually add Phase 2 and 3

**Decision Required**: Which approach do you prefer?
