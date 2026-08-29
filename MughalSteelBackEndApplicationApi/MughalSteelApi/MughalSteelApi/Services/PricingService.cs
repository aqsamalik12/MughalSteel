using System;
using System.Linq;
using MughalSteelApi.Models;

namespace MughalSteelApi.Services
{
    public interface IPricingService
    {
        decimal CalculateConfiguredPrice(Product product, decimal width, decimal height, string finish, string glass, string hardware, string sidelights, string transom);
        OrderPricingSummary CalculateOrderPricing(decimal subtotal, string state, decimal shippingChargeOverride = -1);
    }

    public class OrderPricingSummary
    {
        public decimal Subtotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }

    public class PricingService : IPricingService
    {
        public PricingService()
        {
        }

        public decimal CalculateConfiguredPrice(Product product, decimal width, decimal height, string finish, string glass, string hardware, string sidelights, string transom)
        {
            decimal price = product.BasePrice;

            // 1. Sizing adjustment
            // Base area assumed to be 36" x 96" = 3456 sq in.
            if (width > 0 && height > 0)
            {
                decimal baseArea = 36 * 96;
                decimal selectedArea = width * height;
                if (selectedArea > baseArea)
                {
                    decimal scaleFactor = 1 + ((selectedArea - baseArea) / baseArea) * 0.65m; // 65% scaling rate
                    price *= scaleFactor;
                }
            }

            // 2. Finish adjustment
            if (!string.IsNullOrEmpty(finish) && !finish.Equals("Matte Black", StringComparison.OrdinalIgnoreCase))
            {
                price += 250; // Premium finish surcharge
            }

            // 3. Glass adjustment
            if (!string.IsNullOrEmpty(glass) && !glass.Equals("Clear Low-E", StringComparison.OrdinalIgnoreCase) && !glass.Equals("Clear", StringComparison.OrdinalIgnoreCase))
            {
                price += 180; // Insulated textured/decorative glass surcharge
            }

            // 4. Hardware adjustment
            if (!string.IsNullOrEmpty(hardware) && !hardware.Equals("Standard Pull Handle", StringComparison.OrdinalIgnoreCase) && !hardware.Equals("Standard", StringComparison.OrdinalIgnoreCase))
            {
                price += 320; // Premium lockset / pulls surcharge
            }

            // 5. Sidelights and Transoms
            if (!string.IsNullOrEmpty(sidelights) && !sidelights.Equals("None", StringComparison.OrdinalIgnoreCase))
            {
                price += 950; // Integrated sidelight partition
            }
            if (!string.IsNullOrEmpty(transom) && !transom.Equals("None", StringComparison.OrdinalIgnoreCase))
            {
                price += 800; // Integrated arch/rectangular transom panel
            }

            return Math.Round(price, 2);
        }

        public OrderPricingSummary CalculateOrderPricing(decimal subtotal, string state, decimal shippingChargeOverride = -1)
        {
            // Shipping charges
            decimal shipping = 0;
            if (shippingChargeOverride >= 0)
            {
                shipping = shippingChargeOverride;
            }

            // Tax
            decimal taxRate = 0.0m;
            decimal tax = Math.Round(subtotal * taxRate, 2);
            decimal total = Math.Round(subtotal + shipping + tax, 2);

            return new OrderPricingSummary
            {
                Subtotal = subtotal,
                Shipping = shipping,
                Tax = tax,
                Total = total
            };
        }
    }
}
