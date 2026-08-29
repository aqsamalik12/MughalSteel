using System.Collections.Generic;
using System.Threading.Tasks;
using MughalSteelApi.Models;

namespace MughalSteelApi.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<Product?> GetBySlugAsync(string slug);
        Task<Product?> GetByCodeAsync(string productCode);
        Task<IEnumerable<Product>> GetByCategoryAsync(string category);
        Task<IEnumerable<Product>> GetFeaturedAsync();
        Task<IEnumerable<Product>> SearchAsync(string query, string? category = null, string? item = null);
    }
}
