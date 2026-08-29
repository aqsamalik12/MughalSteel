using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MughalSteelApi.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, string subFolder = "images");
        void DeleteFile(string fileUrl);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly string _webRootPath;

        public FileStorageService(string webRootPath)
        {
            _webRootPath = !string.IsNullOrEmpty(webRootPath) 
                ? webRootPath 
                : Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot");
        }

        public async Task<string> SaveFileAsync(IFormFile file, string subFolder = "images")
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Uploaded file cannot be empty.");

            var folderPath = Path.Combine(_webRootPath, "uploads", subFolder);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var extension = Path.GetExtension(file.FileName).ToLower();
            // Validate image or document extensions
            var allowed = new[] { ".png", ".jpg", ".jpeg", ".webp", ".pdf", ".mov", ".mp4" };
            if (!System.Linq.Enumerable.Contains(allowed, extension))
            {
                throw new InvalidOperationException("Unsupported file type.");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(folderPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{subFolder}/{uniqueFileName}";
        }

        public void DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            var relativePath = fileUrl.TrimStart('/');
            var absolutePath = Path.Combine(_webRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(absolutePath))
            {
                File.Delete(absolutePath);
            }
        }
    }
}
