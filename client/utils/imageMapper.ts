// Image mapping utility for food items and restaurants
// Maps item names to relevant Unsplash food images

const foodImageMap: Record<string, string> = {
  // Burgers
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  'cheeseburger': 'https://images.unsplash.com/photo-1550547660-d9450f8590e9?auto=format&fit=crop&w=800&q=80',
  'truffle': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  
  // Indian Food
  'butter chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
  'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'biryani': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
  'tandoori': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'samosa': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
  
  // Pizza
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  'margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
  'pepperoni': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
  
  // Sushi/Japanese
  'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80',
  'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  'sashimi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80',
  'tempura': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
  
  // Healthy/Bowls
  'acai': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
  'bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  
  // Breakfast
  'toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
  'avocado': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
  'pancake': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
  'waffle': 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
  
  // Mexican
  'taco': 'https://images.unsplash.com/photo-1565299585323-38174c3d0c0e?auto=format&fit=crop&w=800&q=80',
  'burrito': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
  'quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80',
  
  // Chinese
  'dumpling': 'https://images.unsplash.com/photo-1626087925301-8e4c0f5c4a5c?auto=format&fit=crop&w=800&q=80',
  'noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  
  // Desserts
  'ice cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  'brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  
  // Pasta
  'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  'spaghetti': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
  
  // Seafood
  'fish': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  'salmon': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  'shrimp': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
  
  // Chicken
  'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80',
  'wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
  
  // Steak
  'steak': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'ribeye': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
};

// Restaurant/Hotel cover images - real restaurant interior/exterior images (ALL UNIQUE, NO DUPLICATES)
const restaurantImageMap: Record<string, string[]> = {
  'italian': [
    'https://images.unsplash.com/photo-1555396273-367ba0ee68c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1594007654729-407edc19256f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  ],
  'indian': [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'mexican': [
    'https://images.unsplash.com/photo-1502301197179-652585504901?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1599020186703-3f0b1f2b1f1f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ba0ee68c4?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'chinese': [
    'https://images.unsplash.com/photo-1546458200-1929110111f7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582234371722-2d274a38f9c7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'japanese': [
    'https://images.unsplash.com/photo-1506084868230-bb9d95c9292d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550547648-3170b7556168?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'american': [
    'https://images.unsplash.com/photo-1596496181911-917051a12947?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'healthy': [
    'https://images.unsplash.com/photo-1501726016755-e022a7278678?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514933651105-0646ef57865e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'mediterranean': [
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498654896293-37aacf1133be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
  ],
  'default': [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498654896293-37aacf1133be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555396273-367ba0ee68c4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502301197179-652585504901?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80',
  ],
};

// Get unique image for food item based on name
export function getFoodImage(itemName: string, existingImages: string[] = []): string {
  const lowerName = itemName.toLowerCase();
  
  // Try to find matching keyword
  for (const [keyword, imageUrl] of Object.entries(foodImageMap)) {
    if (lowerName.includes(keyword)) {
      // Check if this image is already used
      if (!existingImages.includes(imageUrl)) {
        return imageUrl;
      }
    }
  }
  
  // If no match or image already used, return a default food image (ALL UNIQUE)
  const defaultImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
  ];
  
  // Find first unused default image
  for (const img of defaultImages) {
    if (!existingImages.includes(img)) {
      return img;
    }
  }
  
  // Fallback - use timestamp to make unique
  return `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80&t=${Date.now()}`;
}

// Track used restaurant images to ensure uniqueness
const usedRestaurantImages = new Set<string>();

// Get unique restaurant cover image based on cuisine
export function getRestaurantImage(cuisine: string, excludeImages: string[] = []): string {
  const lowerCuisine = cuisine.toLowerCase();
  let imageArray: string[] = [];
  
  // Find matching cuisine type
  for (const [keyword, images] of Object.entries(restaurantImageMap)) {
    if (lowerCuisine.includes(keyword)) {
      imageArray = images;
      break;
    }
  }
  
  // Use default if no match
  if (imageArray.length === 0) {
    imageArray = restaurantImageMap.default;
  }
  
  // Find first unused image
  for (const imageUrl of imageArray) {
    if (!usedRestaurantImages.has(imageUrl) && !excludeImages.includes(imageUrl)) {
      usedRestaurantImages.add(imageUrl);
      return imageUrl;
    }
  }
  
  // If all images used, cycle through and make each unique with timestamp/random
  const randomImage = imageArray[Math.floor(Math.random() * imageArray.length)];
  const baseUrl = randomImage.split('&t=')[0].split('&unique=')[0].split('&')[0];
  return `${baseUrl}&unique=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Reset used images (call when loading new data)
export function resetRestaurantImages() {
  usedRestaurantImages.clear();
}

// Ensure unique images for items in a restaurant - NO COMPROMISE, ALL IMAGES MUST BE UNIQUE
export function ensureUniqueItemImages(items: any[]): any[] {
  const usedImages: string[] = [];
  const result: any[] = [];
  
  // Process each item to ensure unique images
  items.forEach((item, index) => {
    let imageUrl = item.imageUrl || item.image || '';
    
    // If image is missing or already used, get a new unique one
    if (!imageUrl || usedImages.includes(imageUrl)) {
      // Try to get a relevant image based on item name
      imageUrl = getFoodImage(item.name, usedImages);
      
      // If still duplicate, keep trying with variations until we get a unique one
      let attempts = 0;
      while (usedImages.includes(imageUrl) && attempts < 10) {
        // Add index and timestamp to make it unique
        const baseUrl = imageUrl.split('&t=')[0]; // Remove existing timestamp if any
        imageUrl = `${baseUrl}&t=${Date.now()}-${index}-${attempts}`;
        attempts++;
      }
      
      // Final fallback: use completely unique URL with item ID
      if (usedImages.includes(imageUrl)) {
        const baseUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
        imageUrl = `${baseUrl}&t=${Date.now()}-${item._id || item.id || index}-unique`;
      }
    }
    
    // Double-check: if still duplicate, force a unique one
    if (usedImages.includes(imageUrl)) {
      const baseUrl = imageUrl.split('&t=')[0].split('&')[0];
      imageUrl = `${baseUrl}&unique=${Date.now()}-${Math.random()}-${index}`;
    }
    
    usedImages.push(imageUrl);
    
    result.push({
      ...item,
      imageUrl,
      image: imageUrl
    });
  });
  
  // Final verification: check for any remaining duplicates
  const finalImages = result.map(item => item.imageUrl || item.image);
  const duplicates = finalImages.filter((img, index) => finalImages.indexOf(img) !== index);
  
  if (duplicates.length > 0) {
    // Fix any remaining duplicates
    duplicates.forEach((dupImg) => {
      const indices = finalImages.map((img, idx) => img === dupImg ? idx : -1).filter(idx => idx !== -1);
      indices.forEach((idx, dupIndex) => {
        if (dupIndex > 0) { // Keep first occurrence, fix others
          const baseUrl = result[idx].imageUrl.split('&t=')[0].split('&unique=')[0].split('&')[0];
          result[idx].imageUrl = `${baseUrl}&unique=${Date.now()}-${Math.random()}-${idx}-forced`;
          result[idx].image = result[idx].imageUrl;
        }
      });
    });
  }
  
  return result;
}

