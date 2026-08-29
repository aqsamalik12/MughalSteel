using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("api/reviews")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequestDTO req)
        {
            var review = new Review
            {
                ProductId = req.ProductId,
                CustomerName = req.CustomerName,
                Email = req.Email,
                Rating = req.Rating,
                Comment = req.Comment,
                Approved = false // Requires moderation
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Review submitted for moderation.", data = review });
        }

        [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport")]
        [HttpGet("api/admin/reviews")]
        public async Task<IActionResult> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();
            return Ok(new { success = true, data = reviews });
        }

        [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport")]
        [HttpPut("api/admin/reviews/{id}")]
        public async Task<IActionResult> ApproveReview(Guid id, [FromBody] bool approved)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.Approved = approved;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = approved ? "Review approved." : "Review hidden." });
        }

        [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport")]
        [HttpDelete("api/admin/reviews/{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.Deleted = true;
            review.DeletedDate = DateTime.UtcNow;
            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Review deleted successfully." });
        }
    }
}
