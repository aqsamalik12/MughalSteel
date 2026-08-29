using System;
using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MughalSteelApi.Data;

namespace MughalSteelApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string bodyHtml);
        Task SendWelcomeEmailAsync(string toEmail, string name);
        Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total);
        Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string status);
        Task SendQuoteReceivedAsync(string toEmail, string quoteId, string productStyle);
        Task SendQuoteResponseAsync(string toEmail, string quoteId, decimal price, string notes);
        Task SendQuoteApprovedNotificationAsync(string adminEmail, string quoteNumber);
        Task SendContactConfirmationAsync(string toEmail, string name);
        Task SendAdminNewOrderNotificationAsync(string adminEmail, string orderNumber, string customer, decimal total);
        Task SendAdminNewQuoteNotificationAsync(string adminEmail, string quoteId, string customer);
        Task SendLowStockAlertAsync(string adminEmail, string sku, int stock);
        Task SendReviewRequestAsync(string toEmail, string productName, string productId);
    }

    public class EmailService : IEmailService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly string _logPath;

        public EmailService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "emails_sent.log");
        }

        private async Task<string> BuildTemplateAsync(string title, string contentHtml)
        {
            var settings = await _context.WebsiteSettings.FirstOrDefaultAsync();
            var company = settings?.CompanyName ?? "Mughal Steel Fabrication";
            var email = settings?.Email ?? "mughalsteelfabrication51@gmail.com";
            var phone = settings?.Phone ?? "+92 300 1234567";

            var address = settings != null 
                ? $"{settings.StreetAddress}, {settings.City}, {settings.State} {settings.ZipCode}" 
                : "Plot 42, Sector I-9 Industrial Area, Rawalpindi / Islamabad, Pakistan";

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>{title}</title>
    <style>
        body {{ font-family: 'Outfit', 'Inter', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; color: #333; }}
        .container {{ max-width: 600px; background-color: #fff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }}
        .header {{ background-color: #111; color: #fff; padding: 30px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 22px; letter-spacing: 2px; color: #d4af37; }}
        .content {{ padding: 30px; line-height: 1.6; font-size: 15px; }}
        .btn {{ display: inline-block; padding: 12px 24px; background-color: #d4af37; color: #111; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; letter-spacing: 1px; }}
        .footer {{ background-color: #1a1a1a; color: #888; padding: 20px 30px; font-size: 12px; text-align: center; line-height: 1.5; }}
        .footer a {{ color: #d4af37; text-decoration: none; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th, td {{ padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }}
        th {{ background-color: #f9f9f9; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>{company.ToUpper()}</h1>
        </div>
        <div class='content'>
            {contentHtml}
        </div>
        <div class='footer'>
            <p>{address}</p>
            <p>Phone: {phone} | Email: <a href='mailto:{email}'>{email}</a></p>
            <p>&copy; 2026 {company}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }

        public async Task SendEmailAsync(string toEmail, string subject, string bodyHtml)
        {
            var host = _config["Email:Host"];
            var portStr = _config["Email:Port"];
            var username = _config["Email:Username"];
            var password = _config["Email:Password"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username))
            {
                var logMessage = $"[{DateTime.UtcNow}] TO: {toEmail}\nSUBJECT: {subject}\nBODY:\n{bodyHtml}\n=========================================\n\n";
                await File.AppendAllTextAsync(_logPath, logMessage);
                Console.WriteLine($"[Email Service] SMTP unset. Logged email to {toEmail} regarding '{subject}'.");
                return;
            }

            int port = 587;
            int.TryParse(portStr, out port);

            using var mail = new MailMessage();
            mail.From = new MailAddress(username);
            mail.To.Add(toEmail);
            mail.Subject = subject;
            mail.Body = bodyHtml;
            mail.IsBodyHtml = true;

            using var smtp = new SmtpClient(host, port);
            smtp.Credentials = new System.Net.NetworkCredential(username, password);
            smtp.EnableSsl = true;
            await smtp.SendMailAsync(mail);
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string name)
        {
            var html = await BuildTemplateAsync("Welcome to Mughal Steel Fabrication", $@"
                <h2>Welcome, {name}!</h2>
                <p>Thank you for creating an account with Mughal Steel Fabrication. Explore our bespoke collections of CNC laser cut gates, architectural steel pivot doors, and custom railings.</p>
                <a href='http://localhost:5173/shop' class='btn'>BROWSE CATALOG</a>");
            await SendEmailAsync(toEmail, "Welcome to Mughal Steel Fabrication", html);
        }

        public async Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
            if (order == null) return;

            var itemsHtml = "";
            foreach (var item in order.Items)
            {
                itemsHtml += $@"
                <tr>
                    <td>{item.ProductName}<br/><small>Finish: {item.SelectedFinish}, Glass: {item.SelectedGlass}, Hardware: {item.SelectedHardware}</small></td>
                    <td>{item.Quantity}</td>
                    <td>PKR {item.Price:N0}</td>
                </tr>";
            }

            var html = await BuildTemplateAsync($"Order Confirmed {orderNumber}", $@"
                <h2>Thank You For Your Order!</h2>
                <p>Your order <strong>#{orderNumber}</strong> has been confirmed and is entering manufacturing scheduling.</p>
                <h3>Order Summary</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsHtml}
                    </tbody>
                </table>
                <p style='margin-top: 15px;'>
                    Subtotal: PKR {order.Subtotal:N0}<br/>
                    Shipping: PKR {order.ShippingCharge:N0}<br/>
                    Tax: PKR {order.TaxCharge:N0}<br/>
                    <strong>Total: PKR {order.Total:N0}</strong>
                </p>
                <p><strong>Site Delivery Address:</strong><br/>{order.Street}, {order.City}, {order.State} {order.ZipCode}, {order.Country}</p>");
            
            await SendEmailAsync(toEmail, $"Mughal Steel - Order Confirmed #{orderNumber}", html);
        }

        public async Task SendOrderStatusUpdateAsync(string toEmail, string orderNumber, string status)
        {
            var html = await BuildTemplateAsync("Order Status Update", $@"
                <h2>Order Update</h2>
                <p>Your order <strong>#{orderNumber}</strong> status has been updated to: <strong>{status}</strong>.</p>
                <a href='http://localhost:5173/account' class='btn'>VIEW ACCOUNT</a>");
            await SendEmailAsync(toEmail, $"Mughal Steel - Order #{orderNumber} Status: {status}", html);
        }

        public async Task SendQuoteReceivedAsync(string toEmail, string quoteId, string productStyle)
        {
            var html = await BuildTemplateAsync("Quote Request Received", $@"
                <h2>We Received Your Quote Request</h2>
                <p>Thank you for submitting a custom request for <strong>{productStyle}</strong>. Reference ID: <strong>{quoteId}</strong>.</p>
                <p>Our drafting and structural teams are reviewing your measurements. We will notify you as soon as your estimate is ready.</p>");
            await SendEmailAsync(toEmail, "Mughal Steel - Quote Request Received", html);
        }

        public async Task SendQuoteResponseAsync(string toEmail, string quoteId, decimal price, string notes)
        {
            var quote = await _context.Quotes.FirstOrDefaultAsync(q => q.QuoteNumber == quoteId || q.Id.ToString() == quoteId);
            if (quote == null) return;

            var html = await BuildTemplateAsync("Custom Quote Estimate Ready", $@"
                <h2>Your Custom Estimate is Ready</h2>
                <p>We are pleased to provide a pricing response for Quote <strong>#{quoteId}</strong>.</p>
                <p><strong>Item:</strong> {quote.ItemType}<br/>
                   <strong>Dimensions:</strong> {quote.Width}ft x {quote.Height}ft (Qty: {quote.Quantity})</p>
                <h3>Estimated Price: PKR {price:N0}</h3>
                <p><strong>Notes:</strong> {notes}</p>
                <p><strong>Validity Date:</strong> 30 Days.</p>
                <a href='http://localhost:5173/account/quotes' class='btn'>VIEW QUOTE</a>");
            await SendEmailAsync(toEmail, $"Mughal Steel - Custom Quote #{quoteId} Ready", html);
        }

        public async Task SendQuoteApprovedNotificationAsync(string adminEmail, string quoteNumber)
        {
            var html = await BuildTemplateAsync("Quote Accepted", $@"
                <h2>Quote Accepted</h2>
                <p>Customer has officially accepted Quote <strong>#{quoteNumber}</strong>.</p>");
            await SendEmailAsync(adminEmail, $"[Admin Alert] Quote #{quoteNumber} Accepted", html);
        }

        public async Task SendContactConfirmationAsync(string toEmail, string name)
        {
            var html = await BuildTemplateAsync("Message Received", $@"
                <h2>We Received Your Query, {name}</h2>
                <p>Thank you for contacting Mughal Steel Fabrication. An engineering consultant will respond to your query shortly.</p>");
            await SendEmailAsync(toEmail, "Mughal Steel - Contact Form Received", html);
        }

        public async Task SendAdminNewOrderNotificationAsync(string adminEmail, string orderNumber, string customer, decimal total)
        {
            var html = await BuildTemplateAsync("New Order Received", $@"
                <h2>[Admin Alert] New Order Placed</h2>
                <p>Order Number: <strong>{orderNumber}</strong><br/>
                   Customer: {customer}<br/>
                   Total amount: PKR {total:N0}</p>
                <a href='http://localhost:5173/admin/orders' class='btn'>OPEN ORDER DASHBOARD</a>");
            await SendEmailAsync(adminEmail, $"[New Order Alert] {orderNumber} - PKR {total:N0}", html);
        }

        public async Task SendAdminNewQuoteNotificationAsync(string adminEmail, string quoteId, string customer)
        {
            var html = await BuildTemplateAsync("New Quote Request", $@"
                <h2>[Admin Alert] New Custom Quote Requested</h2>
                <p>Quote Reference: <strong>{quoteId}</strong><br/>
                   Customer: {customer}</p>
                <a href='http://localhost:5173/admin/quotes' class='btn'>REVIEW QUOTE</a>");
            await SendEmailAsync(adminEmail, $"[New Quote Request] ID: {quoteId}", html);
        }

        public async Task SendLowStockAlertAsync(string adminEmail, string sku, int stock)
        {
            var html = await BuildTemplateAsync("Low Stock Warning", $@"
                <h2>[Inventory Alert] Product Stock Low</h2>
                <p>Product SKU: <strong>{sku}</strong> is running low on stock.<br/>
                   Current quantity: <strong>{stock}</strong> units.</p>");
            await SendEmailAsync(adminEmail, $"[Low Stock Warning] SKU: {sku}", html);
        }

        public async Task SendReviewRequestAsync(string toEmail, string productName, string productId)
        {
            var html = await BuildTemplateAsync("Leave a Review", $@"
                <h2>How Do You Like Your {productName}?</h2>
                <p>We hope our steel fabrication has elevated your residential property. We'd love to hear your feedback!</p>
                <a href='http://localhost:5173/product/{productId}' class='btn'>WRITE A REVIEW</a>");
            await SendEmailAsync(toEmail, $"Mughal Steel - Review Your {productName}", html);
        }
    }
}
