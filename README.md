# Advanced Rating Application

A production-ready rating platform with JWT authentication, rate limiting, REST API, and analytics dashboard.

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Frontend**: React + Vite + Chart.js
- **Security**: bcryptjs, JWT, express-rate-limit, helmet, cors

## Project Structure

```
rating/
├── server.js              # Main Express server
├── package.json         # Backend dependencies
├── config/
│   ├── db.js          # Supabase configuration
│   └── auth.js       # JWT configuration
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   └── rateLimiter.js      # Rate limiting
├── models/
│   ├── adminModel.js
│   ├── ratingModel.js
│   └── categoryModel.js
├── controllers/
│   ├── adminController.js
│   ├── ratingController.js
│   └── analyticsController.js
├── routes/
│   ├── adminRoutes.js
│   ├── ratingRoutes.js
│   └── apiRoutes.js
├── services/
│   └── analyticsService.js
├── frontend/           # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Rating.jsx
│   │   │   └── Categories.jsx
│   │   └── api/client.js
│   └── vite.config.js
├── supabase-schema.sql  # Database schema
└── .env.example       # Environment template
```

## Setup Instructions

### 1. Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Get your Supabase URL and Anon Key from Settings → API

### 2. Backend Setup

```bash
cd rating

# Copy environment file
copy .env.example .env

# Edit .env with your credentials:
# SUPABASE_URL=your-supabase-url
# SUPABASE_ANON_KEY=your-anon-key
# JWT_SECRET=your-secret-key

# Install dependencies
npm install
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

### 4. Create Admin Account

Start the backend server and create an admin:

```bash
npm start
# Then make a POST request to create admin
curl -X POST http://localhost:3000/api/v1/admin/create \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"yourpassword\"}"
```

### 5. Running the Application

**Backend:**
```bash
npm start
# Server runs on http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/admin/logout` - Admin logout
- `GET /api/v1/admin/verify` - Verify token

### Ratings
- `POST /api/v1/rating` - Submit rating (rate limited: 5/min)
- `GET /api/v1/rating` - Get all ratings
- `GET /api/v1/rating/recent` - Get recent ratings

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (auth required)
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Analytics (Auth Required)
- `GET /api/v1/dashboard` - Get full dashboard data
- `GET /api/v1/overview` - Get overview stats
- `GET /api/v1/analytics` - Get category analytics
- `GET /api/v1/activity` - Get recent activity

## Rate Limiting

- **Rating submissions**: 5 requests per IP per minute
- **General API**: 100 requests per IP per minute

## Security Features

- JWT tokens (HTTP-only cookies)
- bcrypt password hashing
- Input validation (Joi)
- Helmet security headers
- CORS configuration
- SQL injection protection (via Supabase)

## License

MIT