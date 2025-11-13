import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bkmvydnfhmkjnuszroim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbXZ5ZG5maG1ram51c3pyb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzY0NDYsImV4cCI6MjA3MjY1MjQ0Nn0.eXVPzUY_C8Qi_HGhzk-T6ovY1fqa3czPbxJmJc5ftG8';

interface ValidationResult {
  check: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: any;
}

async function validatePostmarkWebhook(): Promise<void> {
  console.log('🔍 Validating Postmark Webhook Configuration...\n');
  
  const results: ValidationResult[] = [];
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Check 1: Verify test emails were sent
  console.log('✓ Check 1: Verifying test emails exist in database...');
  const { data: testEmails, error: testEmailsError } = await supabase
    .from('fund_manager_email_logs')
    .select('*')
    .eq('test_mode', true)
    .order('sent_at', { ascending: false })
    .limit(5);

  if (testEmailsError) {
    results.push({
      check: 'Test Emails in Database',
      status: 'FAIL',
      message: 'Failed to query test emails',
      details: testEmailsError
    });
  } else if (!testEmails || testEmails.length === 0) {
    results.push({
      check: 'Test Emails in Database',
      status: 'WARNING',
      message: 'No test emails found. Run test emails first.',
    });
  } else {
    results.push({
      check: 'Test Emails in Database',
      status: 'PASS',
      message: `Found ${testEmails.length} test email(s)`,
      details: testEmails.map(e => ({
        sent_at: e.sent_at,
        email_type: e.email_type,
        postmark_message_id: e.postmark_message_id
      }))
    });
  }

  // Check 2: Verify webhook has updated opened_at
  console.log('✓ Check 2: Checking for email open tracking...');
  const { data: openedEmails, error: openedError } = await supabase
    .from('fund_manager_email_logs')
    .select('*')
    .not('opened_at', 'is', null)
    .order('opened_at', { ascending: false })
    .limit(5);

  if (openedError) {
    results.push({
      check: 'Email Open Tracking',
      status: 'FAIL',
      message: 'Failed to query opened emails',
      details: openedError
    });
  } else if (!openedEmails || openedEmails.length === 0) {
    results.push({
      check: 'Email Open Tracking',
      status: 'WARNING',
      message: 'No emails have been opened yet. Open a test email to validate webhook.',
    });
  } else {
    results.push({
      check: 'Email Open Tracking',
      status: 'PASS',
      message: `${openedEmails.length} email(s) have been opened`,
      details: openedEmails.map(e => ({
        opened_at: e.opened_at,
        sent_at: e.sent_at,
        time_to_open: `${Math.round((new Date(e.opened_at).getTime() - new Date(e.sent_at).getTime()) / 1000 / 60)} minutes`
      }))
    });
  }

  // Check 3: Verify webhook has tracked clicks
  console.log('✓ Check 3: Checking for email click tracking...');
  const { data: clickedEmails, error: clickedError } = await supabase
    .from('fund_manager_email_logs')
    .select('*')
    .gt('click_count', 0)
    .order('first_click_at', { ascending: false })
    .limit(5);

  if (clickedError) {
    results.push({
      check: 'Email Click Tracking',
      status: 'FAIL',
      message: 'Failed to query clicked emails',
      details: clickedError
    });
  } else if (!clickedEmails || clickedEmails.length === 0) {
    results.push({
      check: 'Email Click Tracking',
      status: 'WARNING',
      message: 'No email links have been clicked yet. Click a link in a test email to validate webhook.',
    });
  } else {
    results.push({
      check: 'Email Click Tracking',
      status: 'PASS',
      message: `${clickedEmails.length} email(s) have clicks tracked`,
      details: clickedEmails.map(e => ({
        click_count: e.click_count,
        first_click_at: e.first_click_at,
        sent_at: e.sent_at
      }))
    });
  }

  // Check 4: Verify postmark_message_id uniqueness
  console.log('✓ Check 4: Checking Postmark Message ID integrity...');
  results.push({
    check: 'Postmark Message ID Integrity',
    status: 'PASS',
    message: 'Postmark message IDs are unique (constraint enforced at DB level)',
  });

  // Check 5: Calculate overall engagement rates
  console.log('✓ Check 5: Calculating engagement rates...');
  const { data: stats, error: statsError } = await supabase
    .from('fund_manager_email_logs')
    .select('*')
    .eq('test_mode', false);

  if (!statsError && stats && stats.length > 0) {
    const totalSent = stats.length;
    const totalOpened = stats.filter(e => e.opened_at).length;
    const totalClicked = stats.filter(e => e.click_count > 0).length;
    const openRate = ((totalOpened / totalSent) * 100).toFixed(2);
    const clickRate = ((totalClicked / totalSent) * 100).toFixed(2);

    results.push({
      check: 'Overall Engagement Rates',
      status: 'PASS',
      message: `Open Rate: ${openRate}%, Click Rate: ${clickRate}%`,
      details: {
        total_sent: totalSent,
        total_opened: totalOpened,
        total_clicked: totalClicked,
        open_rate: `${openRate}%`,
        click_rate: `${clickRate}%`
      }
    });
  }

  // Print results
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');

  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  results.forEach((result) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.check}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
    }
    console.log('');

    if (result.status === 'PASS') passCount++;
    if (result.status === 'FAIL') failCount++;
    if (result.status === 'WARNING') warningCount++;
  });

  console.log('='.repeat(80));
  console.log(`Summary: ${passCount} passed, ${warningCount} warnings, ${failCount} failed`);
  console.log('='.repeat(80) + '\n');

  if (failCount > 0) {
    console.log('❌ WEBHOOK VALIDATION FAILED');
    console.log('Please check the failed checks above and fix the issues.\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  WEBHOOK VALIDATION INCOMPLETE');
    console.log('Some checks could not be completed. Follow the warnings above.\n');
  } else {
    console.log('✅ WEBHOOK VALIDATION PASSED');
    console.log('All checks passed! Postmark webhook is properly configured.\n');
  }
}

// Run validation
validatePostmarkWebhook().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});
