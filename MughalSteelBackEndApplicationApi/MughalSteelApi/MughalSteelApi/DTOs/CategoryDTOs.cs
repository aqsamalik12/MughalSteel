using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.DTOs
{
    public class CategoryResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Tagline { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HeroImage { get; set; } = string.Empty;
        public Guid? ParentCategoryId { get; set; }
        public List<string> Items { get; set; } = new();
        public List<string> PopularProducts { get; set; } = new();
    }

    public class CreateCategoryRequestDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Tagline { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string HeroImage { get; set; } = string.Empty;
        public Guid? ParentCategoryId { get; set; }
        public List<string> Items { get; set; } = new();
        public List<string> PopularProducts { get; set; } = new();
    }

    public class UpdateCategoryRequestDTO : CreateCategoryRequestDTO
    {
    }
}
