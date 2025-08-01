# Visual Marketer Portfolio

A modern portfolio website for visual marketers with admin panel and content management system.

## Features

- **Frontend**: React with Vite
- **Backend**: Supabase (PostgreSQL database)
- **Admin Panel**: Full CRUD operations for content management
- **Authentication**: Secure admin login
- **Content Management**: Videos and recent works management
- **Responsive Design**: Mobile-friendly interface

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/create_portfolio_schema.sql`

This will create:
- `videos` table for video section management
- `recent_works` table for portfolio items
- Sample data for testing
- Row Level Security policies

### 4. Admin User Setup

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email and password
3. This user will have admin access to the panel

### 5. Run the Application

```bash
npm run dev
```

## Admin Panel Access

The admin panel can be accessed at: `/admin-panel-access-2024`

**Features:**
- Secure login with email/password
- Manage videos for the video section
- Manage recent works (posters, videos, t-shirts)
- CRUD operations (Create, Read, Update, Delete)
- Order management for content display
- Active/inactive status control

## Database Schema

### Videos Table
- `id`: UUID primary key
- `title`: Video title
- `description`: Video description
- `video_url`: Path to video file
- `thumbnail_url`: Optional thumbnail image
- `is_active`: Show/hide video
- `order_index`: Display order
- `created_at`, `updated_at`: Timestamps

### Recent Works Table
- `id`: UUID primary key
- `title`: Work title
- `description`: Work description
- `image_url`: Path to image/video file
- `category`: 'poster', 'video', or 'tshirt'
- `price`: Optional price display
- `is_active`: Show/hide work
- `order_index`: Display order
- `created_at`, `updated_at`: Timestamps

## Content Management

### Adding Videos
1. Login to admin panel
2. Go to Videos tab
3. Click "Add New Video"
4. Fill in title, description, video URL
5. Set order and active status

### Adding Recent Works
1. Login to admin panel
2. Go to Recent Works tab
3. Click "Add New Work"
4. Fill in details and select category
5. Set order and active status

## File Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Supabase client and services
├── styles/             # CSS files
└── utils/              # Utility functions

supabase/
└── migrations/         # Database migration files
```

## Security

- Row Level Security (RLS) enabled on all tables
- Public read access for active content
- Authenticated access required for admin operations
- Secure admin panel with authentication

## Deployment

1. Build the project: `npm run build`
2. Deploy to your preferred hosting platform
3. Set environment variables in your hosting platform
4. Ensure Supabase project is properly configured

## Support

For issues or questions, please check the documentation or create an issue in the repository.#   b a c k e n d a v i d  
 