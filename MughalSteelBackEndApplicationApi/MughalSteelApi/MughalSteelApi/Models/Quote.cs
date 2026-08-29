using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class Quote : BaseEntity
    {
        public string QuoteNumber { get; set; } = string.Empty;

        public Guid? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = "Rawalpindi / Islamabad";
        public string State { get; set; } = "Punjab / ICT";
        public string ZipCode { get; set; } = string.Empty;

        public string ProjectCategory { get; set; } = "Modern Home";
        public string ProjectType { get; set; } = string.Empty;
        public string ItemType { get; set; } = "Front Gates";
        public string ProductType { get; set; } = string.Empty;
        public string DoorStyle { get; set; } = string.Empty;

        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }

        public double WidthVal { get; set; } = 12;
        public double HeightVal { get; set; } = 7.5;
        public string Width { get; set; } = "12";
        public string Height { get; set; } = "7.5";
        public double TotalArea { get; set; } = 90;
        public int Quantity { get; set; } = 1;
        public int Qty { get; set; } = 1;

        public string Configuration { get; set; } = string.Empty;
        public string Finish { get; set; } = string.Empty;
        public string Glass { get; set; } = string.Empty;
        public string Hardware { get; set; } = string.Empty;

        [NotMapped]
        public List<string> Customizations { get; set; } = new();

        [NotMapped]
        public List<string> ReferenceImages { get; set; } = new();

        public string Notes { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; } = 0;

        public string Status { get; set; } = "Pending"; // Pending, Reviewed, Approved, Ordered, Cancelled
    }

    public class CustomDesign : BaseEntity
    {
        public Guid? CustomerId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public string Width { get; set; } = string.Empty;
        public string Height { get; set; } = string.Empty;

        public string Configuration { get; set; } = string.Empty;
        public string Finish { get; set; } = string.Empty;
        public string Glass { get; set; } = string.Empty;
        public string Hardware { get; set; } = string.Empty;
        public string Handle { get; set; } = string.Empty;
        public string Sidelights { get; set; } = string.Empty;
        public string Transom { get; set; } = string.Empty;
        public string Threshold { get; set; } = string.Empty;

        public string UploadedImages { get; set; } = string.Empty; // Comma-separated paths
        public string Notes { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal EstimatedPrice { get; set; } = 0;

        public string Status { get; set; } = "Draft"; // Draft, Saved, Submitted
    }
}
