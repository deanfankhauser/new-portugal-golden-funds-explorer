# SSG Quick Reference Guide

## How to Build with SSG

```bash
# Standard build (includes SSG)
npm run build

# The build process will:
# 1. Run Vite build
# 2. Generate static HTML files
# 3. Verify H1 tags are present
# 4. Report build quality
```

## Checking Build Success

### Look for these log messages:

```
📊 SSG: Fund Pages Status:
   ✅ Generated: X fund pages
   🏷️  With H1 tags: X fund pages

🔍 Verifying SSG build quality...

✅ Homepage: Has H1, Has meta
📄 Fund Detail Pages:
   portugal-liquid-opportunities: ✅ H1, ✅ Meta, ✅ Schema
   
✅ SSG BUILD VERIFIED: All checks passed!
```

### Red Flags (Problems):

```
❌ Missing H1              # Fund page has no H1 tag
❌ Missing meta            # No SEO meta tags
❌ NOT FOUND               # HTML file wasn't generated
❌ CRITICAL: No fund URLs! # Sitemap missing fund pages
```

## Manual Verification

### 1. Check if files exist:
```bash
ls dist/portugal-liquid-opportunities/index.html
ls dist/horizon-fund/index.html
```

### 2. Check for H1 tags:
```bash
grep -i "<h1" dist/portugal-liquid-opportunities/index.html
```

Should output something like:
```html
<h1 class="text-3xl font-bold">Portugal Liquid Opportunities</h1>
```

### 3. Check sitemap:
```bash
grep -c "movingto.com/" dist/sitemap.xml
```

Should show a number (e.g., 50+ for all pages)

## Common Issues & Fixes

### Issue: "Fund pages have no H1 tags"

**Cause**: SSR rendering failed for fund components

**Fix**:
1. Check that `src/data/mock/funds/index.ts` exports all funds
2. Verify `useRealTimeFunds` hook returns data immediately in SSR
3. Look for errors in build logs

### Issue: "❌ NOT FOUND" for fund pages

**Cause**: Route not generated or file write failed

**Fix**:
1. Check `src/ssg/routeDiscovery.ts` includes fund routes
2. Verify disk space available
3. Check file permissions in `/dist` directory

### Issue: "Short HTML content" warning

**Cause**: Component failed to render or lazy loading issue

**Fix**:
1. Check component imports are not lazy-loaded
2. Verify all data dependencies are available in SSR
3. Look for React hooks that require window/document

## Architecture Overview

```
Build Process Flow:
1. vite build              → Bundles JS/CSS
2. ssg-runner.ts          → Runs SSG generation
3. ssg-orchestrator.ts    → Coordinates route processing
4. route-processor.ts     → Renders each route
5. ssrRenderer.ts         → Server-side React rendering
6. verify-ssg-build.js    → Validates output

Key Files:
- src/hooks/useRealTimeFunds.ts   # SSR-aware data hook
- src/pages/FundDetails.tsx        # Fund detail page component
- src/integrations/supabase/client.ts # SSR-safe Supabase client
```

## SSR Detection Pattern

All SSR-aware code uses this pattern:

```typescript
const isSSR = typeof window === 'undefined';

if (isSSR) {
  // Use static data, no async operations
  return staticData;
}

// Client-side: can use async, hooks, etc.
```

## Testing After Deployment

### 1. Test with curl (no JavaScript):
```bash
curl https://funds.movingto.com/portugal-liquid-opportunities | grep "<h1"
```

Should show H1 tag in raw HTML (not rendered by JS)

### 2. Test with Google Lighthouse:
- Run SEO audit
- Check for "Document has a valid heading structure"
- Should show H1 detected

### 3. Test with SEO crawler:
```bash
# Any SEO crawler should see H1 tags
# Before fix: ❌ "Missing H1"
# After fix:  ✅ "H1 found"
```

## Production Checklist

Before deploying:
- [ ] Build completes without errors
- [ ] Verification shows "✅ SSG BUILD VERIFIED"
- [ ] Sample fund pages have H1 tags
- [ ] Sitemap includes all fund URLs
- [ ] robots.txt exists
- [ ] Manual curl test shows H1 in HTML

After deploying:
- [ ] Test live URL with curl
- [ ] Run Google Lighthouse SEO audit
- [ ] Verify AI crawlers can see content
- [ ] Check search console for indexing
