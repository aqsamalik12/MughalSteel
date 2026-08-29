using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.DTOs
{
    public class QuoteResponseDTO
    {
        public Guid Id { get; set; }
        public string QuoteNumber { get; set; } = string.Empty;
        public Guid? UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string ProjectCategory { get; set; } = string.Empty;
        public string ItemType { get; set; } = string.Empty;
        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double TotalArea { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal EstimatedPrice { get; set; }
        public string Status { get; set; } = "Pending";
        public string Notes { get; set; } = string.Empty;
        public List<string> Customizations { get; set; } = new();
        public List<string> ReferenceImages { get; set; } = new();
        public DateTime CreatedDate { get; set; }
    }

    public class CreateQuoteRequestDTO
    {
        public Guid? UserId { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;
        public string City { get; set; } = "Rawalpindi / Islamabad";
        public string ProjectCategory { get; set; } = "Modern Home";
        public string ItemType { get; set; } = "Front Gates";
        public Guid? ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public double Width { get; set; } = 12;
        public double Height { get; set; } = 7.5;
        public int Quantity { get; set; } = 1;
        public string Notes { get; set; } = string.Empty;
        public List<string> Customizations { get; set; } = new();
        public List<string> ReferenceImages { get; set; } = new();
    }

    public class UpdateQuoteStatusDTO
    {
        [Required]
        public string Status { get; set; } = "Pending";
        public decimal? EstimatedPrice { get; set; }
    }
}
