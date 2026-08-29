using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MughalSteelApi.Models;

namespace MughalSteelApi.Repositories.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<Category?> GetBySlugAsync(string slug);
    }

    public interface IQuoteRepository : IRepository<Quote>
    {
        Task<Quote?> GetByQuoteNumberAsync(string quoteNumber);
        Task<IEnumerable<Quote>> GetByStatusAsync(string status);
    }

    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order?> GetByOrderNumberAsync(string orderNumber);
        Task<IEnumerable<Order>> GetByUserIdAsync(Guid userId);
    }

    public interface ISettingsRepository
    {
        Task<WebsiteSettings> GetSettingsAsync();
        Task UpdateSettingsAsync(WebsiteSettings settings);
    }

    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }

    public interface ICMSRepository
    {
        Task<IEnumerable<Testimonial>> GetTestimonialsAsync(bool onlyPublished = true);
        Task<Testimonial?> GetTestimonialByIdAsync(Guid id);
        Task<Testimonial> AddTestimonialAsync(Testimonial testimonial);
        Task UpdateTestimonialAsync(Testimonial testimonial);
        Task DeleteTestimonialAsync(Guid id);

        Task<IEnumerable<BlogPost>> GetBlogPostsAsync(bool onlyPublished = true);
        Task<BlogPost?> GetBlogPostBySlugAsync(string slug);
        Task<BlogPost?> GetBlogPostByIdAsync(Guid id);
        Task<BlogPost> AddBlogPostAsync(BlogPost post);
        Task UpdateBlogPostAsync(BlogPost post);
        Task DeleteBlogPostAsync(Guid id);
    }
}
