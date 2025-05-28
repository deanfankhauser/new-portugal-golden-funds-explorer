
# Deployment Guide for Reverse Proxy Setup

## Pre-deployment Checklist

- [ ] Backup current nginx/apache configuration
- [ ] Test the application locally with new base path
- [ ] Prepare SSL certificates for both domains
- [ ] Plan maintenance window for DNS changes

## Step-by-Step Deployment

### 1. Build and Deploy Updated Application

```bash
# Build with new base path
npm run build

# Deploy the built files to your hosting service
# The app will now expect to be served from /funds/ path
```

### 2. Configure Web Server

Choose your web server configuration from the provided files:
- `nginx-config.md` for Nginx
- `apache-config.md` for Apache
- `cloudflare-worker.js` for Cloudflare Workers

### 3. Test the Configuration

```bash
# Test server configuration
nginx -t  # for Nginx
apache2ctl configtest  # for Apache

# Test the reverse proxy
curl -I https://movingto.com/funds/
curl -I https://movingto.com/funds/about

# Test redirects from old subdomain
curl -I https://funds.movingto.io/
```

### 4. Validate All Routes

Test these critical paths:
- `https://movingto.com/funds/` (homepage)
- `https://movingto.com/funds/funds/1` (fund details)
- `https://movingto.com/funds/categories/real-estate` (category pages)
- `https://movingto.com/funds/compare` (comparison tool)

### 5. SEO Considerations

- [ ] Update Google Search Console with new property
- [ ] Submit updated sitemap with new URLs
- [ ] Monitor 301 redirects in analytics
- [ ] Update any external links to use new URLs

## Rollback Plan

If issues occur:
1. Revert web server configuration
2. Remove `basename="/funds"` from App.tsx
3. Remove `base: '/funds/'` from vite.config.ts
4. Rebuild and redeploy

## Monitoring

After deployment, monitor:
- Server error logs
- 404 errors for missing assets
- Redirect chain performance
- SEO ranking impacts
