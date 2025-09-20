# Development Database Setup Guide

## Overview
This project now supports automatic environment detection to use separate databases for development and production.

## Environment Detection
The system automatically detects the environment based on hostname:

### Development Environment (uses funds_develop database)
- `localhost` - Local development
- `*.vercel.app` - Vercel preview deployments
- URLs containing `preview`, `staging`, or `dev`

### Production Environment (uses production database)
- `funds.movingto.com` - Production domain
- Any other domain not matching development patterns

## Setup Instructions

### 1. Create Development Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project called `funds_develop`
3. Note down the project credentials:
   - Project URL: `https://YOUR_PROJECT_ID.supabase.co`
   - Anon Key: `eyJ...` (from Settings > API)

### 2. Update Development Configuration
1. Open `src/lib/supabase-config.ts`
2. Replace the development configuration:
   ```typescript
   development: {
     url: "https://YOUR_DEV_PROJECT_ID.supabase.co",
     anonKey: "YOUR_DEV_ANON_KEY"
   }
   ```

### 3. Setup Development Database Schema
Run the same migrations on your development database to ensure schema consistency:

1. Go to your development project's SQL Editor
2. Run all existing migrations from the production database
3. Or use Supabase CLI to sync schemas

### 4. Configure Edge Functions (Optional)
If using Edge Functions with development database:
1. Update `supabase/config.toml` if needed
2. Deploy Edge Functions to development project

## Verification
- **Development**: Console will show "🔌 Connected to development database"
- **Production**: Console will show "🔌 Connected to production database"
- **Warning**: If dev credentials not configured, falls back to production with warning

## Benefits
- ✅ Automatic environment detection
- ✅ No manual environment variable management
- ✅ Safe preview deployments using development data
- ✅ Production data protection
- ✅ Easy local development setup

## Troubleshooting
If you see warnings about missing development credentials:
1. Ensure you've created the development Supabase project
2. Update `src/lib/supabase-config.ts` with correct credentials
3. Verify the development database has the same schema as production