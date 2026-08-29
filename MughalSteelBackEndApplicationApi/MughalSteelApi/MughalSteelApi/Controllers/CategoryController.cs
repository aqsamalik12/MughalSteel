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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        private static CategoryResponseDTO MapToDTO(Category c)
        {
            return new CategoryResponseDTO
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Tagline = c.Tagline,
                Description = c.Description,
                HeroImage = c.HeroImage,
                ParentCategoryId = c.ParentCategoryId,
                Items = c.Items ?? new List<string>(),
                PopularProducts = c.PopularProducts ?? new List<string>()
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponseDTO>>> GetAll()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return Ok(categories.Select(MapToDTO));
        }

        [HttpGet("{idOrSlug}")]
        public async Task<ActionResult<CategoryResponseDTO>> GetBySlugOrId(string idOrSlug)
        {
            Category? category = null;
            if (Guid.TryParse(idOrSlug, out var guidId))
            {
                category = await _categoryRepository.GetByIdAsync(guidId);
            }

            if (category == null)
            {
                category = await _categoryRepository.GetBySlugAsync(idOrSlug);
            }

            if (category == null) return NotFound(new { message = "Category not found." });
            return Ok(MapToDTO(category));
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<ActionResult<CategoryResponseDTO>> Create([FromBody] CreateCategoryRequestDTO dto)
        {
            var slug = string.IsNullOrWhiteSpace(dto.Slug)
                ? dto.Name.ToLower().Replace(" ", "-").Replace("&", "and")
                : dto.Slug;

            var category = new Category
            {
                Name = dto.Name,
                Slug = slug,
                Tagline = dto.Tagline,
                Description = dto.Description,
                HeroImage = dto.HeroImage,
                ParentCategoryId = dto.ParentCategoryId,
                Items = dto.Items,
                PopularProducts = dto.PopularProducts
            };

            await _categoryRepository.AddAsync(category);
            return CreatedAtAction(nameof(GetBySlugOrId), new { idOrSlug = category.Slug }, MapToDTO(category));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequestDTO dto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? category.Slug : dto.Slug;
            category.Tagline = dto.Tagline;
            category.Description = dto.Description;
            category.HeroImage = dto.HeroImage;
            category.ParentCategoryId = dto.ParentCategoryId;
            category.Items = dto.Items;
            category.PopularProducts = dto.PopularProducts;

            await _categoryRepository.UpdateAsync(category);
            return Ok(MapToDTO(category));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager,ProductManager")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return NotFound();

            await _categoryRepository.DeleteAsync(category);
            return Ok(new { success = true, message = "Category deleted." });
        }
    }
}
