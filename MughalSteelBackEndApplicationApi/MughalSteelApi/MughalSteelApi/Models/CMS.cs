using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class Review : BaseEntity
    {
        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public int Rating { get; set; } = 5;

        [Required]
        public string Comment { get; set; } = string.Empty;

        public bool Approved { get; set; } = false;

        public DateTime Date { get; set; } = DateTime.UtcNow;
    }

    public class BlogPost : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string Summary { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Author { get; set; } = "Mughal Steel Lead Engineer";
        public string Category { get; set; } = "Design";
        public string Tags { get; set; } = string.Empty; // Comma separated list
        public string Status { get; set; } = "Published"; // Draft, Published, Scheduled
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }

    public class Testimonial : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        [Required]
        public string Comment { get; set; } = string.Empty;

        public int Rating { get; set; } = 5;
        public bool Active { get; set; } = true;
    }

    public class ContactMessage : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string Status { get; set; } = "Unread"; // Unread, Read, Replied, Archived
    }

    public class WebsiteSettings : BaseEntity
    {
        [Required]
        public string CompanyName { get; set; } = "Mughal Steel Fabrication";

        public string Tagline { get; set; } = "Excellence in Metalwork & Architectural Fabrication";
        public string Phone { get; set; } = "+92 300 1234567";
        public string WhatsappNumber { get; set; } = "+92 323 9898317";
        public string Email { get; set; } = "mughalsteelfabrication51@gmail.com";
        public string SupportEmail { get; set; } = "mughalsteelfabrication51@gmail.com";

        public string StreetAddress { get; set; } = "Plot 42, Sector I-9 Industrial Area";
        public string Suite { get; set; } = string.Empty;
        public string City { get; set; } = "Rawalpindi / Islamabad";
        public string State { get; set; } = "Punjab / ICT";
        public string ZipCode { get; set; } = "46000";
        public string Country { get; set; } = "Pakistan";
        public string BusinessHours { get; set; } = "Monday - Saturday: 8:30 AM - 8:30 PM";

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingCharge { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal FreeShippingThreshold { get; set; } = 0;

        [Column(TypeName = "decimal(18,4)")]
        public decimal TaxRate { get; set; } = 0.0m;

        public string GoogleMapsUrl { get; set; } = string.Empty;
        public string Currency { get; set; } = "PKR";

        public string Facebook { get; set; } = string.Empty;
        public string Instagram { get; set; } = string.Empty;
        public string LinkedIn { get; set; } = string.Empty;
        public string Pinterest { get; set; } = string.Empty;
        public string Twitter { get; set; } = string.Empty;
        public string YoutubeUrl { get; set; } = string.Empty;
        public string Announcement { get; set; } = string.Empty;
    }

    public class PortfolioProject : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = "Main Gates";

        public string ShortDescription { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = "Islamabad, Pakistan";
        public string ProjectType { get; set; } = "Residential Project";
        public string ClientType { get; set; } = "Private Residence";
        public string Duration { get; set; } = "14 Days";
        public string Materials { get; set; } = "Mild Steel, CNC Laser Cut Sheet, Powder Coating";
        public string Services { get; set; } = "Design, Fabrication, Installation";
        public string CoverImage { get; set; } = string.Empty;
        public string MainImageUrl { get; set; } = string.Empty;
        public string ImagesList { get; set; } = string.Empty; // JSON or comma-separated URLs (Front, Detail, Side, Installed)
        public string SpecsJson { get; set; } = string.Empty; // JSON metadata for specs
        public string DeliverablesJson { get; set; } = string.Empty; // JSON deliverables list
        public string CompletedDate { get; set; } = "2026";
        public bool Featured { get; set; } = false;
        public int DisplayOrder { get; set; } = 0;
        public string Status { get; set; } = "Completed"; // Completed, In Progress, Published, Draft
    }

    public class GalleryProject : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;
        public string Style { get; set; } = string.Empty;
        public string CoverImage { get; set; } = string.Empty;
        public string ImagesList { get; set; } = string.Empty; // Comma separated urls
        public string Tags { get; set; } = string.Empty; // Comma separated
        public bool Featured { get; set; } = false;
    }

    public class MediaFile : BaseEntity
    {
        [Required]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string Url { get; set; } = string.Empty;

        public string Type { get; set; } = "Image"; // Image, PDF, Video
        public long Size { get; set; }
        public string AltText { get; set; } = string.Empty;
    }

    public class ActivityLog : BaseEntity
    {
        public string AdminUser { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string IpAddress { get; set; } = string.Empty;
    }

    public class Notification : BaseEntity
    {
        public Guid? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string Type { get; set; } = "Order";

        public bool IsRead { get; set; } = false;
    }

    public class BackupLog : BaseEntity
    {
        public DateTime BackupDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string FileName { get; set; } = string.Empty;

        public string Status { get; set; } = "Success";

        public long Size { get; set; }
    }
}
