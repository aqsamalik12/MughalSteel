using System;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.DTOs
{
    public class ReviewResponseDTO
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
        public bool Approved { get; set; }
        public DateTime Date { get; set; }
    }

    public class CreateReviewRequestDTO
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        [Required]
        public string Comment { get; set; } = string.Empty;
    }

    public class SettingsResponseDTO
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Tagline { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string WhatsappNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SupportEmail { get; set; } = string.Empty;
        public string StreetAddress { get; set; } = string.Empty;
        public string Suite { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string BusinessHours { get; set; } = string.Empty;
        public string GoogleMapsUrl { get; set; } = string.Empty;
        public string Facebook { get; set; } = string.Empty;
        public string Instagram { get; set; } = string.Empty;
        public string LinkedIn { get; set; } = string.Empty;
        public string Pinterest { get; set; } = string.Empty;
        public string Twitter { get; set; } = string.Empty;
        public string YoutubeUrl { get; set; } = string.Empty;
        public string Announcement { get; set; } = string.Empty;
        public decimal ShippingCharge { get; set; }
        public decimal FreeShippingThreshold { get; set; }
        public decimal TaxRate { get; set; }
        public string Currency { get; set; } = "PKR";
    }

    public class UpdateSettingsRequestDTO : SettingsResponseDTO
    {
    }

    public class TestimonialResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        public string Comment { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
    }

    public class CreateTestimonialRequestDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public int Rating { get; set; } = 5;
        [Required]
        public string Comment { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
    }

    public class BlogPostResponseDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Tags { get; set; } = string.Empty;
        public string Status { get; set; } = "Published";
    }

    public class CreateBlogPostRequestDTO
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        [Required]
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = "Mughal Steel Lead Engineer";
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = "Steel Fabrication";
        public string Tags { get; set; } = string.Empty;
        public string Status { get; set; } = "Published";
    }
}
