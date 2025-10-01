#!/usr/bin/env tsx

/**
 * Test script to verify sitemap generation
 * Run with: npx tsx scripts/test-sitemap-generation.ts
 */

import { funds } from '../src/data/services/funds-service';
import { getAllComparisonSlugs } from '../src/data/services/comparison-service';
import { getAllCategories } from '../src/data/services/categories-service';
import { getAllTags } from '../src/data/services/tags-service';
import { getAllFundManagers } from '../src/data/services/managers-service';

console.log('🧪 Testing Sitemap Generation Prerequisites\n');

// Test 1: Funds availability
console.log('📊 Test 1: Funds Data');
console.log(`   Funds loaded: ${funds.length}`);
console.log(`   Expected: 28 funds`);
console.log(`   Status: ${funds.length === 28 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: Comparison slugs
console.log('📊 Test 2: Comparison Slugs');
const comparisonSlugs = getAllComparisonSlugs();
const expectedComparisons = (28 * 27) / 2; // 378
console.log(`   Comparison slugs: ${comparisonSlugs.length}`);
console.log(`   Expected: ${expectedComparisons}`);
console.log(`   Status: ${comparisonSlugs.length === expectedComparisons ? '✅ PASS' : '❌ FAIL'}`);

if (comparisonSlugs.length > 0) {
  console.log(`   Sample slugs:`);
  console.log(`     - ${comparisonSlugs[0]}`);
  console.log(`     - ${comparisonSlugs[Math.floor(comparisonSlugs.length / 2)]}`);
  console.log(`     - ${comparisonSlugs[comparisonSlugs.length - 1]}\n`);
}

// Test 3: Categories
console.log('📊 Test 3: Categories');
const categories = getAllCategories();
console.log(`   Categories: ${categories.length}`);
console.log(`   Status: ${categories.length > 0 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: Tags
console.log('📊 Test 4: Tags');
const tags = getAllTags();
console.log(`   Tags: ${tags.length}`);
console.log(`   Status: ${tags.length > 0 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: Managers
console.log('📊 Test 5: Fund Managers');
const managers = getAllFundManagers();
console.log(`   Managers: ${managers.length}`);
console.log(`   Status: ${managers.length > 0 ? '✅ PASS' : '❌ FAIL'}\n`);

// Calculate expected total URLs
const staticPages = 13; // Homepage + hubs + static pages
const fundPages = funds.length * 2; // Fund details + alternatives
const categoryPages = categories.length;
const tagPages = tags.length;
const managerPages = managers.length;
const comparisonPages = comparisonSlugs.length;

const totalExpected = staticPages + fundPages + categoryPages + tagPages + managerPages + comparisonPages;

console.log('📈 Expected Sitemap Coverage:');
console.log(`   Static pages: ${staticPages}`);
console.log(`   Fund pages: ${fundPages} (${funds.length} × 2)`);
console.log(`   Category pages: ${categoryPages}`);
console.log(`   Tag pages: ${tagPages}`);
console.log(`   Manager pages: ${managerPages}`);
console.log(`   Comparison pages: ${comparisonPages}`);
console.log(`   ───────────────────────────`);
console.log(`   TOTAL EXPECTED: ${totalExpected} URLs\n`);

// Final summary
const allTestsPassed = 
  funds.length === 28 &&
  comparisonSlugs.length === expectedComparisons &&
  categories.length > 0 &&
  tags.length > 0 &&
  managers.length > 0;

console.log('🎯 Final Summary:');
console.log(`   All tests: ${allTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
console.log(`   Expected sitemap URLs: ${totalExpected}`);

if (!allTestsPassed) {
  console.error('\n❌ Sitemap generation will fail or produce incomplete results!');
  process.exit(1);
} else {
  console.log('\n✅ All prerequisites met for comprehensive sitemap generation!');
}
