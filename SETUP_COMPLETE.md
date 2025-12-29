# ✅ Setup Complete!

## What Was Done

### 1. ✅ Concurrent Development Server
- Added `concurrently` package to run both frontend and backend together
- Updated `package.json` with new scripts:
  - `npm run dev` - Runs both frontend and backend concurrently
  - `npm run dev:client` - Runs frontend only
  - `npm run dev:server` - Runs backend only

### 2. ✅ Separate Login/Signup Forms

#### User Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 chars)
- **Phone Number** (optional)
- **Delivery Address** (optional)

#### Restaurant Owner Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 chars)
- **Restaurant Name** (required)
- **Restaurant Address** (required)
- **Cuisine Type** (required, e.g., Italian, Indian, Chinese)
- **Restaurant Description** (required)
- **Opening Hours** (optional, default: "10:00 AM - 10:00 PM")
- **Delivery Time** (optional, default: "30-40 min")

**Note:** Restaurant owners need admin approval before their restaurant appears in the app.

#### Admin Registration
- **Name** (required)
- **Email** (required)
- **Password** (required, min 6 chars)
- **Admin Code** (required: `ADMIN2025`)

### 3. ✅ Backend Updates
- Updated User model to include `phone` and `address` fields
- Enhanced registration route to handle role-specific fields
- Added admin code validation (`ADMIN2025`)
- Improved error handling and validation

### 4. ✅ Frontend Updates
- Completely redesigned Auth page with role selection
- Separate form sections for each role type
- Visual role indicators (User, Owner, Admin)
- Role-specific field validation
- Improved UI/UX with better visual feedback

## How to Use

### Start Both Servers
```bash
npm run dev
```

This will start:
- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000` (or Vite's assigned port)

### Start Separately
```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

## Registration Flow

1. **Click "Sign Up"** on the auth page
2. **Select your role** (User, Restaurant Owner, or Admin)
3. **Fill in the required fields** for your selected role
4. **Submit** to create your account

## Login Flow

1. Enter your **email** and **password**
2. Click **Sign In**
3. You'll be redirected to the main app based on your role

## Default Credentials (after seeding)

If you've seeded the database:
```bash
cd server
npm run seed
```

### Admin
- Email: `admin@foodswipe.com`
- Password: `admin123`

### Restaurant Owner
- Email: `burgermanor@foodswipe.com`
- Password: `owner123`

### User
- Register a new account from the auth page

## Features by Role

### User
- Browse approved restaurants
- Swipe through food items
- Add items to cart
- Save favorites
- Place orders

### Restaurant Owner
- Manage menu items (add, edit, delete)
- View restaurant items
- Wait for admin approval (restaurant starts as "pending")
- All items must use Unsplash image URLs

### Admin
- Approve/reject restaurants
- View all restaurants with status badges
- Manage menu items (can edit/delete any item)
- Delete restaurants (cascades to items)

## Technical Details

### Role Selection UI
- Visual cards with icons for each role
- Color-coded (User: Blue, Owner: Orange, Admin: Purple)
- Conditional form fields based on selection

### Backend Validation
- Email uniqueness check
- Password minimum length (6 characters)
- Admin code validation (`ADMIN2025`)
- Restaurant details validation for owners

### Data Flow
1. User selects role and fills form
2. Frontend sends registration data to `/api/auth/register`
3. Backend validates and creates user
4. If owner, creates restaurant with "pending" status
5. Returns JWT token and user data
6. Frontend stores token and redirects

## Next Steps

1. Start the servers: `npm run dev`
2. Visit the frontend URL (usually `http://localhost:3000`)
3. Register a new account or login with seeded credentials
4. Explore the app based on your role!

---

**🎉 Everything is ready to go! Just run `npm run dev` and start developing!**






