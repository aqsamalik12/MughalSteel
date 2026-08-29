using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class User : BaseEntity
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "Customer"; // SuperAdmin, Manager, ProductManager, OrderManager, ContentManager, CustomerSupport, Customer

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        public List<Address> Addresses { get; set; } = new();
    }

    public class Role : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
    }

    public class Address : BaseEntity
    {
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public string Street { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string State { get; set; } = string.Empty;

        [Required]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = "Pakistan";

        public bool IsDefault { get; set; } = false;
    }
}
