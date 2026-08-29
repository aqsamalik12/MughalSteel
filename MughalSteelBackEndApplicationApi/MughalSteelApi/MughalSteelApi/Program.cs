using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MughalSteelApi.Data;
using MughalSteelApi.Middleware;
using MughalSteelApi.Repositories.Implementations;
using MughalSteelApi.Repositories.Interfaces;
using MughalSteelApi.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

// Repositories (Layered Architecture)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IQuoteRepository, QuoteRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ISettingsRepository, SettingsRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICMSRepository, CMSRepository>();

// Domain & Application Services
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IVirtualTryOnService, MockVirtualTryOnService>();

// WebRootPath resolve for file uploads
var webRootPath = builder.Environment.WebRootPath;
if (string.IsNullOrEmpty(webRootPath))
{
    webRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
}
builder.Services.AddSingleton<IFileStorageService>(new FileStorageService(webRootPath));

// JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Key"] ?? "IronCraftDoorsSuperSecretJWTKey2026";
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "MughalSteel",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "MughalSteelWebsite",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin => 
              {
                  if (string.IsNullOrWhiteSpace(origin)) return false;
                  var uri = new Uri(origin);
                  return uri.Host == "localhost" || uri.Host == "127.0.0.1";
              })
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// OpenAPI with JWT Bearer Authentication for Scalar
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info = new OpenApiInfo
        {
            Title = "Mughal Steel API",
            Version = "v1",
            Description = "Backend REST API for Mughal Steel Fabrication & Architectural Metalwork",
            Contact = new OpenApiContact
            {
                Name = "Mughal Steel Support",
                Email = "support@mughalsteelfabrication.com"
            }
        };

        var securityScheme = new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Description = "Enter JWT Bearer token format: Bearer {token}",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        };

        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes.Add("Bearer", securityScheme);

        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Run DB Initialization & Seeding during startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        logger.LogInformation("Ensuring database is created and schema is up to date...");
        await context.Database.EnsureCreatedAsync();
        logger.LogInformation("Seeding database records...");
        await DbSeeder.SeedAsync(context);
        logger.LogInformation("Database initialization and seeding completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while creating or seeding the database.");
    }
}

// Only display and map Scalar / OpenAPI documentation in non-Production environments
if (!app.Environment.IsProduction())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Mughal Steel API Reference")
               .WithTheme(ScalarTheme.Moon)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}

app.UseCors("CorsPolicy");

// Ensure static files directory exists and is served
var uploadsDir = Path.Combine(webRootPath, "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}
app.UseStaticFiles();

// Global Exception Handler
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
