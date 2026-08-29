using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Data;
using MughalSteelApi.Models;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/admin/notifications")]
    [Authorize(Roles = "SuperAdmin,Manager,CustomerSupport,ProductManager,OrderManager,ContentManager")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var list = await _context.Notifications
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();

            return Ok(new { success = true, data = list });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var notif = await _context.Notifications.FindAsync(id);
            if (notif == null) return NotFound();

            notif.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [HttpPut("mark-all-read")]
        public async Task<IActionResult> MarkAllRead()
        {
            var unread = await _context.Notifications.Where(n => !n.IsRead).ToListAsync();
            foreach (var n in unread)
            {
                n.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var notif = await _context.Notifications.FindAsync(id);
            if (notif == null) return NotFound();

            notif.Deleted = true;
            notif.DeletedDate = DateTime.UtcNow;
            _context.Notifications.Update(notif);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
