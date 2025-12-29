// API Base URL - uses environment variable with fallback
// Clean and normalize the API URL to prevent malformed URLs
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Remove any trailing slashes and whitespace
  let url = envUrl.trim().replace(/\/+$/, '');
  
  // Check if URL contains multiple domains (malformed URL fix)
  // If it contains something like "domain1.com/domain2.com", extract the last domain
  const domainMatch = url.match(/([a-zA-Z0-9-]+\.(?:vercel\.app|onrender\.com|netlify\.app|herokuapp\.com|localhost|127\.0\.0\.1)[^\/]*)/);
  if (domainMatch && url.includes('/') && !url.startsWith('http')) {
    // Extract the last valid domain
    url = domainMatch[1];
  }
  
  // If URL doesn't start with http:// or https://, add https:// (use https for production)
  if (!url.match(/^https?:\/\//)) {
    // For production domains, use https
    if (url.includes('vercel.app') || url.includes('onrender.com') || url.includes('netlify.app')) {
      url = `https://${url}`;
    } else {
      url = `http://${url}`;
    }
  }
  
  // Ensure /api is at the end if not already present
  if (!url.endsWith('/api')) {
    // Remove any existing /api and add it properly
    url = url.replace(/\/api\/?$/, '');
    url = `${url}/api`;
  }
  
  return url;
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint starts with / and API_BASE_URL doesn't end with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        console.error(`❌ API Error: ${response.status}`, error);
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error: any) {
      console.error(`❌ Network Error: ${url}`, error);
      throw new Error(error.message || 'Network error - Is the backend server running?');
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: any) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async updateProfile(data: any) {
    return this.request<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Restaurants
  async getRestaurants() {
    return this.request<any[]>('/restaurants');
  }

  async getAllRestaurants() {
    return this.request<any[]>('/restaurants/all');
  }

  async getRestaurant(id: string) {
    return this.request<any>(`/restaurants/${id}`);
  }

  async getRestaurantItems(id: string) {
    return this.request<any[]>(`/restaurants/${id}/items`);
  }

  async getOwnerRestaurant() {
    return this.request<any>('/restaurants/owner/me');
  }

  async updateRestaurant(id: string, data: any) {
    return this.request<any>(`/restaurants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateRestaurantStatus(id: string, status: string) {
    return this.request<any>(`/restaurants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteRestaurant(id: string) {
    return this.request<void>(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  // Items
  async getItems() {
    return this.request<any[]>('/items');
  }

  async getSwipeItems() {
    return this.request<any[]>('/items/swipe');
  }

  async getItem(id: string) {
    return this.request<any>(`/items/${id}`);
  }

  async createItem(data: any) {
    return this.request<any>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: any) {
    return this.request<any>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string) {
    return this.request<void>(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getRestaurantReviews(id: string) {
    return this.request<any[]>(`/reviews/restaurant/${id}`);
  }

  async getItemReviews(id: string) {
    return this.request<any[]>(`/reviews/item/${id}`);
  }

  async createReview(data: any) {
    return this.request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Orders
  async getOrders() {
    return this.request<any[]>('/orders/me');
  }

  async createOrder(data: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();
