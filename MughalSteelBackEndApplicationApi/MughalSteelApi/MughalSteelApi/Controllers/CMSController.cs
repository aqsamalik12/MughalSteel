using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.Models;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    public class CMSController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CMSController(AppDbContext context)
        {
            _context = context;
        }

        // --- BLOG ENDPOINTS ---

        [HttpGet("api/blog")]
        public async Task<IActionResult> GetBlogPosts([FromQuery] string? status)
        {
            var query = _context.BlogPosts.AsQueryable();
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(b => b.Status == status);
            }
            else
            {
                var isUserAdmin = User.IsInRole("SuperAdmin") || User.IsInRole("Manager") || User.IsInRole("ContentManager");
                if (!isUserAdmin)
                {
                    query = query.Where(b => b.Status == "Published");
                }
            }

            var posts = await query.OrderByDescending(b => b.Date).ToListAsync();
            return Ok(new { success = true, data = posts });
        }

        [HttpGet("api/blog/{slug}")]
        public async Task<IActionResult> GetBlogPostBySlug(string slug)
        {
            var post = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
            if (post == null && Guid.TryParse(slug, out var guidId))
            {
                post = await _context.BlogPosts.FindAsync(guidId);
            }

            if (post == null) return NotFound(new { success = false, message = "Blog post not found." });

            return Ok(new { success = true, data = post });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPost("api/admin/blog")]
        public async Task<IActionResult> CreateBlogPost([FromBody] BlogPost post)
        {
            if (await _context.BlogPosts.AnyAsync(b => b.Slug == post.Slug))
            {
                return BadRequest(new { success = false, message = "Blog post slug already exists." });
            }

            post.Date = DateTime.UtcNow;
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = post });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPut("api/admin/blog/{id}")]
        public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] BlogPost post)
        {
            var existing = await _context.BlogPosts.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = post.Title;
            existing.Slug = post.Slug;
            existing.Content = post.Content;
            existing.Summary = post.Summary;
            existing.ImageUrl = post.ImageUrl;
            existing.Author = post.Author;
            existing.Category = post.Category;
            existing.Tags = post.Tags;
            existing.Status = post.Status;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = existing });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpDelete("api/admin/blog/{id}")]
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return NotFound();

            post.Deleted = true;
            post.DeletedDate = DateTime.UtcNow;
            _context.BlogPosts.Update(post);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Blog post deleted." });
        }

        // --- TESTIMONIALS ---

        [HttpGet("api/testimonials")]
        public async Task<IActionResult> GetTestimonials()
        {
            var list = await _context.Testimonials.Where(t => t.Active).ToListAsync();
            return Ok(new { success = true, data = list });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPost("api/admin/testimonials")]
        public async Task<IActionResult> CreateTestimonial([FromBody] Testimonial t)
        {
            _context.Testimonials.Add(t);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = t });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPut("api/admin/testimonials/{id}")]
        public async Task<IActionResult> UpdateTestimonial(Guid id, [FromBody] Testimonial t)
        {
            var existing = await _context.Testimonials.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = t.Name;
            existing.City = t.City;
            existing.Comment = t.Comment;
            existing.Rating = t.Rating;
            existing.Active = t.Active;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = existing });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpDelete("api/admin/testimonials/{id}")]
        public async Task<IActionResult> DeleteTestimonial(Guid id)
        {
            var existing = await _context.Testimonials.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Deleted = true;
            existing.DeletedDate = DateTime.UtcNow;
            _context.Testimonials.Update(existing);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Testimonial deleted." });
        }

        // --- GALLERY ---

        [HttpGet("api/gallery")]
        public async Task<IActionResult> GetGallery()
        {
            var projects = await _context.GalleryProjects.ToListAsync();
            return Ok(new { success = true, data = projects });
        }

        [HttpGet("api/gallery/{id}")]
        public async Task<IActionResult> GetGalleryById(Guid id)
        {
            var project = await _context.GalleryProjects.FindAsync(id);
            if (project == null) return NotFound();

            return Ok(new { success = true, data = project });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPost("api/admin/gallery")]
        public async Task<IActionResult> CreateGalleryProject([FromBody] GalleryProject proj)
        {
            _context.GalleryProjects.Add(proj);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = proj });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpPut("api/admin/gallery/{id}")]
        public async Task<IActionResult> UpdateGalleryProject(Guid id, [FromBody] GalleryProject proj)
        {
            var existing = await _context.GalleryProjects.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Title = proj.Title;
            existing.Description = proj.Description;
            existing.Location = proj.Location;
            existing.Style = proj.Style;
            existing.CoverImage = proj.CoverImage;
            existing.ImagesList = proj.ImagesList;
            existing.Tags = proj.Tags;
            existing.Featured = proj.Featured;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = existing });
        }

        [Authorize(Roles = "SuperAdmin,Manager,ContentManager")]
        [HttpDelete("api/admin/gallery/{id}")]
        public async Task<IActionResult> DeleteGalleryProject(Guid id)
        {
            var proj = await _context.GalleryProjects.FindAsync(id);
            if (proj == null) return NotFound();

            proj.Deleted = true;
            proj.DeletedDate = DateTime.UtcNow;
            _context.GalleryProjects.Update(proj);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Gallery project deleted." });
        }

        // --- CONTACT MESSAGES ---

        [HttpPost("api/contact")]
        public async Task<IActionResult> CreateContactMessage([FromBody] ContactMessage msg)
        {
            msg.Status = "Unread";

            _context.ContactMessages.Add(msg);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = msg });
        }

        [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport")]
        [HttpGet("api/admin/messages")]
        public async Task<IActionResult> GetContactMessages()
        {
            var list = await _context.ContactMessages.OrderByDescending(m => m.CreatedDate).ToListAsync();
            return Ok(new { success = true, data = list });
        }

        [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport")]
        [HttpPut("api/admin/messages/{id}/status")]
        public async Task<IActionResult> UpdateMessageStatus(Guid id, [FromBody] string status)
        {
            var msg = await _context.ContactMessages.FindAsync(id);
            if (msg == null) return NotFound();

            msg.Status = status;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Message status updated." });
        }

        // --- ADMIN ACTIVITY LOG ---
        
        [Authorize(Roles = "SuperAdmin,Manager")]
        [HttpGet("api/admin/logs")]
        public async Task<IActionResult> GetActivityLogs()
        {
            var logs = await _context.ActivityLogs.OrderByDescending(l => l.Timestamp).ToListAsync();
            return Ok(new { success = true, data = logs });
        }
    }
}
