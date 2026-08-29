using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class Category : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Slug { get; set; } = string.Empty;

        public string Tagline { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HeroImage { get; set; } = string.Empty;

        [NotMapped]
        public List<string> Items { get; set; } = new();

        [NotMapped]
        public List<string> PopularProducts { get; set; } = new();

        public Guid? ParentCategoryId { get; set; }

        [ForeignKey("ParentCategoryId")]
        public Category? ParentCategory { get; set; }

        public List<Category> SubCategories { get; set; } = new();
    }

    public class Product : BaseEntity
    {
        public string ProductCode { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Slug { get; set; } = string.Empty;

        public string SKU { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string ShortDescription { get; set; } = string.Empty;

        public string CategoryName { get; set; } = "Modern Home";
        public string Item { get; set; } = "Front Gates";

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerSqFt { get; set; } = 2500;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SalePrice { get; set; }

        public int StockQuantity { get; set; } = 5;
        public int LowStockThreshold { get; set; } = 2;

        public Guid? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        public string FrontImage { get; set; } = string.Empty;
        public string BackImage { get; set; } = string.Empty;
        public string SideImage { get; set; } = string.Empty;
        public string DetailImage { get; set; } = string.Empty;
        public string InstallationImage { get; set; } = string.Empty;

        public string Material { get; set; } = "14-Gauge Heavy MS Steel";
        public string Style { get; set; } = "Modern CNC Laser Geometric";
        public string Application { get; set; } = "Exterior Main Villa Gate";
        public string Availability { get; set; } = "in-stock";

        public double Rating { get; set; } = 5.0;

        public string Widths { get; set; } = "10,12,14,16";
        public string Heights { get; set; } = "6.5,7,7.5,8";
        public string FinishesList { get; set; } = "Electrostatic Matte Charcoal,Metallic Gold Patina";
        public string GlassList { get; set; } = "Clear,Frosted";
        public string HardwareList { get; set; } = "Standard Pull Handle";
        public string CustomizationList { get; set; } = "Wicket Gate Cutout,Smart Motor Mount";
        public string TagsList { get; set; } = "CNC Laser,Modern Gate,14G Steel";

        public string Configuration { get; set; } = string.Empty;
        public string SwingDirection { get; set; } = string.Empty;
        public string Threshold { get; set; } = string.Empty;
        public string InstallationInfo { get; set; } = string.Empty;
        public string ShippingInfo { get; set; } = string.Empty;
        public string WarrantyInfo { get; set; } = string.Empty;

        public bool Featured { get; set; } = false;
        public bool NewArrival { get; set; } = false;
        public bool OnSale { get; set; } = false;
        public bool IsDemoVisual { get; set; } = false;
        public string Status { get; set; } = "Active"; // Active, Draft, Archived

        public string SeoTitle { get; set; } = string.Empty;
        public string SeoDescription { get; set; } = string.Empty;

        public List<ProductImage> Images { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
    }

    public class ProductImage : BaseEntity
    {
        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ImageType { get; set; } = "Front";
        public string AltText { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }

    public class Finish : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }

    public class GlassOption : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }

    public class HardwareOption : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }
}
