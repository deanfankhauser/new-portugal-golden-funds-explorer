
# Testing Guide for Reverse Proxy Setup

## Local Testing

Before deploying to production, test locally:

```bash
# Install dependencies
npm install

# Start development server with new base path
npm run dev

# The app should now work at http://localhost:8080/funds/
```

## Production Testing Checklist

### Core Functionality
- [ ] Homepage loads at `/funds/`
- [ ] All internal navigation works
- [ ] Fund detail pages load correctly
- [ ] Search and filtering functions
- [ ] Comparison tool works
- [ ] Quiz functionality intact

### Asset Loading
- [ ] CSS files load correctly
- [ ] JavaScript bundles load
- [ ] Images and icons display
- [ ] Favicon appears

### SEO & Redirects
- [ ] 301 redirects from old URLs work
- [ ] Meta tags render correctly
- [ ] Structured data validates
- [ ] Canonical URLs point to new domain

### Performance
- [ ] Page load times acceptable
- [ ] No console errors
- [ ] Mobile responsiveness maintained

## Manual Test Scripts

```bash
# Test homepage
curl -I https://movingto.com/funds/

# Test fund detail page
curl -I https://movingto.com/funds/funds/1

# Test category page
curl -I https://movingto.com/funds/categories/real-estate

# Test redirect from old domain
curl -I https://funds.movingto.io/

# Test assets
curl -I https://movingto.com/funds/assets/index.css
```

## Automated Testing

Consider adding these tests to your CI/CD:

```javascript
// Example test cases
describe('Reverse Proxy Routes', () => {
  test('Homepage loads at /funds/', async () => {
    const response = await fetch('https://movingto.com/funds/')
    expect(response.status).toBe(200)
  })
  
  test('Old domain redirects correctly', async () => {
    const response = await fetch('https://funds.movingto.io/', {
      redirect: 'manual'
    })
    expect(response.status).toBe(301)
    expect(response.headers.get('location')).toBe('https://movingto.com/funds/')
  })
})
```
