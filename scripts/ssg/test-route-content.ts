import fs from 'fs';
import path from 'path';

/**
 * Regression tests for SSG route content validation
 * Ensures category/tag pages render their correct content, not homepage
 */

interface RouteTest {
  path: string;
  expectedH1Contains: string;
  expectedContent?: string[];
  notExpectedContent?: string[];
  shouldExist?: boolean;
}

const routeTests: RouteTest[] = [
  // Category pages - must contain category name in H1, not homepage content
  { 
    path: 'categories/mixed/index.html', 
    expectedH1Contains: 'Mixed',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  { 
    path: 'categories/venture-capital/index.html', 
    expectedH1Contains: 'Venture Capital',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  { 
    path: 'categories/private-equity/index.html', 
    expectedH1Contains: 'Private Equity',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  { 
    path: 'categories/real-estate/index.html', 
    expectedH1Contains: 'Real Estate',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  
  // Tag pages - must contain tag name in H1
  { 
    path: 'tags/esg/index.html', 
    expectedH1Contains: 'ESG',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  { 
    path: 'tags/tech/index.html', 
    expectedH1Contains: 'Tech',
    notExpectedContent: ['Compare Golden Visa Investment Funds'],
    shouldExist: true
  },
  
  // Homepage should have its proper H1
  { 
    path: 'index.html', 
    expectedH1Contains: 'Golden Visa',
    notExpectedContent: ['404', 'Page not found'],
    shouldExist: true
  },
  
  // Invalid tag should NOT exist (or show 404 content)
  { 
    path: 'tags/portugal/index.html', 
    expectedH1Contains: '',
    shouldExist: false
  }
];

function extractH1Content(html: string): string | null {
  // Match H1 with any attributes and extract inner content
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match) return null;
  
  // Strip HTML tags from inner content
  return h1Match[1].replace(/<[^>]+>/g, '').trim();
}

export function testRouteContent(): boolean {
  console.log('\n🧪 Testing SSG route content...\n');
  
  const distDir = path.join(process.cwd(), 'dist');
  let failures = 0;
  let passes = 0;
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run build first.');
    return false;
  }
  
  routeTests.forEach(test => {
    const filePath = path.join(distDir, test.path);
    const exists = fs.existsSync(filePath);
    
    // Check if file should exist
    if (test.shouldExist === false) {
      if (exists) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // If file exists for an invalid route, it should show 404 content
        if (content.includes('404') || content.includes('Not Found') || content.includes('Page not found')) {
          console.log(`✅ ${test.path}: Correctly shows 404 content`);
          passes++;
        } else {
          console.error(`❌ ${test.path}: Invalid route exists but doesn't show 404`);
          failures++;
        }
      } else {
        console.log(`✅ ${test.path}: Correctly does not exist`);
        passes++;
      }
      return;
    }
    
    if (!exists) {
      console.error(`❌ ${test.path}: File not found`);
      failures++;
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check H1 contains expected text
    const h1Content = extractH1Content(content);
    if (!h1Content) {
      console.error(`❌ ${test.path}: No H1 tag found`);
      failures++;
    } else if (test.expectedH1Contains && !h1Content.toLowerCase().includes(test.expectedH1Contains.toLowerCase())) {
      console.error(`❌ ${test.path}: H1 "${h1Content.substring(0, 60)}..." does not contain "${test.expectedH1Contains}"`);
      failures++;
    } else {
      console.log(`✅ ${test.path}: H1 contains "${test.expectedH1Contains}" ✓`);
      passes++;
    }
    
    // Check expected content exists
    test.expectedContent?.forEach(expected => {
      if (!content.toLowerCase().includes(expected.toLowerCase())) {
        console.error(`❌ ${test.path}: Missing expected content "${expected}"`);
        failures++;
      }
    });
    
    // Check unwanted content doesn't exist (e.g., homepage content on category pages)
    test.notExpectedContent?.forEach(notExpected => {
      if (content.includes(notExpected)) {
        console.error(`❌ ${test.path}: Contains unwanted homepage content - route likely falling back incorrectly`);
        failures++;
      }
    });
  });
  
  // Additional structural checks for category pages
  console.log('\n🔍 Checking category page structure...');
  
  const categoryDirs = ['mixed', 'venture-capital', 'private-equity', 'real-estate'];
  categoryDirs.forEach(category => {
    const categoryPath = path.join(distDir, 'categories', category, 'index.html');
    if (fs.existsSync(categoryPath)) {
      const content = fs.readFileSync(categoryPath, 'utf-8');
      
      // Check for fund count or empty state
      const hasFundCount = content.includes('fund') || content.includes('Fund');
      const hasBreadcrumb = content.includes('breadcrumb') || content.includes('Home');
      
      if (hasFundCount) {
        console.log(`✅ categories/${category}: Contains fund references`);
        passes++;
      } else {
        console.warn(`⚠️  categories/${category}: No fund references found (may be empty category)`);
      }
      
      if (hasBreadcrumb) {
        console.log(`✅ categories/${category}: Has breadcrumb navigation`);
        passes++;
      }
    }
  });
  
  console.log(`\n📊 Results: ${passes} passed, ${failures} failed\n`);
  
  if (failures > 0) {
    console.error(`❌ Route content tests failed with ${failures} errors`);
    return false;
  } else {
    console.log('✅ All route content tests passed!\n');
    return true;
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = testRouteContent();
  process.exit(success ? 0 : 1);
}
