using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.DTOs
{
    public class OrderCreateRequest
    {
        public Guid? UserId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Street { get; set; } = string.Empty;
        [Required]
        public string City { get; set; } = string.Empty;
        [Required]
        public string State { get; set; } = string.Empty;
        [Required]
        public string ZipCode { get; set; } = string.Empty;
        public string Country { get; set; } = "Pakistan";

        public string Notes { get; set; } = string.Empty;

        [Required]
        public List<OrderItemCreateRequest> Items { get; set; } = new();
    }

    public class OrderItemCreateRequest
    {
        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public string ProductName { get; set; } = string.Empty;

        public string SKU { get; set; } = string.Empty;

        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public string SelectedWidth { get; set; } = string.Empty;
        public string SelectedHeight { get; set; } = string.Empty;
        public string SelectedFinish { get; set; } = string.Empty;
        public string SelectedGlass { get; set; } = string.Empty;
        public string SelectedHardware { get; set; } = string.Empty;
        public string SelectedSidelights { get; set; } = string.Empty;
        public string SelectedTransom { get; set; } = string.Empty;
    }
}
