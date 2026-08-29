using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MughalSteelApi.Data;
using MughalSteelApi.Models;
using MughalSteelApi.Services;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/media")]
    public class MediaController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly AppDbContext _context;

        public MediaController(IFileStorageService fileStorageService, AppDbContext context)
        {
            _fileStorageService = fileStorageService;
            _context = context;
        }

        [Authorize(Roles = "SuperAdmin,Manager,ProductManager,ContentManager")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string? type, [FromForm] string? altText)
        {
            try
            {
                var url = await _fileStorageService.SaveFileAsync(file, type ?? "images");

                var media = new MediaFile
                {
                    FileName = file.FileName,
                    Url = url,
                    Type = type ?? "Image",
                    Size = file.Length,
                    AltText = altText ?? string.Empty
                };

                _context.MediaFiles.Add(media);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, url, data = media });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [Authorize(Roles = "SuperAdmin,Manager,ProductManager,ContentManager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(Guid id)
        {
            var media = await _context.MediaFiles.FindAsync(id);
            if (media == null) return NotFound();

            _fileStorageService.DeleteFile(media.Url);
            media.Deleted = true;
            media.DeletedDate = DateTime.UtcNow;
            _context.MediaFiles.Update(media);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "File deleted successfully." });
        }
    }
}
