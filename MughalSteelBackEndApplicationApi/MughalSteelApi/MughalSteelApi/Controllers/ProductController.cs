using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;
using MughalSteelApi.Repositories.Interfaces;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        private static ProductResponseDTO MapToDTO(Product p)
        {
            var images = p.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>();
            if (images.Count == 0 && !string.IsNullOrEmpty(p.FrontImage))
            {
                images.Add(p.FrontImage);
            }

            var widths = (p.Widths ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => double.TryParse(s.Trim(), out var d) ? d : 0)
                .Where(d => d > 0)
                .ToList();

            var heights = (p.Heights ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => double.TryParse(s.Trim(), out var d) ? d : 0)
                .Where(d => d > 0)
                .ToList();

            var finishes = (p.FinishesList ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();

            var customizations = (p.CustomizationList ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();

            var tags = (p.TagsList ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();

            return new ProductResponseDTO
            {
                Id = p.Id,
                ProductCode = p.ProductCode,
                Name = p.Name,
                Slug = p.Slug,
                SKU = p.SKU,
                CategoryId = p.CategoryId,
                Category = p.CategoryName,
                Item = p.Item,
                ShortDescription = p.ShortDescription,
                Description = p.Description,
                Price = p.BasePrice,
                PricePerSqFt = p.PricePerSqFt,
                SalePrice = p.SalePrice,
                FrontImage = p.FrontImage,
                BackImage = p.BackImage,
                SideImage = p.SideImage,
                DetailImage = p.DetailImage,
                InstallationImage = p.InstallationImage,
                Images = images,
                Materials = new List<string> { p.Material },
                Finishes = finishes,
                Style = p.Style,
                Application = p.Application,
                AvailableSizes = new List<string> { $"{p.Widths} ft × {p.Heights} ft" },
                Width = widths,
                Height = heights,
                Customization = customizations,
                Availability = p.Availability,
                Stock = p.StockQuantity,
                Rating = p.Rating,
                Tags = tags,
                RelatedProducts = new List<string>(),
                Featured = p.Featured,
                NewArrival = p.NewArrival,
                OnSale = p.OnSale,
                IsDemoVisual = p.IsDemoVisual,
                Status = p.Status,
                CreatedDate = p.CreatedDate
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetAll(
            [FromQuery] string? search, 
            [FromQuery] string? category, 
            [FromQuery] string? item)
        {
            IEnumerable<Product> products;
            if (!string.IsNullOrWhiteSpace(search) || !string.IsNullOrWhiteSpace(category) || !string.IsNullOrWhiteSpace(item))
            {
                products = await _productRepository.SearchAsync(search ?? "", category, item);
            }
            else
            {
                products = await _productRepository.GetAllAsync();
            }

            return Ok(products.Select(MapToDTO));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDTO>> GetById(string id)
        {
            Product? product = null;
            if (Guid.TryParse(id, out var guidId))
            {
                product = await _productRepository.GetByIdAsync(guidId);
            }

            if (product == null)
            {
                product = await _productRepository.GetBySlugAsync(id) ?? await _productRepository.GetByCodeAsync(id);
            }

            if (product == null) return NotFound(new { message = "Product not found." });
            return Ok(MapToDTO(product));
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetByCategory(string category)
        {
            var products = await _productRepository.GetByCategoryAsync(category);
            return Ok(products.Select(MapToDTO));
        }

        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetFeatured()
        {
            var products = await _productRepository.GetFeaturedAsync();
            return Ok(products.Select(MapToDTO));
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<ActionResult<ProductResponseDTO>> Create([FromBody] CreateProductRequestDTO dto)
        {
            var slug = string.IsNullOrWhiteSpace(dto.Slug) 
                ? dto.Name.ToLower().Replace(" ", "-").Replace("&", "and") 
                : dto.Slug;

            var product = new Product
            {
                ProductCode = dto.ProductCode,
                Name = dto.Name,
                Slug = slug,
                SKU = string.IsNullOrWhiteSpace(dto.SKU) ? dto.ProductCode : dto.SKU,
                CategoryId = dto.CategoryId,
                CategoryName = dto.Category,
                Item = dto.Item,
                ShortDescription = dto.ShortDescription,
                Description = dto.Description,
                BasePrice = dto.Price,
                PricePerSqFt = dto.PricePerSqFt,
                SalePrice = dto.SalePrice,
                FrontImage = dto.FrontImage,
                BackImage = dto.BackImage,
                SideImage = dto.SideImage,
                DetailImage = dto.DetailImage,
                InstallationImage = dto.InstallationImage,
                Material = dto.Materials?.FirstOrDefault() ?? "14-Gauge Heavy MS Steel",
                Style = dto.Style ?? "Modern CNC Laser",
                Application = dto.Application ?? "Exterior Villa Gate",
                Widths = string.Join(",", dto.Width ?? new List<double>()),
                Heights = string.Join(",", dto.Height ?? new List<double>()),
                FinishesList = string.Join(",", dto.Finishes ?? new List<string>()),
                CustomizationList = string.Join(",", dto.Customization ?? new List<string>()),
                TagsList = string.Join(",", dto.Tags ?? new List<string>()),
                Availability = dto.Availability,
                StockQuantity = dto.Stock,
                Featured = dto.Featured,
                NewArrival = dto.NewArrival,
                OnSale = dto.OnSale,
                IsDemoVisual = dto.IsDemoVisual,
                Status = dto.Status ?? "Active"
            };

            await _productRepository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, MapToDTO(product));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequestDTO dto)
        {
            var existing = await _productRepository.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "Product not found." });

            existing.ProductCode = dto.ProductCode;
            existing.Name = dto.Name;
            existing.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? existing.Slug : dto.Slug;
            existing.SKU = string.IsNullOrWhiteSpace(dto.SKU) ? dto.ProductCode : dto.SKU;
            existing.CategoryId = dto.CategoryId ?? existing.CategoryId;
            existing.CategoryName = dto.Category;
            existing.Item = dto.Item;
            existing.ShortDescription = dto.ShortDescription;
            existing.Description = dto.Description;
            existing.BasePrice = dto.Price;
            existing.PricePerSqFt = dto.PricePerSqFt;
            existing.SalePrice = dto.SalePrice;
            existing.FrontImage = dto.FrontImage;
            existing.BackImage = dto.BackImage;
            existing.SideImage = dto.SideImage;
            existing.DetailImage = dto.DetailImage;
            existing.InstallationImage = dto.InstallationImage;
            existing.Material = dto.Materials?.FirstOrDefault() ?? existing.Material;
            existing.Style = dto.Style ?? existing.Style;
            existing.Application = dto.Application ?? existing.Application;
            existing.Widths = string.Join(",", dto.Width ?? new List<double>());
            existing.Heights = string.Join(",", dto.Height ?? new List<double>());
            existing.FinishesList = string.Join(",", dto.Finishes ?? new List<string>());
            existing.CustomizationList = string.Join(",", dto.Customization ?? new List<string>());
            existing.TagsList = string.Join(",", dto.Tags ?? new List<string>());
            existing.Availability = dto.Availability;
            existing.StockQuantity = dto.Stock;
            existing.Featured = dto.Featured;
            existing.NewArrival = dto.NewArrival;
            existing.OnSale = dto.OnSale;
            existing.IsDemoVisual = dto.IsDemoVisual;
            existing.Status = dto.Status ?? existing.Status;

            await _productRepository.UpdateAsync(existing);
            return Ok(MapToDTO(existing));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _productRepository.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "Product not found." });

            await _productRepository.DeleteAsync(existing);
            return Ok(new { success = true, message = "Product deleted." });
        }
    }
}
