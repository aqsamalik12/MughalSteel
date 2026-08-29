using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.Models;
using MughalSteelApi.Repositories.Interfaces;

namespace MughalSteelApi.Repositories.Implementations
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Category?> GetBySlugAsync(string slug)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Slug.ToLower() == slug.ToLower());
        }
    }

    public class QuoteRepository : Repository<Quote>, IQuoteRepository
    {
        public QuoteRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Quote?> GetByQuoteNumberAsync(string quoteNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(q => q.QuoteNumber.ToLower() == quoteNumber.ToLower());
        }

        public async Task<IEnumerable<Quote>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(q => q.Status.ToLower() == status.ToLower()).ToListAsync();
        }
    }

    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
        {
            return await _dbSet.Include(o => o.Items).FirstOrDefaultAsync(o => o.OrderNumber.ToLower() == orderNumber.ToLower());
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet.Include(o => o.Items).Where(o => o.UserId == userId).ToListAsync();
        }
    }

    public class SettingsRepository : ISettingsRepository
    {
        private readonly AppDbContext _context;

        public SettingsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<WebsiteSettings> GetSettingsAsync()
        {
            var settings = await _context.WebsiteSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new WebsiteSettings
                {
                    CompanyName = "Mughal Steel Fabrication",
                    Phone = "+92 300 1234567",
                    WhatsappNumber = "+92 300 1234567",
                    Email = "info@mughalsteelfabrication.com",
                    StreetAddress = "Main Workshop & Yard, Plot 42, Sector I-9 Industrial Area",
                    City = "Rawalpindi / Islamabad",
                    State = "Punjab / ICT",
                    ZipCode = "46000",
                    Country = "Pakistan",
                    BusinessHours = "Monday - Saturday: 8:30 AM - 8:30 PM",
                    GoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad+Rawalpindi"
                };
                await _context.WebsiteSettings.AddAsync(settings);
                await _context.SaveChangesAsync();
            }
            return settings;
        }

        public async Task UpdateSettingsAsync(WebsiteSettings settings)
        {
            _context.WebsiteSettings.Update(settings);
            await _context.SaveChangesAsync();
        }
    }

    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }
    }

    public class CMSRepository : ICMSRepository
    {
        private readonly AppDbContext _context;

        public CMSRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Testimonial>> GetTestimonialsAsync(bool onlyPublished = true)
        {
            var query = _context.Testimonials.AsQueryable();
            if (onlyPublished) query = query.Where(t => t.Active);
            return await query.ToListAsync();
        }

        public async Task<Testimonial?> GetTestimonialByIdAsync(Guid id)
        {
            return await _context.Testimonials.FindAsync(id);
        }

        public async Task<Testimonial> AddTestimonialAsync(Testimonial testimonial)
        {
            await _context.Testimonials.AddAsync(testimonial);
            await _context.SaveChangesAsync();
            return testimonial;
        }

        public async Task UpdateTestimonialAsync(Testimonial testimonial)
        {
            _context.Testimonials.Update(testimonial);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTestimonialAsync(Guid id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t != null)
            {
                t.Deleted = true;
                t.DeletedDate = DateTime.UtcNow;
                _context.Testimonials.Update(t);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BlogPost>> GetBlogPostsAsync(bool onlyPublished = true)
        {
            var query = _context.BlogPosts.AsQueryable();
            if (onlyPublished) query = query.Where(b => b.Status == "Published");
            return await query.OrderByDescending(b => b.Date).ToListAsync();
        }

        public async Task<BlogPost?> GetBlogPostBySlugAsync(string slug)
        {
            return await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug.ToLower() == slug.ToLower());
        }

        public async Task<BlogPost?> GetBlogPostByIdAsync(Guid id)
        {
            return await _context.BlogPosts.FindAsync(id);
        }

        public async Task<BlogPost> AddBlogPostAsync(BlogPost post)
        {
            await _context.BlogPosts.AddAsync(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task UpdateBlogPostAsync(BlogPost post)
        {
            _context.BlogPosts.Update(post);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBlogPostAsync(Guid id)
        {
            var b = await _context.BlogPosts.FindAsync(id);
            if (b != null)
            {
                b.Deleted = true;
                b.DeletedDate = DateTime.UtcNow;
                _context.BlogPosts.Update(b);
                await _context.SaveChangesAsync();
            }
        }
    }
}
