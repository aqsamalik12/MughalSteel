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
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Product?> GetBySlugAsync(string slug)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Slug.ToLower() == slug.ToLower());
        }

        public async Task<Product?> GetByCodeAsync(string productCode)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.ProductCode.ToLower() == productCode.ToLower());
        }

        public async Task<IEnumerable<Product>> GetByCategoryAsync(string category)
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.CategoryName.ToLower() == category.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetFeaturedAsync()
        {
            return await _dbSet
                .Include(p => p.Images)
                .Where(p => p.Featured)
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> SearchAsync(string query, string? category = null, string? item = null)
        {
            var q = _dbSet.Include(p => p.Images).AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var lower = query.ToLower();
                q = q.Where(p => p.Name.ToLower().Contains(lower) ||
                                 p.ProductCode.ToLower().Contains(lower) ||
                                 p.Description.ToLower().Contains(lower) ||
                                 p.CategoryName.ToLower().Contains(lower));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                q = q.Where(p => p.CategoryName.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(item))
            {
                q = q.Where(p => p.Item.ToLower() == item.ToLower());
            }

            return await q.ToListAsync();
        }
    }
}
