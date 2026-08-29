using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MughalSteelApi.DTOs;
using MughalSteelApi.Models;
using MughalSteelApi.Repositories.Interfaces;

namespace MughalSteelApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly ISettingsRepository _settingsRepository;

        public SettingsController(ISettingsRepository settingsRepository)
        {
            _settingsRepository = settingsRepository;
        }

        private static SettingsResponseDTO MapToDTO(WebsiteSettings s)
        {
            return new SettingsResponseDTO
            {
                CompanyName = s.CompanyName,
                Tagline = s.Tagline,
                Phone = s.Phone,
                WhatsappNumber = s.WhatsappNumber,
                Email = s.Email,
                SupportEmail = s.SupportEmail,
                StreetAddress = s.StreetAddress,
                Suite = s.Suite,
                City = s.City,
                State = s.State,
                ZipCode = s.ZipCode,
                Country = s.Country,
                BusinessHours = s.BusinessHours,
                GoogleMapsUrl = s.GoogleMapsUrl,
                Facebook = s.Facebook,
                Instagram = s.Instagram,
                LinkedIn = s.LinkedIn,
                Pinterest = s.Pinterest,
                Twitter = s.Twitter,
                YoutubeUrl = s.YoutubeUrl,
                Announcement = s.Announcement,
                ShippingCharge = s.ShippingCharge,
                FreeShippingThreshold = s.FreeShippingThreshold,
                TaxRate = s.TaxRate,
                Currency = s.Currency
            };
        }

        [HttpGet]
        public async Task<ActionResult<SettingsResponseDTO>> Get()
        {
            var settings = await _settingsRepository.GetSettingsAsync();
            return Ok(MapToDTO(settings));
        }

        [HttpPut]
        [Authorize(Roles = "SuperAdmin,Manager")]
        public async Task<ActionResult<SettingsResponseDTO>> Update([FromBody] UpdateSettingsRequestDTO dto)
        {
            var settings = await _settingsRepository.GetSettingsAsync();

            settings.CompanyName = dto.CompanyName;
            settings.Tagline = dto.Tagline;
            settings.Phone = dto.Phone;
            settings.WhatsappNumber = dto.WhatsappNumber;
            settings.Email = dto.Email;
            settings.SupportEmail = dto.SupportEmail;
            settings.StreetAddress = dto.StreetAddress;
            settings.Suite = dto.Suite;
            settings.City = dto.City;
            settings.State = dto.State;
            settings.ZipCode = dto.ZipCode;
            settings.Country = dto.Country;
            settings.BusinessHours = dto.BusinessHours;
            settings.GoogleMapsUrl = dto.GoogleMapsUrl;
            settings.Facebook = dto.Facebook;
            settings.Instagram = dto.Instagram;
            settings.LinkedIn = dto.LinkedIn;
            settings.Pinterest = dto.Pinterest;
            settings.Twitter = dto.Twitter;
            settings.YoutubeUrl = dto.YoutubeUrl;
            settings.Announcement = dto.Announcement;
            settings.ShippingCharge = dto.ShippingCharge;
            settings.FreeShippingThreshold = dto.FreeShippingThreshold;
            settings.TaxRate = dto.TaxRate;
            settings.Currency = dto.Currency;

            await _settingsRepository.UpdateSettingsAsync(settings);
            return Ok(MapToDTO(settings));
        }
    }
}
