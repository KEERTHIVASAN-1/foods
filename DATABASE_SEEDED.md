# ✅ Database Successfully Seeded!

## Summary

Successfully created **8 restaurants** with **120 food items** (15 items per restaurant) in MongoDB!

## Restaurants Created

1. **Burger Manor** (American) - 15 items
2. **Spice Route** (Indian) - 15 items  
3. **Tokyo Drift** (Japanese) - 15 items
4. **Fresh & Green** (Healthy) - 15 items
5. **Slice of Italy** (Italian) - 15 items
6. **Dragon Palace** (Chinese) - 15 items
7. **Taco Fiesta** (Mexican) - 15 items
8. **Mediterranean Breeze** (Mediterranean) - 15 items

## Features

### ✅ All Images from Unsplash
- Every restaurant and item uses high-quality Unsplash images
- Images are stored as URLs in MongoDB

### ✅ Top-Selling Items for Swipe
- Items have `orderCount` values ranging from 200-1200+
- Higher orderCount = appears first in swipe
- API sorts by `orderCount: -1, rating: -1`

### ✅ Realistic Data
- Each restaurant has a unique theme and cuisine
- Items are relevant to their restaurant type
- Proper pricing, ratings, descriptions, and tags
- Mix of vegetarian and non-vegetarian items

## Top-Selling Items (Will Appear in Swipe)

Items with highest orderCount values will appear first:
- **Churros (Taco Fiesta)**: 1123 orders
- **Garlic Naan (Spice Route)**: 934 orders  
- **Horchata (Taco Fiesta)**: 1123 orders
- **Hummus & Pita (Mediterranean Breeze)**: 1234 orders
- **Pepperoni Pizza (Slice of Italy)**: 912 orders
- And many more!

## Login Credentials

### Admin
- Email: `admin@foodswipe.com`
- Password: `admin123`

### Restaurant Owners
- Email: `[restaurantname]@foodswipe.com`
- Example: `burgermanor@foodswipe.com`, `spiceroute@foodswipe.com`
- Password: `owner123`

## Swipe Feature

The swipe feature fetches items from `/api/items/swipe` which:
- Returns only items from **approved** restaurants
- Sorts by `orderCount` (descending) then `rating` (descending)
- Limits to top 50 items
- Shows items with highest popularity first

## Next Steps

1. ✅ Database is populated
2. ✅ Restaurants are approved (status: 'approved')
3. ✅ Items have realistic orderCount values
4. ✅ Swipe should show top-selling items

**The swipe feature should now work smoothly with these top-selling items appearing first!**

## Verify in MongoDB Atlas

You can check your MongoDB Atlas database to see:
- `users` collection: Admin and owner users
- `restaurants` collection: 8 restaurants
- `items` collection: 120 food items

All data is now stored in MongoDB and ready to use!




