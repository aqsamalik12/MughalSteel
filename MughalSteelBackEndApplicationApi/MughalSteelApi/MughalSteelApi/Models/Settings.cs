using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MughalSteelApi.Models
{
    public class ShippingZone : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string Regions { get; set; } = string.Empty; // e.g. "Punjab", "KPK,Sindh"

        [Column(TypeName = "decimal(18,2)")]
        public decimal Charge { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal FreeShippingThreshold { get; set; }

        public string DeliveryEstimate { get; set; } = "2-4 Weeks";
    }

    public class TaxSetting : BaseEntity
    {
        [Required]
        public string State { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,4)")]
        public decimal Rate { get; set; } = 0.0m;

        public bool Enabled { get; set; } = true;
    }
}
