using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MughalSteelApi.Authentication;
using MughalSteelApi.Data;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Email == req.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Invalid email or password." });
            }

            var secret = _config["Jwt:Key"] ?? "IronCraftDoorsSuperSecretJWTKey2026";
            var issuer = _config["Jwt:Issuer"] ?? "MughalSteel";
            var audience = _config["Jwt:Audience"] ?? "MughalSteelWebsite";

            var token = JwtHelper.GenerateToken(user, secret, issuer, audience);

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Role = user.Role,
                Addresses = user.Addresses.Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    Country = a.Country,
                    IsDefault = a.IsDefault
                }).ToList()
            };

            return Ok(new
            {
                success = true,
                token,
                user = userDTO
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
            {
                return BadRequest(new { success = false, message = "Email is already registered." });
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Email = req.Email,
                PasswordHash = passwordHash,
                FirstName = req.FirstName,
                LastName = req.LastName,
                Phone = req.Phone,
                Role = "Customer"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var secret = _config["Jwt:Key"] ?? "IronCraftDoorsSuperSecretJWTKey2026";
            var issuer = _config["Jwt:Issuer"] ?? "MughalSteel";
            var audience = _config["Jwt:Audience"] ?? "MughalSteelWebsite";

            var token = JwtHelper.GenerateToken(user, secret, issuer, audience);

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Role = user.Role,
                Addresses = new()
            };

            return Ok(new
            {
                success = true,
                token,
                user = userDTO
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                return Unauthorized();

            var user = await _context.Users
                .Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var userDTO = new UserDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Role = user.Role,
                Addresses = user.Addresses.Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    Country = a.Country,
                    IsDefault = a.IsDefault
                }).ToList()
            };

            return Ok(new { success = true, user = userDTO });
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileUpdateRequest req)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { success = false, message = "User not found." });

            user.FirstName = req.FirstName;
            user.LastName = req.LastName;
            user.Phone = req.Phone;

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Profile updated successfully." });
        }

        [Authorize]
        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress([FromBody] AddressDTO req)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                return Unauthorized();

            var address = new Address
            {
                UserId = userId,
                Street = req.Street,
                City = req.City,
                State = req.State,
                ZipCode = req.ZipCode,
                Country = req.Country,
                IsDefault = req.IsDefault
            };

            if (address.IsDefault)
            {
                var others = await _context.Addresses.Where(a => a.UserId == userId).ToListAsync();
                foreach (var o in others) o.IsDefault = false;
            }

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, addressId = address.Id });
        }

        [Authorize]
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> RemoveAddress(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId)) 
                return Unauthorized();

            var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);
            if (address == null) return NotFound();

            address.Deleted = true;
            address.DeletedDate = DateTime.UtcNow;
            _context.Addresses.Update(address);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Address removed." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
            {
                return NotFound(new { success = false, message = "No account found with this email address." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Password updated successfully." });
        }
    }
}
