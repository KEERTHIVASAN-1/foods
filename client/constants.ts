import { FoodItem, Restaurant } from './types';

export const MOCK_FOODS: FoodItem[] = [
  {
    id: '4',
    name: 'Butter Chicken Bowl',
    restaurant: 'Spice Route',
    price: 16.50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    description: 'Rich and creamy tomato curry with tender chicken pieces, served with basmati rice.',
    tags: ['Indian', 'Curry', 'Spicy'],
    isVeg: false,
    calories: 700,
    preparationTime: '30 min',
    available: true
  },
  {
    id: '1',
    name: 'Truffle Mushroom Burger',
    restaurant: 'Burger Manor',
    price: 14.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Juicy beef patty topped with truffle oil, swiss cheese, and sautéed mushrooms.',
    tags: ['Burger', 'Gourmet'],
    isVeg: false,
    calories: 850,
    preparationTime: '20 min',
    available: true
  },
  {
    id: '5',
    name: 'Acai Superfood Bowl',
    restaurant: 'Fresh & Green',
    price: 12.00,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    description: 'Organic acai blend topped with granola, banana, strawberries, and honey.',
    tags: ['Healthy', 'Breakfast', 'Vegan'],
    isVeg: true,
    calories: 350,
    preparationTime: '10 min',
    available: true
  },
  {
    id: '6',
    name: 'Avocado Toast Deluxe',
    restaurant: 'Brunch Club',
    price: 10.50,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
    description: 'Sourdough bread topped with smashed avocado, poached egg, chili flakes, and microgreens.',
    tags: ['Breakfast', 'Healthy', 'Veg'],
    isVeg: true,
    calories: 400,
    preparationTime: '15 min',
    available: true
  },
  {
    id: '7',
    name: 'Classic Cheeseburger',
    restaurant: 'Burger Manor',
    price: 11.99,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    description: 'Double beef patty, cheddar cheese, lettuce, tomato, onions, and house secret sauce.',
    tags: ['Burger', 'American'],
    isVeg: false,
    calories: 900,
    preparationTime: '20 min',
    available: true
  },
  {
    id: '8',
    name: 'Pad Thai Noodles',
    restaurant: 'Thai Spice',
    price: 15.00,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
    description: 'Stir-fried rice noodles with eggs, peanuts, bean sprouts, and tangy tamarind sauce.',
    tags: ['Thai', 'Noodles', 'Spicy'],
    isVeg: false,
    calories: 600,
    preparationTime: '25 min',
    available: true
  },
  {
    id: '9',
    name: 'Chocolate Lava Cake',
    restaurant: 'Sweet Tooth',
    price: 8.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    description: 'Warm chocolate cake with a molten center, served with vanilla bean ice cream.',
    tags: ['Dessert', 'Chocolate', 'Veg'],
    isVeg: true,
    calories: 550,
    preparationTime: '20 min',
    available: true
  },
  {
    id: '10',
    name: 'Greek Salad',
    restaurant: 'Mediterranean Delights',
    price: 11.50,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh cucumbers, tomatoes, olives, red onion, and feta cheese with oregano olive oil dressing.',
    tags: ['Healthy', 'Salad', 'Greek'],
    isVeg: true,
    calories: 300,
    preparationTime: '10 min',
    available: true
  },
  {
    id: '11',
    name: 'Crispy Fried Chicken',
    restaurant: 'Cluck Cluck',
    price: 13.50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    description: 'Golden fried chicken bucket with coleslaw and mashed potatoes.',
    tags: ['Chicken', 'American', 'Fast Food'],
    isVeg: false,
    calories: 1100,
    preparationTime: '25 min',
    available: true
  },
  {
    id: '12',
    name: 'Dragon Roll',
    restaurant: 'Tokyo Drift',
    price: 16.00,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=800&q=80',
    description: 'Eel and cucumber topped with thin avocado slices and eel sauce.',
    tags: ['Sushi', 'Japanese', 'Seafood'],
    isVeg: false,
    calories: 500,
    preparationTime: '20 min',
    available: true
  },
  {
    id: '13',
    name: 'Paneer Tikka Masala',
    restaurant: 'Spice Route',
    price: 14.50,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    description: 'Grilled cottage cheese cubes simmered in a spicy onion-tomato gravy.',
    tags: ['Indian', 'Curry', 'Veg'],
    isVeg: true,
    calories: 650,
    preparationTime: '30 min',
    available: true
  },
  {
    id: '14',
    name: 'Berry Smoothie Bowl',
    restaurant: 'Fresh & Green',
    price: 9.50,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    description: 'Mixed berry smoothie topped with chia seeds, coconut flakes, and fresh berries.',
    tags: ['Healthy', 'Breakfast', 'Vegan'],
    isVeg: true,
    calories: 300,
    preparationTime: '10 min',
    available: true
  },
  {
    id: '15',
    name: 'Pepperoni Pizza',
    restaurant: 'Slice of Italy',
    price: 17.00,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    description: 'New York style pizza loaded with crispy pepperoni slices and mozzarella.',
    tags: ['Pizza', 'Italian', 'Fast Food'],
    isVeg: false,
    calories: 1300,
    preparationTime: '25 min',
    available: true
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Manor',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    deliveryTime: '25-30 min',
    offers: '50% OFF',
    description: 'The best gourmet burgers in town, made with fresh, locally sourced ingredients. Our secret sauce is a must-try!',
    address: '123 Burger Lane, Foodie City',
    openingHours: '11:00 AM - 11:00 PM',
    reviews: [
        { id: 'rev1', userName: 'John Doe', rating: 5, comment: 'Amazing burgers! The truffle oil is a game changer.', date: '2 days ago' },
        { id: 'rev2', userName: 'Jane Smith', rating: 4, comment: 'Great food but service was a bit slow.', date: '1 week ago' }
    ]
  },
  {
    id: 'r2',
    name: 'Slice of Italy',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    deliveryTime: '40-50 min',
    offers: 'Free Delivery',
    description: 'Authentic Italian pizzas wood-fired to perfection. Taste the tradition in every slice.',
    address: '456 Pizza Plaza, Little Italy',
    openingHours: '12:00 PM - 10:00 PM',
    reviews: [
        { id: 'rev3', userName: 'Mike Ross', rating: 5, comment: 'Best pizza I have had in years.', date: '3 days ago' },
        { id: 'rev4', userName: 'Rachel Zane', rating: 3, comment: 'Crust was a bit too burnt for my liking.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'r3',
    name: 'Tokyo Drift',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryTime: '30-40 min',
    offers: '10% OFF',
    description: 'Exquisite sushi and Japanese cuisine. Fresh seafood flown in daily.',
    address: '789 Sushi Street, Downtown',
    openingHours: '11:00 AM - 10:00 PM',
    reviews: [
        { id: 'rev5', userName: 'Harvey Specter', rating: 5, comment: 'Impeccable quality. The salmon was fresh.', date: '1 day ago' }
    ]
  },
  {
    id: 'r4',
    name: 'Spice Route',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    deliveryTime: '35-45 min',
    offers: 'Buy 1 Get 1',
    description: 'Spice Route Kitchen – T. Nagar, Chennai – South Indian, Chinese, Arabian – Known for hygienic preparation, fast service, and rich regional flavors',
    address: 'T. Nagar, Chennai',
    openingHours: '12:00 PM - 11:00 PM',
    reviews: [
        { id: 'rev6a', userName: 'Arun K', rating: 4.5, comment: 'Amazing taste and quick delivery', date: '5 days ago' },
        { id: 'rev6b', userName: 'Meena S', rating: 4.0, comment: 'Excellent biryani, will order again', date: '1 week ago' }
    ]
  },
  {
    id: 'r5',
    name: 'Fresh & Green',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    deliveryTime: '15-25 min',
    offers: '20% OFF',
    description: 'Healthy bowls, salads, and smoothies for the health-conscious foodie.',
    address: '555 Green Way, Eco Park',
    openingHours: '08:00 AM - 08:00 PM',
    reviews: [
        { id: 'rev7', userName: 'Louis Litt', rating: 4, comment: 'Very fresh ingredients.', date: '1 week ago' }
    ]
  },
  {
    id: 'r6',
    name: 'Brunch Club',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    deliveryTime: '20-30 min',
    offers: 'Free Coffee',
    description: 'All-day breakfast and brunch favorites. Start your day right!',
    address: '777 Morning Blvd, Sunrise City',
    openingHours: '07:00 AM - 04:00 PM',
    reviews: [
        { id: 'rev8', userName: 'Jessica Pearson', rating: 5, comment: 'The avocado toast is perfect.', date: '2 days ago' }
    ]
  },
  {
    id: 'r7',
    name: 'Thai Spice',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    deliveryTime: '30-45 min',
    offers: '15% OFF',
    description: 'Authentic Thai street food flavors. Spicy, sour, sweet, and savory.',
    address: '999 Pad Thai Rd, Asian District',
    openingHours: '11:00 AM - 10:00 PM',
    reviews: [
        { id: 'rev9', userName: 'Katrina Bennett', rating: 4, comment: 'Great Pad Thai, could be spicier.', date: '3 weeks ago' }
    ]
  },
  {
    id: 'r8',
    name: 'Sweet Tooth',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    deliveryTime: '20-30 min',
    offers: 'Free Cookie',
    description: 'Decadent desserts and pastries to satisfy your cravings.',
    address: '888 Sugar Lane, Sweetville',
    openingHours: '10:00 AM - 10:00 PM',
    reviews: [
        { id: 'rev10', userName: 'Alex Williams', rating: 5, comment: 'The lava cake is heavenly.', date: '1 day ago' }
    ]
  },
  {
    id: 'r9',
    name: 'Mediterranean Delights',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    deliveryTime: '30-40 min',
    offers: '10% OFF',
    description: 'Fresh and healthy Mediterranean cuisine. Hummus, falafel, and more.',
    address: '101 Olive Garden, Greek Town',
    openingHours: '11:00 AM - 09:00 PM',
    reviews: [
        { id: 'rev11', userName: 'Samantha Wheeler', rating: 4, comment: 'Very refreshing salad.', date: '4 days ago' }
    ]
  },
  {
    id: 'r10',
    name: 'Cluck Cluck',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    deliveryTime: '25-35 min',
    offers: 'Family Bucket Deal',
    description: 'Crispy, juicy fried chicken. The ultimate comfort food.',
    address: '222 Fried Chicken Way, Southern District',
    openingHours: '10:00 AM - 11:00 PM',
    reviews: [
        { id: 'rev12', userName: 'Robert Zane', rating: 5, comment: 'Best fried chicken in the city.', date: '2 days ago' }
    ]
  }
];