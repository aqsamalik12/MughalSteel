import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { Product, Quote, Order, Review, ContactMessage, WebsiteSettings, BlogPost, Testimonial } from '../types';

export const supabaseDbService = {
  // Check if Supabase connection is healthy
  async checkConnection(): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      return !error || error.code === 'PGRST116' || error.code === '42P01'; // returns true if reachable
    } catch {
      return false;
    }
  },

  // 1. PRODUCTS
  async getProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((item: any) => ({
        id: item.id,
        productCode: item.product_code || item.sku || 'MSF-001',
        name: item.name,
        slug: item.slug,
        sku: item.sku || item.product_code,
        category: item.category || 'Main Gates & Entrance',
        subcategory: item.subcategory || item.category,
        item: item.item || 'Front Gates',
        description: item.description || '',
        shortDescription: item.short_description || item.description,
        pricePerSqFt: item.price_per_sqft || 2800,
        price: item.base_price || item.price || item.price_per_sqft,
        salePrice: item.sale_price,
        featured: item.featured ?? true,
        newArrival: item.new_arrival ?? false,
        sale: item.on_sale ?? false,
        images: Array.isArray(item.images) ? item.images : (item.images ? JSON.parse(item.images) : [item.front_image || '']),
        frontImage: item.front_image || (Array.isArray(item.images) ? item.images[0] : ''),
        backImage: item.back_image,
        sideImage: item.side_image,
        detailImage: item.detail_image,
        installationImage: item.installation_image,
        materials: Array.isArray(item.materials) ? item.materials : ['14-Gauge Solid Mild Steel Frame'],
        finishes: Array.isArray(item.finishes) ? item.finishes : ['Electrostatic Matte Charcoal'],
        glassOptions: Array.isArray(item.glass_options) ? item.glass_options : [],
        hardwareOptions: Array.isArray(item.hardware_options) ? item.hardware_options : [],
        customization: Array.isArray(item.customization) ? item.customization : [],
        rating: item.rating || 5.0,
        stock: item.stock || 10,
        availability: item.availability || 'In Stock',
        style: item.style || 'Modern Architectural',
        application: item.application || 'Residential Exterior',
        createdAt: item.created_at
      }));
    } catch {
      return null;
    }
  },

  async saveProduct(p: Product): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('products').upsert({
        id: p.id,
        product_code: p.productCode || p.sku,
        name: p.name,
        slug: p.slug,
        sku: p.sku || p.productCode,
        category: p.category,
        subcategory: p.subcategory,
        item: p.item,
        description: p.description,
        short_description: p.shortDescription,
        price_per_sqft: p.pricePerSqFt,
        base_price: p.price,
        sale_price: p.salePrice,
        featured: p.featured,
        new_arrival: p.newArrival,
        on_sale: p.sale,
        images: p.images,
        front_image: p.frontImage,
        back_image: p.backImage,
        side_image: p.sideImage,
        detail_image: p.detailImage,
        installation_image: p.installationImage,
        materials: p.materials,
        finishes: p.finishes,
        glass_options: p.glassOptions,
        hardware_options: p.hardwareOptions,
        customization: p.customization,
        rating: p.rating,
        stock: p.stock,
        availability: p.availability,
        style: p.style,
        application: p.application,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 2. QUOTES
  async getQuotes(): Promise<Quote[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((q: any) => ({
        id: q.id,
        quoteNumber: q.quote_number || `QUO-${q.id.substring(0, 8).toUpperCase()}`,
        customer: {
          firstName: q.customer_first_name || q.customer_name?.split(' ')[0] || 'Customer',
          lastName: q.customer_last_name || q.customer_name?.split(' ')[1] || '',
          email: q.customer_email || '',
          phone: q.customer_phone || '',
          city: q.city || 'Islamabad'
        },
        projectType: q.project_type || q.project_category || 'Main Gates',
        productCategory: q.product_category || 'Main Gates',
        productItem: q.item_type || q.product_item,
        productCode: q.product_code,
        dimensions: {
          width: q.width || 12,
          height: q.height || 7.5,
          qty: q.quantity || 1,
          area: q.total_area || (q.width * q.height) || 90
        },
        ratePerSqFt: q.rate_per_sqft || 2800,
        estimatedPrice: q.estimated_price,
        requirements: q.notes || q.requirements,
        notes: q.notes,
        attachments: Array.isArray(q.attachments) ? q.attachments : (q.reference_images || []),
        status: q.status || 'pending',
        createdAt: q.created_at || new Date().toISOString()
      }));
    } catch {
      return null;
    }
  },

  async saveQuote(q: Quote): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('quotes').upsert({
        id: q.id,
        quote_number: q.quoteNumber,
        customer_name: `${q.customer.firstName} ${q.customer.lastName}`.trim(),
        customer_first_name: q.customer.firstName,
        customer_last_name: q.customer.lastName,
        customer_email: q.customer.email,
        customer_phone: q.customer.phone,
        city: q.customer.city,
        project_type: q.projectType,
        project_category: q.productCategory,
        item_type: q.productItem,
        product_code: q.productCode,
        width: typeof q.dimensions.width === 'number' ? q.dimensions.width : parseFloat(String(q.dimensions.width)) || 12,
        height: typeof q.dimensions.height === 'number' ? q.dimensions.height : parseFloat(String(q.dimensions.height)) || 7.5,
        quantity: q.dimensions.qty || 1,
        total_area: q.dimensions.area || 0,
        rate_per_sqft: q.ratePerSqFt || 2800,
        estimated_price: q.estimatedPrice,
        notes: q.notes || q.requirements,
        reference_images: q.attachments,
        status: q.status || 'pending',
        created_at: q.createdAt || new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  async updateQuoteStatus(id: string, status: string, estimatedPrice?: number): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const payload: any = { status };
      if (estimatedPrice !== undefined) payload.estimated_price = estimatedPrice;
      const { error } = await supabase.from('quotes').update(payload).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 3. ORDERS
  async getOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data as Order[];
    } catch {
      return null;
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('orders').upsert({
        id: order.id,
        order_number: order.orderNumber,
        customer_email: order.customerEmail || order.customer?.email,
        customer_first_name: order.customer?.firstName,
        customer_last_name: order.customer?.lastName,
        customer_phone: order.customer?.phone,
        shipping_street: order.shippingAddress?.street,
        shipping_city: order.shippingAddress?.city,
        shipping_state: order.shippingAddress?.state,
        shipping_zip: order.shippingAddress?.zip,
        shipping_country: order.shippingAddress?.country,
        subtotal: order.subtotal || 0,
        shipping_cost: (order as any).shippingCost || 0,
        tax: (order as any).tax || 0,
        total: order.total,
        order_status: order.orderStatus || order.status || 'pending',
        payment_status: (order as any).paymentStatus || 'unpaid',
        payment_method: order.paymentMethod,
        items: order.items,
        notes: (order as any).notes || '',
        created_at: order.createdAt || new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 4. CONTACT MESSAGES
  async getContactMessages(): Promise<ContactMessage[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        subject: m.subject,
        message: m.message,
        status: m.status || 'unread',
        createdAt: m.created_at || new Date().toISOString()
      }));
    } catch {
      return null;
    }
  },

  async saveContactMessage(msg: ContactMessage): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('contact_messages').upsert({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        status: msg.status || 'unread',
        created_at: msg.createdAt || new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  // 5. REVIEWS
  async getReviews(): Promise<Review[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return null;
      return data.map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        userName: r.user_name || r.customer_name,
        rating: r.rating,
        title: r.title || '',
        comment: r.comment,
        date: r.date || r.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        verified: r.verified ?? true,
        approved: r.approved ?? true
      }));
    } catch {
      return null;
    }
  },

  async saveReview(review: Review): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('reviews').upsert({
        id: review.id,
        product_id: review.productId,
        user_name: review.userName,
        rating: review.rating,
        title: (review as any).title || '',
        comment: review.comment,
        date: review.date,
        verified: (review as any).verified ?? true,
        approved: (review as any).approved ?? true,
        created_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  },

  // 6. WEBSITE SETTINGS
  async getSettings(): Promise<WebsiteSettings | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error || !data) return null;
      return {
        companyName: data.company_name,
        tagline: data.tagline,
        phone: data.phone,
        whatsappNumber: data.whatsapp_number,
        email: data.email,
        supportEmail: data.support_email,
        streetAddress: data.street_address,
        suite: data.suite,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        businessHours: data.business_hours,
        googleMapsUrl: data.google_maps_url,
        shippingCharge: data.shipping_charge,
        freeShippingThreshold: data.free_shipping_threshold,
        taxRate: data.tax_rate,
        socialLinks: data.social_links || {},
        logoUrl: data.logo_url,
        currency: data.currency || 'PKR'
      };
    } catch {
      return null;
    }
  },

  async saveSettings(settings: WebsiteSettings): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('website_settings').upsert({
        id: 'default',
        company_name: settings.companyName,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp_number: settings.whatsappNumber,
        email: settings.email,
        support_email: settings.supportEmail,
        street_address: settings.streetAddress,
        suite: settings.suite,
        city: settings.city,
        state: settings.state,
        zip_code: settings.zipCode,
        country: settings.country,
        business_hours: settings.businessHours,
        google_maps_url: settings.googleMapsUrl,
        shipping_charge: settings.shippingCharge,
        free_shipping_threshold: settings.freeShippingThreshold,
        tax_rate: settings.taxRate,
        social_links: settings.socialLinks,
        logo_url: settings.logoUrl,
        currency: settings.currency,
        updated_at: new Date().toISOString()
      });
      return !error;
    } catch {
      return false;
    }
  }
};
