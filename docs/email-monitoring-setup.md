# Email Monitoring System Setup

The email monitoring system is now fully implemented with three components:

## 1. Webhook Validation Script

**Location:** `scripts/validate-postmark-webhook.ts`

**Purpose:** Validates that the Postmark webhook is properly configured and tracking email opens/clicks.

**Setup:**
Add this script to your `package.json`:
```json
"scripts": {
  "validate-webhook": "tsx scripts/validate-postmark-webhook.ts"
}
```

**Usage:**
```bash
npm run validate-webhook
```

**What it checks:**
- ✅ Test emails exist in database
- ✅ Email open tracking is working (opened_at field)
- ✅ Email click tracking is working (click_count field)
- ✅ Postmark Message ID integrity
- ✅ Overall engagement rates

**Expected Output:**
```
🔍 Validating Postmark Webhook Configuration...

✓ Check 1: Verifying test emails exist in database...
✓ Check 2: Checking for email open tracking...
✓ Check 3: Checking for email click tracking...
✓ Check 4: Checking Postmark Message ID integrity...
✓ Check 5: Calculating engagement rates...

================================================================================
VALIDATION RESULTS
================================================================================

✅ Test Emails in Database
   Status: PASS
   Found 2 test email(s)

✅ Email Open Tracking
   Status: PASS
   2 email(s) have been opened

⚠️  Email Click Tracking
   Status: WARNING
   No email links have been clicked yet. Click a link in a test email to validate webhook.

✅ Postmark Message ID Integrity
   Status: PASS
   Postmark message IDs are unique (constraint enforced at DB level)

✅ Overall Engagement Rates
   Status: PASS
   Open Rate: 100.00%, Click Rate: 0.00%

================================================================================
Summary: 4 passed, 1 warnings, 0 failed
================================================================================

⚠️  WEBHOOK VALIDATION INCOMPLETE
Some checks could not be completed. Follow the warnings above.
```

## 2. Admin Dashboard Component

**Location:** `src/components/admin/EmailCampaignMonitoring.tsx`

**Access:** Admin Panel → Email Campaigns tab

**Features:**
- **Summary Cards:**
  - Total Emails Sent (last 30 days)
  - Open Rate (%)
  - Click Rate (%)
  - Engaged Managers count

- **Overview Tab:**
  - Email Type Performance table (Weekly Digest vs Monthly Reminder)
  - Breakdown by sent/opened/clicked counts
  - Open rate and click rate percentages

- **Recent Emails Tab:**
  - Last 50 emails sent
  - Fund name, manager, email type
  - Open/click status indicators
  - Click count per email

- **Manager Engagement Tab:**
  - Top 20 managers by email engagement
  - Total emails, opened, clicked counts
  - Open rate percentage
  - Last activity timestamp
  - Total clicks

## 3. Database RPC Function

**Function:** `get_email_campaign_stats(days INTEGER DEFAULT 30)`

**Purpose:** Efficiently retrieves email campaign statistics from the database.

**Returns:**
- `email_type` (TEXT)
- `total_sent` (BIGINT)
- `total_opened` (BIGINT)
- `total_clicked` (BIGINT)
- `open_rate` (NUMERIC)
- `click_rate` (NUMERIC)
- `avg_clicks_per_email` (NUMERIC)

**Usage in SQL:**
```sql
SELECT * FROM get_email_campaign_stats(30);
```

**Usage in Supabase client:**
```typescript
const { data, error } = await supabase.rpc('get_email_campaign_stats', { days: 30 });
```

## 4. Monitoring Queries

**Location:** `docs/email-monitoring-queries.md`

A collection of 8 SQL queries for comprehensive email campaign analysis:
1. Overall Campaign Stats
2. Daily Performance Trend
3. Top Performing Funds
4. Manager Engagement Leaderboard
5. Verified vs Unverified Comparison
6. Recent Email Activity
7. Time-to-Open Analysis
8. Delivery Errors

These can be run directly in Supabase SQL Editor or used for custom reporting.

## Testing the System

1. **Send test emails:**
   ```bash
   # Test weekly digest
   curl -X POST 'https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/weekly-fund-digest' \
     -H 'Content-Type: application/json' \
     -d '{"test_mode": true, "test_email_override": "your-email@example.com", "test_fund_id": "heed-top-fund"}'

   # Test monthly reminder
   curl -X POST 'https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/monthly-performance-reminder' \
     -H 'Content-Type: application/json' \
     -d '{"test_mode": true, "test_email_override": "your-email@example.com", "test_fund_id": "heed-top-fund"}'
   ```

2. **Open the test emails** in your inbox (Gmail, Outlook, etc.)

3. **Click links** in the emails to trigger click tracking

4. **Run validation script:**
   ```bash
   npm run validate-webhook
   ```

5. **Check Admin Dashboard:**
   - Navigate to Admin Panel
   - Click "Email Campaigns" tab
   - Verify stats appear correctly

## Webhook Configuration

**Postmark Webhook URL:**
```
https://bkmvydnfhmkjnuszroim.supabase.co/functions/v1/postmark-webhook
```

**Events to track:**
- ✅ Open
- ✅ Click

**Configuration Location:**
Postmark Dashboard → Servers → [Your Server] → Webhooks → Add Webhook

## Production Rollout Checklist

- [ ] Webhook validation passes all checks
- [ ] Admin dashboard displays data correctly
- [ ] Cron jobs scheduled (Monday 9 AM UTC, 1st of month 10 AM UTC)
- [ ] Test emails sent to 3-5 funds (Week 1)
- [ ] Expand to 10 funds (Week 2)
- [ ] Enable for 50% of funds (Week 3)
- [ ] Full rollout (Week 4)
- [ ] Monitor engagement metrics weekly
- [ ] Review manager feedback

## Troubleshooting

**Webhook not receiving events:**
1. Check Postmark webhook URL is correct
2. Verify webhook is enabled in Postmark
3. Check edge function logs: `https://supabase.com/dashboard/project/bkmvydnfhmkjnuszroim/functions/postmark-webhook/logs`
4. Ensure `verify_jwt = false` in supabase/config.toml for postmark-webhook

**Dashboard not loading data:**
1. Check browser console for errors
2. Verify RPC function exists: Run `SELECT * FROM get_email_campaign_stats(30);` in SQL Editor
3. Check fund_manager_email_logs table has data with `test_mode = false`

**Email opens/clicks not tracked:**
1. Wait 5-10 minutes after opening email (Postmark processes events async)
2. Run validation script to check tracking status
3. Check Postmark activity logs
4. Verify webhook endpoint is accessible
