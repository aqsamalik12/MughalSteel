using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;
using MughalSteelApi.Services;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPricingService _pricingService;
        private readonly IEmailService _emailService;

        public OrderController(AppDbContext context, IPricingService pricingService, IEmailService emailService)
        {
            _context = context;
            _pricingService = pricingService;
            _emailService = emailService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? 
                           User.FindFirst("role")?.Value ?? "";
            
            var isAdmin = userRole == "SuperAdmin" || userRole == "Manager" || userRole == "OrderManager";

            if (isAdmin)
            {
                var allOrders = await _context.Orders
                    .Include(o => o.Items)
                    .OrderByDescending(o => o.CreatedDate)
                    .ToListAsync();
                return Ok(allOrders);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                return Unauthorized();

            var customerOrders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedDate)
                .ToListAsync();

            return Ok(customerOrders);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(Guid id)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? 
                           User.FindFirst("role")?.Value ?? "";
            
            var isAdmin = userRole == "SuperAdmin" || userRole == "Manager" || userRole == "OrderManager";

            Order? order = null;
            if (isAdmin)
            {
                order = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id);
            }
            else
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                    return Unauthorized();

                order = await _context.Orders
                    .Include(o => o.Items)
                    .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
            }

            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateRequest req)
        {
            Guid? userId = req.UserId;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
            {
                userId = parsedUserId;
            }

            decimal subtotal = 0;
            var order = new Order
            {
                UserId = userId,
                OrderNumber = $"MSF-ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}",
                Email = req.Email,
                FirstName = req.FirstName,
                LastName = req.LastName,
                Phone = req.Phone,
                Street = req.Street,
                City = req.City,
                State = req.State,
                ZipCode = req.ZipCode,
                Country = req.Country,
                OrderStatus = "Pending",
                Notes = req.Notes
            };

            foreach (var item in req.Items)
            {
                var prod = await _context.Products.FindAsync(item.ProductId);
                if (prod == null) return BadRequest(new { success = false, message = $"Product {item.ProductId} not found." });

                if (prod.StockQuantity < item.Quantity)
                {
                    return BadRequest(new { success = false, message = $"Insufficient inventory for {prod.Name}." });
                }

                decimal itemPrice = prod.SalePrice ?? prod.BasePrice;

                decimal.TryParse(item.SelectedWidth, out var w);
                decimal.TryParse(item.SelectedHeight, out var h);
                itemPrice = _pricingService.CalculateConfiguredPrice(prod, w, h, item.SelectedFinish, item.SelectedGlass, item.SelectedHardware, item.SelectedSidelights, item.SelectedTransom);

                subtotal += itemPrice * item.Quantity;
                prod.StockQuantity -= item.Quantity;

                order.Items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    SKU = item.SKU,
                    Price = itemPrice,
                    Quantity = item.Quantity,
                    SelectedWidth = item.SelectedWidth,
                    SelectedHeight = item.SelectedHeight,
                    SelectedFinish = item.SelectedFinish,
                    SelectedGlass = item.SelectedGlass,
                    SelectedHardware = item.SelectedHardware,
                    SelectedSidelights = item.SelectedSidelights,
                    SelectedTransom = item.SelectedTransom
                });
            }

            var summary = _pricingService.CalculateOrderPricing(subtotal, req.State);

            order.Subtotal = summary.Subtotal;
            order.ShippingCharge = summary.Shipping;
            order.TaxCharge = summary.Tax;
            order.Total = summary.Total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendOrderConfirmationAsync(order.Email, order.OrderNumber, order.Total);
            }
            catch { }

            _context.ActivityLogs.Add(new ActivityLog
            {
                Action = "Created Order",
                Entity = "Order",
                EntityId = order.Id.ToString(),
                Description = $"Order #{order.OrderNumber} placed for {order.FirstName} {order.LastName}. Total: PKR {order.Total:N0}",
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { success = true, orderId = order.Id, orderNumber = order.OrderNumber, data = order });
        }

        [Authorize(Roles = "SuperAdmin,Manager,OrderManager")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.OrderStatus = status;
            await _context.SaveChangesAsync();

            try
            {
                await _emailService.SendOrderStatusUpdateAsync(order.Email, order.OrderNumber, status);
            }
            catch { }

            var adminUser = User.FindFirst(ClaimTypes.Email)?.Value ?? "Admin";
            _context.ActivityLogs.Add(new ActivityLog
            {
                AdminUser = adminUser,
                Action = "Updated Order Status",
                Entity = "Order",
                EntityId = order.Id.ToString(),
                Description = $"Status of Order #{order.OrderNumber} updated to {status} by {adminUser}.",
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Order status updated successfully." });
        }
    }
}
