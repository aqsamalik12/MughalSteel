using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.Models;
using MughalSteelApi.Services;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileStorageService _fileStorageService;

        public PortfolioController(AppDbContext context, IFileStorageService fileStorageService)
        {
            _context = context;
            _fileStorageService = fileStorageService;
        }

        // =========================================================
        // PUBLIC PROJECTS & PORTFOLIO ENDPOINTS
        // =========================================================

        /// <summary>
        /// Retrieves published projects with optional category, status, and search filters.
        /// </summary>
        [HttpGet("api/projects")]
        [HttpGet("api/portfolio")]
        public async Task<IActionResult> GetPortfolio(
            [FromQuery] string? category, 
            [FromQuery] string? status,
            [FromQuery] bool? featured, 
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 50)
        {
            var query = _context.PortfolioProjects.AsQueryable();

            // Status filter: Public can only view non-draft
            var isUserAdmin = User.IsInRole("SuperAdmin") || User.IsInRole("Manager") || User.IsInRole("ContentManager");
            if (!isUserAdmin)
            {
                query = query.Where(p => p.Status != "Draft");
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                var normStatus = status.Trim().ToLower();
                query = query.Where(p => p.Status.ToLower() == normStatus);
            }

            if (!string.IsNullOrWhiteSpace(category) && category != "All")
            {
                var normCat = category.Trim().ToLower();
                query = query.Where(p => p.Category.ToLower() == normCat || p.Category.ToLower().Contains(normCat));
            }

            if (featured.HasValue)
            {
                query = query.Where(p => p.Featured == featured.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(p => p.Title.ToLower().Contains(s) || 
                                         p.Description.ToLower().Contains(s) || 
                                         p.ShortDescription.ToLower().Contains(s) || 
                                         p.Location.ToLower().Contains(s) ||
                                         p.Materials.ToLower().Contains(s) ||
                                         p.Services.ToLower().Contains(s) ||
                                         p.Category.ToLower().Contains(s));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(p => p.DisplayOrder)
                .ThenByDescending(p => p.CreatedDate)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return Ok(new 
            { 
                success = true, 
                total = totalCount, 
                page, 
                limit, 
                data = items 
            });
        }

        /// <summary>
        /// Returns top featured projects for homepage and showcase.
        /// </summary>
        [HttpGet("api/projects/featured")]
        [HttpGet("api/portfolio/featured")]
        public async Task<IActionResult> GetFeaturedPortfolio([FromQuery] int limit = 6)
        {
            var featured = await _context.PortfolioProjects
                .Where(p => p.Status != "Draft" && p.Featured)
                .OrderBy(p => p.DisplayOrder)
                .ThenByDescending(p => p.CreatedDate)
                .Take(limit)
                .ToListAsync();

            // Fallback to latest projects if fewer featured items exist
            if (featured.Count < limit)
            {
                var remaining = limit - featured.Count;
                var featuredIds = featured.Select(f => f.Id).ToList();
                var additional = await _context.PortfolioProjects
                    .Where(p => p.Status != "Draft" && !featuredIds.Contains(p.Id))
                    .OrderBy(p => p.DisplayOrder)
                    .ThenByDescending(p => p.CreatedDate)
                    .Take(remaining)
                    .ToListAsync();
                featured.AddRange(additional);
            }

            return Ok(new { success = true, count = featured.Count, data = featured });
        }

        /// <summary>
        /// Retrieves a single project item by Slug or GUID ID.
        /// </summary>
        [HttpGet("api/projects/{idOrSlug}")]
        [HttpGet("api/portfolio/{idOrSlug}")]
        public async Task<IActionResult> GetPortfolioBySlugOrId(string idOrSlug)
        {
            if (string.IsNullOrWhiteSpace(idOrSlug))
                return BadRequest(new { success = false, message = "Identifier is required." });

            PortfolioProject? project = null;

            if (Guid.TryParse(idOrSlug, out var guidId))
            {
                project = await _context.PortfolioProjects.FindAsync(guidId);
            }

            if (project == null)
            {
                var normSlug = idOrSlug.Trim().ToLower();
                project = await _context.PortfolioProjects.FirstOrDefaultAsync(p => p.Slug.ToLower() == normSlug);
            }

            if (project == null)
            {
                return NotFound(new { success = false, message = "Project not found." });
            }

            return Ok(new { success = true, data = project });
        }

        // =========================================================
        // AUTHORIZED ADMIN ENDPOINTS
        // =========================================================

        /// <summary>
        /// Creates a new project (Admin only).
        /// </summary>
        [Authorize(Roles = "SuperAdmin,Manager,ContentManager,ProductManager")]
        [HttpPost("api/admin/projects")]
        [HttpPost("api/admin/portfolio")]
        public async Task<IActionResult> CreatePortfolioProject([FromBody] PortfolioProject project)
        {
            if (string.IsNullOrWhiteSpace(project.Title))
                return BadRequest(new { success = false, message = "Project title is required." });

            // Generate or normalize slug
            if (string.IsNullOrWhiteSpace(project.Slug))
            {
                project.Slug = GenerateSlug(project.Title);
            }
            else
            {
                project.Slug = GenerateSlug(project.Slug);
            }

            // Ensure unique slug
            var baseSlug = project.Slug;
            int counter = 1;
            while (await _context.PortfolioProjects.AnyAsync(p => p.Slug == project.Slug))
            {
                project.Slug = $"{baseSlug}-{counter++}";
            }

            if (string.IsNullOrWhiteSpace(project.CoverImage) && !string.IsNullOrWhiteSpace(project.MainImageUrl))
            {
                project.CoverImage = project.MainImageUrl;
            }
            if (string.IsNullOrWhiteSpace(project.MainImageUrl) && !string.IsNullOrWhiteSpace(project.CoverImage))
            {
                project.MainImageUrl = project.CoverImage;
            }

            project.CreatedDate = DateTime.UtcNow;
            _context.PortfolioProjects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPortfolioBySlugOrId), new { idOrSlug = project.Slug }, new { success = true, data = project });
        }

        /// <summary>
        /// Updates an existing project (Admin only).
        /// </summary>
        [Authorize(Roles = "SuperAdmin,Manager,ContentManager,ProductManager")]
        [HttpPut("api/admin/projects/{id}")]
        [HttpPut("api/admin/portfolio/{id}")]
        public async Task<IActionResult> UpdatePortfolioProject(Guid id, [FromBody] PortfolioProject project)
        {
            var existing = await _context.PortfolioProjects.FindAsync(id);
            if (existing == null)
                return NotFound(new { success = false, message = "Project not found." });

            existing.Title = project.Title;
            if (!string.IsNullOrWhiteSpace(project.Slug) && project.Slug != existing.Slug)
            {
                var cleanSlug = GenerateSlug(project.Slug);
                if (!await _context.PortfolioProjects.AnyAsync(p => p.Id != id && p.Slug == cleanSlug))
                {
                    existing.Slug = cleanSlug;
                }
            }

            existing.Category = project.Category;
            existing.ShortDescription = project.ShortDescription;
            existing.Description = project.Description;
            existing.Location = project.Location;
            existing.ProjectType = project.ProjectType;
            existing.ClientType = project.ClientType;
            existing.Duration = project.Duration;
            existing.Materials = project.Materials;
            existing.Services = project.Services;
            existing.CoverImage = project.CoverImage;
            existing.MainImageUrl = string.IsNullOrWhiteSpace(project.MainImageUrl) ? project.CoverImage : project.MainImageUrl;
            existing.ImagesList = project.ImagesList;
            existing.SpecsJson = project.SpecsJson;
            existing.DeliverablesJson = project.DeliverablesJson;
            existing.CompletedDate = project.CompletedDate;
            existing.Featured = project.Featured;
            existing.DisplayOrder = project.DisplayOrder;
            existing.Status = project.Status;
            existing.EditedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = existing });
        }

        /// <summary>
        /// Deletes (soft-deletes) a project (Admin only).
        /// </summary>
        [Authorize(Roles = "SuperAdmin,Manager,ContentManager,ProductManager")]
        [HttpDelete("api/admin/projects/{id}")]
        [HttpDelete("api/admin/portfolio/{id}")]
        public async Task<IActionResult> DeletePortfolioProject(Guid id)
        {
            var project = await _context.PortfolioProjects.FindAsync(id);
            if (project == null)
                return NotFound(new { success = false, message = "Project not found." });

            project.Deleted = true;
            project.DeletedDate = DateTime.UtcNow;
            _context.PortfolioProjects.Update(project);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Project deleted successfully." });
        }

        /// <summary>
        /// Uploads an image for project through backend storage service.
        /// </summary>
        [Authorize(Roles = "SuperAdmin,Manager,ContentManager,ProductManager")]
        [HttpPost("api/admin/projects/upload-image")]
        [HttpPost("api/admin/portfolio/upload-image")]
        public async Task<IActionResult> UploadPortfolioImage(IFormFile file, [FromForm] string? viewType)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "File is required." });

            try
            {
                var fileUrl = await _fileStorageService.SaveFileAsync(file, "projects");
                return Ok(new 
                { 
                    success = true, 
                    url = fileUrl,
                    fileName = file.FileName,
                    viewType = viewType ?? "gallery"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        private static string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return Guid.NewGuid().ToString("n").Substring(0, 8);
            var slug = text.ToLower().Trim();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", " ").Trim();
            slug = slug.Substring(0, slug.Length <= 80 ? slug.Length : 80).Trim();
            slug = Regex.Replace(slug, @"\s", "-");
            return slug;
        }
    }
}
