using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class Order : BaseEntity
    {
        public string OrderNumber { get; set; } = string.Empty;

        public Guid? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
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

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingCharge { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxCharge { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }

        public string OrderStatus { get; set; } = "Pending"; // Pending, Confirmed, InProduction, Ready, Delivered, Cancelled
        public string Notes { get; set; } = string.Empty;

        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem : BaseEntity
    {
        [Required]
        public Guid OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [Required]
        public string ProductName { get; set; } = string.Empty;

        public string SKU { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
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
