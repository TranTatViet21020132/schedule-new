# Database Setup Guide

This project uses Supabase for persistent data storage, making it easy to deploy on Vercel.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier available)
2. Create a new project
3. Wait for the project to be provisioned

### 2. Create the Database Table

In your Supabase project dashboard:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query** and paste this SQL:

```sql
CREATE TABLE segment_collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Timeline',
  segments JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_segment_collections_created_at ON segment_collections(created_at);
```

3. Click **Run** to create the table

### 3. Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy your:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Service Role Key` → `SUPABASE_SERVICE_KEY` (keep this secret!)
   - `Anon Public Key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Add Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

### 5. Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add the environment variables in **Settings** → **Environment Variables**
5. Click **Deploy**

## How It Works

- **LocalStorage**: Segments are cached in the browser for instant loading
- **Database**: Changes are automatically synced to Supabase when you save
- **Sync**: On page load, it tries to load from the database; if unavailable, uses localStorage

## Features

- ✅ Auto-save to database
- ✅ Export/Import JSON for backups
- ✅ Works offline (with localStorage fallback)
- ✅ Vercel-ready deployment
- ✅ Free tier supported

## Troubleshooting

If you see "API Error" when saving:
1. Check that environment variables are correctly set
2. Ensure Supabase project is running
3. Check browser console for error details
4. Segments will fall back to localStorage
