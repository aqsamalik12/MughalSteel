using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;
using MughalSteelApi.Repositories.Interfaces;
using MughalSteelApi.Services;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuoteController : ControllerBase
    {
        private readonly IQuoteRepository _quoteRepository;
        private readonly IEmailService _emailService;

        public QuoteController(IQuoteRepository quoteRepository, IEmailService emailService)
        {
            _quoteRepository = quoteRepository;
            _emailService = emailService;
        }

        private static QuoteResponseDTO MapToDTO(Quote q)
        {
            double.TryParse(q.Width, out var width);
            if (width == 0) width = q.WidthVal;

            double.TryParse(q.Height, out var height);
            if (height == 0) height = q.HeightVal;

            return new QuoteResponseDTO
            {
                Id = q.Id,
                QuoteNumber = string.IsNullOrEmpty(q.QuoteNumber) ? $"MSF-Q{q.Id.ToString()[..6].ToUpper()}" : q.QuoteNumber,
                UserId = q.UserId,
                CustomerName = string.IsNullOrEmpty(q.CustomerName) ? $"{q.FirstName} {q.LastName}".Trim() : q.CustomerName,
                CustomerEmail = string.IsNullOrEmpty(q.CustomerEmail) ? q.Email : q.CustomerEmail,
                CustomerPhone = string.IsNullOrEmpty(q.CustomerPhone) ? q.Phone : q.CustomerPhone,
                City = q.City,
                ProjectCategory = string.IsNullOrEmpty(q.ProjectCategory) ? q.ProjectType : q.ProjectCategory,
                ItemType = string.IsNullOrEmpty(q.ItemType) ? q.ProductType : q.ItemType,
                ProductId = q.ProductId,
                ProductCode = q.ProductCode,
                ProductName = q.ProductName,
                Width = width,
                Height = height,
                TotalArea = q.TotalArea > 0 ? q.TotalArea : (width * height),
                Quantity = q.Quantity > 0 ? q.Quantity : q.Qty,
                EstimatedPrice = q.EstimatedPrice,
                Status = q.Status,
                Notes = q.Notes,
                Customizations = q.Customizations ?? new List<string>(),
                ReferenceImages = q.ReferenceImages ?? new List<string>(),
                CreatedDate = q.CreatedDate
            };
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Manager,OrderManager")]
        public async Task<ActionResult<IEnumerable<QuoteResponseDTO>>> GetAll([FromQuery] string? status)
        {
            IEnumerable<Quote> quotes;
            if (!string.IsNullOrWhiteSpace(status))
            {
                quotes = await _quoteRepository.GetByStatusAsync(status);
            }
            else
            {
                quotes = await _quoteRepository.GetAllAsync();
            }

            return Ok(quotes.Select(MapToDTO));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuoteResponseDTO>> GetById(string id)
        {
            Quote? quote = null;
            if (Guid.TryParse(id, out var guidId))
            {
                quote = await _quoteRepository.GetByIdAsync(guidId);
            }

            if (quote == null)
            {
                quote = await _quoteRepository.GetByQuoteNumberAsync(id);
            }

            if (quote == null) return NotFound(new { message = "Quote not found." });
            return Ok(MapToDTO(quote));
        }

        [HttpPost]
        public async Task<ActionResult<QuoteResponseDTO>> Create([FromBody] CreateQuoteRequestDTO dto)
        {
            var area = dto.Width * dto.Height;
            var estimatedPrice = (decimal)(area * 2500.0 * dto.Quantity);
            var quoteNumber = $"MSF-Q{DateTime.UtcNow:yyMMdd}-{new Random().Next(1000, 9999)}";

            var nameParts = dto.CustomerName.Split(' ', 2);
            var firstName = nameParts[0];
            var lastName = nameParts.Length > 1 ? nameParts[1] : "";

            var quote = new Quote
            {
                QuoteNumber = quoteNumber,
                UserId = dto.UserId,
                CustomerName = dto.CustomerName,
                FirstName = firstName,
                LastName = lastName,
                CustomerEmail = dto.CustomerEmail,
                Email = dto.CustomerEmail,
                CustomerPhone = dto.CustomerPhone,
                Phone = dto.CustomerPhone,
                City = dto.City,
                ProjectCategory = dto.ProjectCategory,
                ProjectType = dto.ProjectCategory,
                ItemType = dto.ItemType,
                ProductType = dto.ItemType,
                ProductId = dto.ProductId,
                ProductCode = dto.ProductCode,
                ProductName = dto.ProductName,
                Width = dto.Width.ToString(),
                Height = dto.Height.ToString(),
                WidthVal = dto.Width,
                HeightVal = dto.Height,
                TotalArea = area,
                Quantity = dto.Quantity,
                Qty = dto.Quantity,
                EstimatedPrice = estimatedPrice,
                Status = "Pending",
                Notes = dto.Notes,
                Customizations = dto.Customizations,
                ReferenceImages = dto.ReferenceImages
            };

            await _quoteRepository.AddAsync(quote);

            try
            {
                if (!string.IsNullOrWhiteSpace(dto.CustomerEmail))
                {
                    await _emailService.SendEmailAsync(
                        dto.CustomerEmail,
                        $"Mughal Steel Quote Received - {quoteNumber}",
                        $"Dear {dto.CustomerName},<br/><br/>We have received your quotation request for {dto.ProjectCategory} - {dto.ItemType}. Our engineering estimator will review your dimensions ({dto.Width}ft x {dto.Height}ft) and contact you shortly."
                    );
                }
            }
            catch
            {
                // Non-blocking
            }

            return CreatedAtAction(nameof(GetById), new { id = quote.Id }, MapToDTO(quote));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "SuperAdmin,Manager,OrderManager")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateQuoteStatusDTO dto)
        {
            var quote = await _quoteRepository.GetByIdAsync(id);
            if (quote == null) return NotFound();

            quote.Status = dto.Status;
            if (dto.EstimatedPrice.HasValue)
            {
                quote.EstimatedPrice = dto.EstimatedPrice.Value;
            }

            await _quoteRepository.UpdateAsync(quote);
            return NoContent();
        }
    }
}
