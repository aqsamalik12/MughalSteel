using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MughalSteelApi.Services
{
    public interface IVirtualTryOnService
    {
        Task<string> UploadFoyerImageAsync(IFormFile file);
        Task<string> AnalyzeImageAsync(string fileUrl);
        Task<List<double>> DetectDoorAreaAsync(string fileUrl);
        Task<string> GeneratePreviewAsync(string foyerImageUrl, string doorImageUrl, List<double>? bbox = null);
        Task<string> GetProcessingStatusAsync(string jobId);
        Task<bool> SaveResultAsync(string designId, string previewImageUrl);
    }

    public class MockVirtualTryOnService : IVirtualTryOnService
    {
        private readonly IFileStorageService _fileStorageService;

        public MockVirtualTryOnService(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService;
        }

        public async Task<string> UploadFoyerImageAsync(IFormFile file)
        {
            return await _fileStorageService.SaveFileAsync(file, "tryon_facades");
        }

        public async Task<string> AnalyzeImageAsync(string fileUrl)
        {
            await Task.Delay(500); // Simulate processing
            return $"job-{Guid.NewGuid().ToString()[..8]}";
        }

        public async Task<List<double>> DetectDoorAreaAsync(string fileUrl)
        {
            await Task.Delay(500);
            // Bounding box representation: [X, Y, Width, Height] normalized
            return new List<double> { 25.0, 10.0, 50.0, 80.0 };
        }

        public async Task<string> GeneratePreviewAsync(string foyerImageUrl, string doorImageUrl, List<double>? bbox = null)
        {
            await Task.Delay(800);
            // Returns the door image representing the mock generated preview
            return doorImageUrl;
        }

        public async Task<string> GetProcessingStatusAsync(string jobId)
        {
            await Task.Delay(100);
            return "Completed";
        }

        public async Task<bool> SaveResultAsync(string designId, string previewImageUrl)
        {
            await Task.Delay(100);
            return true;
        }
    }
}
