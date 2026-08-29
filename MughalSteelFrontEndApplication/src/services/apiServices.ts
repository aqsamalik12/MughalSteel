import { apiFetch, setAuthToken, clearAuthToken } from './apiClient';
import type { Product, Category, Quote, WebsiteSettings, Order, User, Review } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; refreshToken?: string; user: User }> {
    const res = await apiFetch<{ token: string; refreshToken?: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    return res;
  },

  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }): Promise<{ token: string; user: User }> {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    return res;
  },

  async getProfile(): Promise<User> {
    return apiFetch<User>('/api/auth/profile');
  },

  logout(): void {
    clearAuthToken();
  },
};

export const productService = {
  async getAll(params?: { search?: string; category?: string; item?: string }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.item) query.set('item', params.item);
    
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<Product[]>(`/api/product${qs}`);
  },

  async getById(idOrSlug: string): Promise<Product> {
    return apiFetch<Product>(`/api/product/${idOrSlug}`);
  },

  async getByCategory(category: string): Promise<Product[]> {
    return apiFetch<Product[]>(`/api/product/category/${encodeURIComponent(category)}`);
  },

  async getFeatured(): Promise<Product[]> {
    return apiFetch<Product[]>('/api/product/featured');
  },

  async create(product: Partial<Product>): Promise<Product> {
    return apiFetch<Product>('/api/product', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    return apiFetch<Product>(`/api/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch(`/api/product/${id}`, {
      method: 'DELETE',
    });
  },
};

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/api/category');
  },

  async getBySlug(slugOrId: string): Promise<Category> {
    return apiFetch<Category>(`/api/category/${slugOrId}`);
  },

  async create(category: Partial<Category>): Promise<Category> {
    return apiFetch<Category>('/api/category', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    return apiFetch<Category>(`/api/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch(`/api/category/${id}`, {
      method: 'DELETE',
    });
  },
};

export const quoteService = {
  async getAll(status?: string): Promise<Quote[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch<Quote[]>(`/api/quote${qs}`);
  },

  async getById(id: string): Promise<Quote> {
    return apiFetch<Quote>(`/api/quote/${id}`);
  },

  async submit(quoteData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    city?: string;
    projectCategory?: string;
    itemType?: string;
    productId?: string;
    productCode?: string;
    productName?: string;
    width: number;
    height: number;
    quantity: number;
    notes?: string;
    customizations?: string[];
    referenceImages?: string[];
  }): Promise<Quote> {
    return apiFetch<Quote>('/api/quote', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  },

  async updateStatus(id: string, status: string, estimatedPrice?: number): Promise<void> {
    await apiFetch(`/api/quote/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, estimatedPrice }),
    });
  },
};

export const orderService = {
  async getAll(status?: string): Promise<Order[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch<Order[]>(`/api/order${qs}`);
  },

  async getById(id: string): Promise<Order> {
    return apiFetch<Order>(`/api/order/${id}`);
  },

  async create(orderData: {
    userId?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country?: string;
    notes?: string;
    items: Array<{
      productId: string;
      productName: string;
      sku?: string;
      price: number;
      quantity: number;
      selectedWidth?: string;
      selectedHeight?: string;
      selectedFinish?: string;
      selectedGlass?: string;
      selectedHardware?: string;
    }>;
  }): Promise<Order> {
    return apiFetch<Order>('/api/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateStatus(id: string, status: string): Promise<void> {
    await apiFetch(`/api/order/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  },
};

export const cmsService = {
  async getBlogPosts(status?: string): Promise<{ success: boolean; data: any[] }> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch<{ success: boolean; data: any[] }>(`/api/blog${qs}`);
  },

  async getBlogPostBySlug(slug: string): Promise<{ success: boolean; data: any }> {
    return apiFetch<{ success: boolean; data: any }>(`/api/blog/${slug}`);
  },

  async getTestimonials(): Promise<{ success: boolean; data: any[] }> {
    return apiFetch<{ success: boolean; data: any[] }>('/api/testimonials');
  },

  async getGallery(): Promise<{ success: boolean; data: any[] }> {
    return apiFetch<{ success: boolean; data: any[] }>('/api/gallery');
  },

  async submitContact(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<any> {
    return apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getActivityLogs(): Promise<{ success: boolean; data: any[] }> {
    return apiFetch<{ success: boolean; data: any[] }>('/api/admin/logs');
  },
};

export const reviewService = {
  async submit(data: { productId: string; customerName: string; email: string; rating: number; comment: string }): Promise<any> {
    return apiFetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAll(): Promise<{ success: boolean; data: Review[] }> {
    return apiFetch<{ success: boolean; data: Review[] }>('/api/admin/reviews');
  },

  async approve(id: string, approved: boolean): Promise<any> {
    return apiFetch(`/api/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(approved),
    });
  },
};

export const settingsService = {
  async get(): Promise<WebsiteSettings> {
    return apiFetch<WebsiteSettings>('/api/settings');
  },

  async update(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    return apiFetch<WebsiteSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

export const mediaService = {
  async upload(file: File, type = 'images', altText = ''): Promise<{ success: boolean; url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('altText', altText);

    return apiFetch<{ success: boolean; url: string }>('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

export const portfolioService = {
  async getAll(params?: { category?: string; status?: string; featured?: boolean; search?: string; limit?: number }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.set('category', params.category);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await apiFetch<any>(`/api/projects${qs}`);
    return res?.data || res || [];
  },

  async getFeatured(limit = 6): Promise<any[]> {
    const res = await apiFetch<any>(`/api/projects/featured?limit=${limit}`);
    return res?.data || res || [];
  },

  async getByIdOrSlug(idOrSlug: string): Promise<any> {
    const res = await apiFetch<any>(`/api/projects/${idOrSlug}`);
    return res?.data || res;
  },

  async create(project: any): Promise<any> {
    const payload = {
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription || '',
      description: project.description,
      location: project.location,
      projectType: project.projectType || 'Residential Project',
      clientType: project.clientType || 'Private Residence',
      duration: project.duration || '',
      materials: project.materials || '',
      services: project.services || '',
      coverImage: project.coverImage || project.image || project.mainImageUrl,
      mainImageUrl: project.mainImageUrl || project.coverImage || project.image,
      imagesList: Array.isArray(project.galleryImages) ? JSON.stringify(project.galleryImages) : (project.imagesList || ''),
      specsJson: typeof project.specs === 'object' ? JSON.stringify(project.specs) : (project.specsJson || ''),
      deliverablesJson: Array.isArray(project.deliverables) ? JSON.stringify(project.deliverables) : (project.deliverablesJson || ''),
      completedDate: project.completedDate || '2026',
      featured: Boolean(project.featured),
      displayOrder: Number(project.displayOrder || 0),
      status: project.status || 'Completed'
    };

    const res = await apiFetch<any>('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res?.data || res;
  },

  async update(id: string, project: any): Promise<any> {
    const payload = {
      title: project.title,
      slug: project.slug,
      category: project.category,
      shortDescription: project.shortDescription || '',
      description: project.description,
      location: project.location,
      projectType: project.projectType,
      clientType: project.clientType,
      duration: project.duration,
      materials: project.materials,
      services: project.services,
      coverImage: project.coverImage || project.image || project.mainImageUrl,
      mainImageUrl: project.mainImageUrl || project.coverImage || project.image,
      imagesList: Array.isArray(project.galleryImages) ? JSON.stringify(project.galleryImages) : (project.imagesList || ''),
      specsJson: typeof project.specs === 'object' ? JSON.stringify(project.specs) : (project.specsJson || ''),
      deliverablesJson: Array.isArray(project.deliverables) ? JSON.stringify(project.deliverables) : (project.deliverablesJson || ''),
      completedDate: project.completedDate,
      featured: Boolean(project.featured),
      displayOrder: Number(project.displayOrder || 0),
      status: project.status || 'Completed'
    };

    const res = await apiFetch<any>(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res?.data || res;
  },

  async delete(id: string): Promise<any> {
    return apiFetch<any>(`/api/admin/projects/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadImage(file: File, viewType = 'main'): Promise<{ success: boolean; url: string; fileName: string; viewType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('viewType', viewType);

    return apiFetch<{ success: boolean; url: string; fileName: string; viewType: string }>('/api/admin/projects/upload-image', {
      method: 'POST',
      body: formData
    });
  }
};

export const projectService = portfolioService;
