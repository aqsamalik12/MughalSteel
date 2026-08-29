/**
 * Mughal Steel - Offline-First IndexedDB Database Service
 * Handles reliable local storage, caching, and persistence of all application records.
 */

import type { 
  Product, Quote, Order, CustomDesign, Review, 
  BlogPost, Testimonial, WebsiteSettings, ContactMessage, ActivityLog, Category 
} from '../types';

const DB_NAME = 'MughalSteelDB';
const DB_VERSION = 1;

export type StoreName = 
  | 'products'
  | 'categories'
  | 'reviews'
  | 'blogs'
  | 'testimonials'
  | 'settings'
  | 'activityLogs'
  | 'syncQueue';

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'failed' | 'synced';
}

export interface DbStats {
  products: number;
  categories: number;
  reviews: number;
  blogs: number;
  testimonials: number;
  activityLogs: number;
  syncQueue: number;
  isAvailable: boolean;
  dbName: string;
  version: number;
}

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize or retrieve the database instance
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB is not supported in this browser environment.');
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Products Store
        if (!db.objectStoreNames.contains('products')) {
          const store = db.createObjectStore('products', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('productCode', 'productCode', { unique: false });
          store.createIndex('slug', 'slug', { unique: false });
          store.createIndex('featured', 'featured', { unique: false });
        }

        // 2. Categories Store
        if (!db.objectStoreNames.contains('categories')) {
          const store = db.createObjectStore('categories', { keyPath: 'id' });
          store.createIndex('slug', 'slug', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }





        // 6. Reviews Store
        if (!db.objectStoreNames.contains('reviews')) {
          const store = db.createObjectStore('reviews', { keyPath: 'id' });
          store.createIndex('productId', 'productId', { unique: false });
          store.createIndex('rating', 'rating', { unique: false });
        }

        // 7. Blogs Store
        if (!db.objectStoreNames.contains('blogs')) {
          const store = db.createObjectStore('blogs', { keyPath: 'id' });
          store.createIndex('slug', 'slug', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }

        // 8. Testimonials Store
        if (!db.objectStoreNames.contains('testimonials')) {
          const store = db.createObjectStore('testimonials', { keyPath: 'id' });
          store.createIndex('rating', 'rating', { unique: false });
        }

        // 9. Website Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }



        // 11. Activity Logs Store
        if (!db.objectStoreNames.contains('activityLogs')) {
          const store = db.createObjectStore('activityLogs', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 12. Offline Sync Queue Store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(request.error?.message || 'Failed to open IndexedDB'));
      };
    });

    return this.dbPromise;
  }

  /**
   * Generic: Get all records from a given store
   */
  async getAll<T>(storeName: StoreName): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise<T[]>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve((request.result as T[]) || []);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB getAll error in [${storeName}]:`, err);
      return [];
    }
  }

  /**
   * Generic: Get single record by ID
   */
  async getById<T>(storeName: StoreName, id: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise<T | null>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve((request.result as T) || null);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB getById error in [${storeName}, id=${id}]:`, err);
      return null;
    }
  }

  /**
   * Generic: Save or update a single record
   */
  async put<T extends { id?: string }>(storeName: StoreName, item: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise<T>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(item);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB put error in [${storeName}]:`, err);
      return item;
    }
  }

  /**
   * Generic: Save or update multiple records in a single transaction
   */
  async putMany<T extends { id?: string }>(storeName: StoreName, items: T[]): Promise<T[]> {
    if (!items || items.length === 0) return [];
    try {
      const db = await this.getDB();
      return new Promise<T[]>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        items.forEach((item) => {
          store.put(item);
        });

        transaction.oncomplete = () => resolve(items);
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (err) {
      console.warn(`IndexedDB putMany error in [${storeName}]:`, err);
      return items;
    }
  }

  /**
   * Generic: Delete a record by ID
   */
  async delete(storeName: StoreName, id: string): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise<boolean>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB delete error in [${storeName}, id=${id}]:`, err);
      return false;
    }
  }

  /**
   * Generic: Clear all records in a store
   */
  async clear(storeName: StoreName): Promise<boolean> {
    try {
      const db = await this.getDB();
      return new Promise<boolean>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB clear error in [${storeName}]:`, err);
      return false;
    }
  }

  /**
   * Generic: Count records in a store
   */
  async count(storeName: StoreName): Promise<number> {
    try {
      const db = await this.getDB();
      return new Promise<number>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.count();

        request.onsuccess = () => resolve(request.result || 0);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      return 0;
    }
  }

  // ==========================================
  // CONVENIENCE ENTITY METHODS
  // ==========================================

  // Products
  async getProducts(): Promise<Product[]> {
    return this.getAll<Product>('products');
  }
  async saveProduct(product: Product): Promise<Product> {
    return this.put<Product>('products', product);
  }
  async saveProducts(products: Product[]): Promise<Product[]> {
    return this.putMany<Product>('products', products);
  }
  async deleteProduct(id: string): Promise<boolean> {
    return this.delete('products', id);
  }





  // Reviews
  async getReviews(): Promise<Review[]> {
    return this.getAll<Review>('reviews');
  }
  async saveReview(review: Review): Promise<Review> {
    return this.put<Review>('reviews', review);
  }
  async saveReviews(reviews: Review[]): Promise<Review[]> {
    return this.putMany<Review>('reviews', reviews);
  }

  // Blogs
  async getBlogs(): Promise<BlogPost[]> {
    return this.getAll<BlogPost>('blogs');
  }
  async saveBlog(blog: BlogPost): Promise<BlogPost> {
    return this.put<BlogPost>('blogs', blog);
  }
  async saveBlogs(blogs: BlogPost[]): Promise<BlogPost[]> {
    return this.putMany<BlogPost>('blogs', blogs);
  }
  async deleteBlog(id: string): Promise<boolean> {
    return this.delete('blogs', id);
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return this.getAll<Testimonial>('testimonials');
  }
  async saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
    return this.put<Testimonial>('testimonials', testimonial);
  }
  async saveTestimonials(testimonials: Testimonial[]): Promise<Testimonial[]> {
    return this.putMany<Testimonial>('testimonials', testimonials);
  }
  async deleteTestimonial(id: string): Promise<boolean> {
    return this.delete('testimonials', id);
  }

  // Settings
  async getSettings(): Promise<WebsiteSettings | null> {
    const res = await this.getById<{ id: string; settings: WebsiteSettings }>('settings', 'global_settings');
    return res ? res.settings : null;
  }
  async saveSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    await this.put('settings', { id: 'global_settings', settings });
    return settings;
  }



  // Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    return this.getAll<ActivityLog>('activityLogs');
  }
  async saveActivityLog(log: ActivityLog): Promise<ActivityLog> {
    return this.put<ActivityLog>('activityLogs', log);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.getAll<Category>('categories');
  }
  async saveCategories(categories: Category[]): Promise<Category[]> {
    return this.putMany<Category>('categories', categories);
  }

  // Offline Sync Queue
  async enqueueSync(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: any): Promise<SyncQueueItem> {
    const item: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      endpoint,
      method,
      body,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      status: 'pending'
    };
    return this.put<SyncQueueItem>('syncQueue', item);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return this.getAll<SyncQueueItem>('syncQueue');
  }

  async removeSyncItem(id: string): Promise<boolean> {
    return this.delete('syncQueue', id);
  }

  /**
   * Get complete statistics of records saved in IndexedDB
   */
  async getStats(): Promise<DbStats> {
    const [
      products, categories,
      reviews, blogs, testimonials,
      activityLogs, syncQueue
    ] = await Promise.all([
      this.count('products'),
      this.count('categories'),
      this.count('reviews'),
      this.count('blogs'),
      this.count('testimonials'),
      this.count('activityLogs'),
      this.count('syncQueue')
    ]);

    return {
      products,
      categories,
      reviews,
      blogs,
      testimonials,
      activityLogs,
      syncQueue,
      isAvailable: typeof window !== 'undefined' && !!window.indexedDB,
      dbName: DB_NAME,
      version: DB_VERSION
    };
  }

  /**
   * Export entire database as JSON for backup
   */
  async exportDatabase(): Promise<string> {
    const [
      products, categories,
      reviews, blogs, testimonials,
      settings, activityLogs
    ] = await Promise.all([
      this.getAll('products'),
      this.getAll('categories'),
      this.getAll('reviews'),
      this.getAll('blogs'),
      this.getAll('testimonials'),
      this.getAll('settings'),
      this.getAll('activityLogs')
    ]);

    const backup = {
      dbName: DB_NAME,
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        products,
        categories,
        reviews,
        blogs,
        testimonials,
        settings,
        activityLogs
      }
    };

    return JSON.stringify(backup, null, 2);
  }

  /**
   * Clear all records across all stores
   */
  async resetAllStores(): Promise<void> {
    const stores: StoreName[] = [
      'products', 'categories',
      'reviews', 'blogs', 'testimonials',
      'settings', 'activityLogs', 'syncQueue'
    ];
    await Promise.all(stores.map(store => this.clear(store)));
  }
}

export const dbService = new IndexedDbService();
