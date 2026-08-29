using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.DTOs
{
    public class ProductResponseDTO
    {
        public Guid Id { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Item { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal PricePerSqFt { get; set; }
        public decimal? SalePrice { get; set; }
        public string FrontImage { get; set; } = string.Empty;
        public string BackImage { get; set; } = string.Empty;
        public string SideImage { get; set; } = string.Empty;
        public string DetailImage { get; set; } = string.Empty;
        public string InstallationImage { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new();
        public List<string> Materials { get; set; } = new();
        public List<string> Finishes { get; set; } = new();
        public string Style { get; set; } = string.Empty;
        public string Application { get; set; } = string.Empty;
        public List<string> AvailableSizes { get; set; } = new();
        public List<double> Width { get; set; } = new();
        public List<double> Height { get; set; } = new();
        public List<string> Customization { get; set; } = new();
        public string Availability { get; set; } = "in-stock";
        public int Stock { get; set; }
        public double Rating { get; set; } = 5.0;
        public List<string> Tags { get; set; } = new();
        public List<string> RelatedProducts { get; set; } = new();
        public bool Featured { get; set; }
        public bool NewArrival { get; set; }
        public bool OnSale { get; set; }
        public bool IsDemoVisual { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedDate { get; set; }
    }

    public class CreateProductRequestDTO
    {
        [Required]
        public string ProductCode { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public string Item { get; set; } = string.Empty;

        public string ShortDescription { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal PricePerSqFt { get; set; } = 2500;
        public decimal? SalePrice { get; set; }
        public string FrontImage { get; set; } = string.Empty;
        public string BackImage { get; set; } = string.Empty;
        public string SideImage { get; set; } = string.Empty;
        public string DetailImage { get; set; } = string.Empty;
        public string InstallationImage { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new();
        public List<string> Materials { get; set; } = new();
        public List<string> Finishes { get; set; } = new();
        public string Style { get; set; } = string.Empty;
        public string Application { get; set; } = string.Empty;
        public List<string> AvailableSizes { get; set; } = new();
        public List<double> Width { get; set; } = new();
        public List<double> Height { get; set; } = new();
        public List<string> Customization { get; set; } = new();
        public string Availability { get; set; } = "in-stock";
        public int Stock { get; set; } = 5;
        public List<string> Tags { get; set; } = new();
        public bool Featured { get; set; }
        public bool NewArrival { get; set; }
        public bool OnSale { get; set; }
        public bool IsDemoVisual { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class UpdateProductRequestDTO : CreateProductRequestDTO
    {
    }
}
