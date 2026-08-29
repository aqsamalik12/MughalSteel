using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Models;

namespace MughalSteelApi.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // 1. Seed Roles
            if (!await context.Roles.AnyAsync())
            {
                var roles = new List<Role>
                {
                    new Role { Name = "SuperAdmin" },
                    new Role { Name = "Manager" },
                    new Role { Name = "ProductManager" },
                    new Role { Name = "OrderManager" },
                    new Role { Name = "ContentManager" },
                    new Role { Name = "CustomerSupport" },
                    new Role { Name = "Customer" }
                };
                await context.Roles.AddRangeAsync(roles);
                await context.SaveChangesAsync();
            }

            // 2. Users will be created dynamically via authentication system


            // 3. Seed Website Settings
            if (!await context.WebsiteSettings.AnyAsync())
            {
                var settings = new WebsiteSettings
                {
                    CompanyName = "Mughal Steel Fabrication",
                    Tagline = "Heavy Structural Steel, Laser Cut Main Gates, Railings & Architectural Ironwork",
                    Phone = "+92 300 1234567",
                    Email = "mughalsteelfabrication51@gmail.com",
                    SupportEmail = "mughalsteelfabrication51@gmail.com",

                    StreetAddress = "Main Workshop & Yard, Plot 42, Sector I-9 Industrial Area",
                    City = "Rawalpindi / Islamabad",
                    State = "Punjab / ICT",
                    ZipCode = "46000",
                    Country = "Pakistan",
                    BusinessHours = "Monday - Saturday: 8:30 AM - 8:30 PM",
                    ShippingCharge = 0,
                    FreeShippingThreshold = 0,
                    TaxRate = 0.0m,
                    Currency = "PKR",
                    GoogleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Mughal+Steel+Fabrication+I-9+Industrial+Area+Islamabad+Rawalpindi",
                    Facebook = "https://facebook.com",
                    Instagram = "https://instagram.com",
                    YoutubeUrl = "https://youtube.com",
                    Announcement = "Free On-site Measurement & Custom 3D Design Consultation in Rawalpindi & Islamabad!"
                };
                await context.WebsiteSettings.AddAsync(settings);
                await context.SaveChangesAsync();
            }

            // 4. Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                var catGates = new Category { Name = "Main Gates & Entrance", Slug = "gates", Description = "Heavy MS laser cut, cast iron and sliding main gates." };
                var catDoors = new Category { Name = "Doors & Windows", Slug = "doors-windows", Description = "Architectural steel pivot doors, double entry doors and structural windows." };
                var catRailings = new Category { Name = "Stairs & Railings", Slug = "railings", Description = "Modern safety railings, spiral staircases, and balcony grills." };
                var catSheds = new Category { Name = "Sheds & Structures", Slug = "sheds-structures", Description = "Industrial warehouse sheds, parking carports, and roof trusses." };

                await context.Categories.AddRangeAsync(catGates, catDoors, catRailings, catSheds);
                await context.SaveChangesAsync();

                var subGates1 = new Category { Name = "CNC Laser Cut Gates", Slug = "laser-cut-gates", ParentCategoryId = catGates.Id };
                var subGates2 = new Category { Name = "Cast Iron Luxury Gates", Slug = "cast-iron-gates", ParentCategoryId = catGates.Id };
                var subGates3 = new Category { Name = "Automated Sliding Gates", Slug = "sliding-gates", ParentCategoryId = catGates.Id };

                var subDoors1 = new Category { Name = "Modern Steel Pivot Doors", Slug = "pivot-doors", ParentCategoryId = catDoors.Id };
                var subDoors2 = new Category { Name = "Double Entry Security Doors", Slug = "entry-doors", ParentCategoryId = catDoors.Id };

                await context.Categories.AddRangeAsync(subGates1, subGates2, subGates3, subDoors1, subDoors2);
                await context.SaveChangesAsync();
            }

            // 5. Seed Options (Finishes, Glass, Hardware)
            if (!await context.Finishes.AnyAsync())
            {
                await context.Finishes.AddRangeAsync(
                    new Finish { Name = "Electrostatic Matte Charcoal", Code = "#1F2421" },
                    new Finish { Name = "Metallic Gold Patina", Code = "#C5A059" },
                    new Finish { Name = "Oil Rubbed Bronze", Code = "#3D2B1F" },
                    new Finish { Name = "Pure White Gloss Epoxy", Code = "#F8F9FA" }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.GlassOptions.AnyAsync())
            {
                await context.GlassOptions.AddRangeAsync(
                    new GlassOption { Name = "Clear Low-E Insulated" },
                    new GlassOption { Name = "Frosted Privacy Glass" },
                    new GlassOption { Name = "Tempered Fluted Glass" },
                    new GlassOption { Name = "Reflective Bronze Glass" }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.HardwareOptions.AnyAsync())
            {
                await context.HardwareOptions.AddRangeAsync(
                    new HardwareOption { Name = "Standard Pull Handle" },
                    new HardwareOption { Name = "60-inch Architectural Stainless Pull Bar" },
                    new HardwareOption { Name = "Smart Digital Keypad / Biometric Lockset" },
                    new HardwareOption { Name = "Heavy Duty Italian Hydraulic Self-Closer" }
                );
                await context.SaveChangesAsync();
            }

            // 6. Seed Shipping Zones & Tax Settings
            if (!await context.ShippingZones.AnyAsync())
            {
                await context.ShippingZones.AddRangeAsync(
                    new ShippingZone { Name = "Twin Cities (Rawalpindi / Islamabad)", Regions = "ISB,RWP", Charge = 0, FreeShippingThreshold = 0, DeliveryEstimate = "1-2 Weeks" },
                    new ShippingZone { Name = "Punjab & Nationwide", Regions = "*", Charge = 15000, FreeShippingThreshold = 500000, DeliveryEstimate = "2-4 Weeks" }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.TaxSettings.AnyAsync())
            {
                await context.TaxSettings.AddAsync(
                    new TaxSetting { State = "ICT/Punjab", Rate = 0.0m, Enabled = true }
                );
                await context.SaveChangesAsync();
            }

            // 7. Seed Featured Products
            if (!await context.Products.AnyAsync())
            {
                var gateCat = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "laser-cut-gates");
                var catId = gateCat?.Id;

                var prod1 = new Product
                {
                    ProductCode = "MSF-G-001",
                    Name = "Grand Sovereign CNC Laser Geometric Main Gate",
                    Slug = "grand-sovereign-cnc-laser-main-gate",
                    SKU = "MSF-GATE-001",
                    Description = "Custom engineered heavy 14-gauge laser cut sheet with integrated square box profile structure and anti-rust zinc phosphate primer coat.",
                    ShortDescription = "Luxury exterior main villa gate with geometric Islamic star pattern.",
                    CategoryName = "Main Gates & Entrance",
                    Item = "Front Gates",
                    BasePrice = 380000,
                    PricePerSqFt = 2800,
                    SalePrice = 350000,
                    StockQuantity = 4,
                    CategoryId = catId,
                    Material = "14-Gauge Heavy MS Steel Sheet + Box Sections",
                    Style = "Modern Geometric CNC Laser",
                    Application = "Exterior Main Villa Gate",
                    Widths = "12,14,16,18",
                    Heights = "7,7.5,8,9",
                    FinishesList = "Electrostatic Matte Charcoal,Metallic Gold Patina",
                    GlassList = "Frosted Privacy Glass,Clear Low-E Insulated",
                    HardwareList = "Standard Pull Handle,60-inch Architectural Stainless Pull Bar",
                    CustomizationList = "Wicket Gate Cutout,Smart Motor Mount,Intercom Box",
                    TagsList = "CNC Laser,Main Gate,14G Steel,Modern Gate",
                    Featured = true,
                    NewArrival = true,
                    FrontImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                };

                var prod2 = new Product
                {
                    ProductCode = "MSF-D-002",
                    Name = "Architectural Steel Pivot Entrance Door",
                    Slug = "architectural-steel-pivot-entrance-door",
                    SKU = "MSF-DOOR-002",
                    Description = "Massive structural steel pivot door swinging effortlessly on high-load European hydraulic offset pivot hinges.",
                    ShortDescription = "Ultra modern double glazed pivot door for grand foyers.",
                    CategoryName = "Doors & Windows",
                    Item = "Pivot Doors",
                    BasePrice = 450000,
                    PricePerSqFt = 3500,
                    StockQuantity = 3,
                    CategoryId = catId,
                    Material = "Heavy Structural Steel + Thermal Breaks",
                    Style = "Minimalist Architectural",
                    Application = "Main Residence Entrance Foyer",
                    Widths = "5,6,7",
                    Heights = "8,9,10",
                    FinishesList = "Electrostatic Matte Charcoal,Oil Rubbed Bronze",
                    GlassList = "Clear Low-E Insulated,Frosted Privacy Glass",
                    HardwareList = "60-inch Architectural Stainless Pull Bar,Smart Digital Keypad / Biometric Lockset",
                    CustomizationList = "Integrated LED Strip Channel,Magnetic Lock Receiver",
                    TagsList = "Pivot Door,Grand Foyer,Architectural Steel",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                };

                var prod3 = new Product
                {
                    ProductCode = "MSF-R-003",
                    Name = "Floating Steel Stringer Staircase & Balustrade",
                    Slug = "floating-steel-stringer-staircase",
                    SKU = "MSF-STAIR-003",
                    Description = "Mono-stringer central steel spine staircase with solid oak tread mounts and seamless tempered glass balustrades.",
                    ShortDescription = "Custom cantilevered floating staircase for contemporary luxury duplexes.",
                    CategoryName = "Stairs & Railings",
                    Item = "Stairs & Railings",
                    BasePrice = 650000,
                    PricePerSqFt = 4500,
                    StockQuantity = 2,
                    CategoryId = catId,
                    Material = "10mm Heavy Structural Plate Steel",
                    Style = "Contemporary Minimalist",
                    Application = "Interior Living Space",
                    Widths = "3.5,4",
                    Heights = "10,12",
                    FinishesList = "Electrostatic Matte Charcoal,Pure White Gloss Epoxy",
                    GlassList = "Tempered Fluted Glass",
                    HardwareList = "Standard Pull Handle",
                    TagsList = "Floating Stairs,Mono Stringer,Luxury Interior",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                };

                var prod4 = new Product
                {
                    ProductCode = "MSF-G-004",
                    Name = "Regal Royal Cast Iron & Forged Scrollwork Gate",
                    Slug = "regal-royal-cast-iron-scrollwork-gate",
                    SKU = "MSF-GATE-004",
                    Description = "Hand-forged ornamental scrolls, cast iron spears, and solid steel core framework with baked anti-corrosion primer.",
                    ShortDescription = "Classical luxury castle-style cast iron main entrance gate.",
                    CategoryName = "Main Gates & Entrance",
                    Item = "Cast Iron Luxury Gates",
                    BasePrice = 420000,
                    PricePerSqFt = 3200,
                    StockQuantity = 2,
                    CategoryId = catId,
                    Material = "Solid Hand-Forged Wrought Iron + Cast Iron Ornaments",
                    Style = "Classical Baroque",
                    Application = "Estate & Farmhouse Entrance",
                    Widths = "14,16,18,20",
                    Heights = "8,9,10",
                    FinishesList = "Oil Rubbed Bronze,Metallic Gold Patina,Electrostatic Matte Charcoal",
                    HardwareList = "Heavy Duty Italian Hydraulic Self-Closer,Standard Pull Handle",
                    TagsList = "Cast Iron,Hand Forged,Classical,Estate Gate",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                };

                var prod5 = new Product
                {
                    ProductCode = "MSF-G-005",
                    Name = "Heavy Industrial Automated Cantilever Sliding Gate",
                    Slug = "heavy-industrial-cantilever-sliding-gate",
                    SKU = "MSF-GATE-005",
                    Description = "High-cycle automated cantilever sliding gate system with hidden internal track carriage for smooth motorized operation without ground tracks.",
                    ShortDescription = "Motorized commercial and industrial security sliding entrance.",
                    CategoryName = "Main Gates & Entrance",
                    Item = "Automated Sliding Gates",
                    BasePrice = 520000,
                    PricePerSqFt = 3100,
                    StockQuantity = 3,
                    CategoryId = catId,
                    Material = "Structural I-Beam & Reinforced 14G MS Section",
                    Style = "Industrial High Security",
                    Application = "Commercial / Industrial / Large Villa",
                    Widths = "18,20,24,30",
                    Heights = "7,8,9",
                    FinishesList = "Electrostatic Matte Charcoal,Metallic Grey",
                    HardwareList = "Smart Digital Keypad / Biometric Lockset",
                    TagsList = "Automated,Sliding Gate,Cantilever,Commercial",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80"
                };

                var prod6 = new Product
                {
                    ProductCode = "MSF-D-006",
                    Name = "French Multi-Lite Architectural Double Security Door",
                    Slug = "french-multi-lite-steel-double-door",
                    SKU = "MSF-DOOR-006",
                    Description = "Slimline thermal steel profile with authentic multi-lite divided glass and multi-point security locking mechanism.",
                    ShortDescription = "Timeless steel French double doors with maximum glass daylight.",
                    CategoryName = "Doors & Windows",
                    Item = "Double Entry Security Doors",
                    BasePrice = 390000,
                    PricePerSqFt = 3300,
                    StockQuantity = 4,
                    CategoryId = catId,
                    Material = "Solid Hot-Rolled Steel Frame + 10mm Tempered Glass",
                    Style = "Modern French Steel",
                    Application = "Patio / Main Entrance / Sunroom",
                    Widths = "5,6,7,8",
                    Heights = "8,9,10",
                    FinishesList = "Electrostatic Matte Charcoal,Oil Rubbed Bronze",
                    GlassList = "Clear Low-E Insulated,Frosted Privacy Glass,Tempered Fluted Glass",
                    HardwareList = "60-inch Architectural Stainless Pull Bar,Smart Digital Keypad / Biometric Lockset",
                    TagsList = "Double Door,French Steel,Divided Lite,Security",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80"
                };

                var prod7 = new Product
                {
                    ProductCode = "MSF-S-007",
                    Name = "Modern Cantilever Carport Canopy & Solar Structure",
                    Slug = "modern-cantilever-carport-canopy",
                    SKU = "MSF-SHED-007",
                    Description = "Post-free cantilever steel parking shade with polycarbonate roof cladding and solar panel mounting rails.",
                    ShortDescription = "Architectural parking shade and structural steel roof canopy.",
                    CategoryName = "Sheds & Structures",
                    Item = "Sheds & Structures",
                    BasePrice = 290000,
                    PricePerSqFt = 1800,
                    StockQuantity = 5,
                    CategoryId = catId,
                    Material = "High Tensile MS Pipe & CNC Gussets",
                    Style = "Aerodynamic Cantilever",
                    Application = "Residential & Commercial Parking",
                    Widths = "10,18,20,30",
                    Heights = "9,10,12",
                    FinishesList = "Electrostatic Matte Charcoal,Pure White Gloss Epoxy",
                    TagsList = "Carport,Canopy,Structural Steel,Solar Mounting",
                    Featured = true,
                    FrontImage = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80"
                };

                await context.Products.AddRangeAsync(prod1, prod2, prod3, prod4, prod5, prod6, prod7);
                await context.SaveChangesAsync();

                // Add Images
                await context.ProductImages.AddRangeAsync(
                    new ProductImage { ProductId = prod1.Id, ImageUrl = prod1.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod2.Id, ImageUrl = prod2.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod3.Id, ImageUrl = prod3.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod4.Id, ImageUrl = prod4.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod5.Id, ImageUrl = prod5.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod6.Id, ImageUrl = prod6.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 },
                    new ProductImage { ProductId = prod7.Id, ImageUrl = prod7.FrontImage, ImageType = "Front", IsPrimary = true, SortOrder = 1 }
                );
                await context.SaveChangesAsync();

                // Seed Reviews
                await context.Reviews.AddRangeAsync(
                    new Review { ProductId = prod1.Id, CustomerName = "Brigadier (R) Tariq Mahmood", Email = "tariq@example.com", Rating = 5, Comment = "Superb craftsmanship. The laser cut gate looks royal and the powder coating finish is immaculate in DHA Islamabad.", Approved = true },
                    new Review { ProductId = prod2.Id, CustomerName = "Chaudhry Kamran", Email = "kamran@example.com", Rating = 5, Comment = "The pivot action is butter smooth. Best fabrication workshop in I-9 Islamabad.", Approved = true },
                    new Review { ProductId = prod4.Id, CustomerName = "Mian Naveed", Email = "naveed@example.com", Rating = 5, Comment = "Cast iron scrollwork is authentic and heavy. Perfect for our Chak Shahzad farmhouse.", Approved = true },
                    new Review { ProductId = prod6.Id, CustomerName = "Architect Zeeshan Ali", Email = "zeeshan@example.com", Rating = 5, Comment = "Flawless French door slimline lines. Specified for multiple projects in Gulberg Greens.", Approved = true }
                );
                await context.SaveChangesAsync();
            }

            // 8. Seed Blog Posts & Testimonials
            if (!await context.BlogPosts.AnyAsync())
            {
                await context.BlogPosts.AddRangeAsync(
                    new BlogPost
                    {
                        Title = "Choosing the Right Steel Gauge for Your Main Gate",
                        Slug = "choosing-the-right-steel-gauge-for-main-gate",
                        Summary = "Understand the difference between 14-gauge, 16-gauge, and 18-gauge MS sheets for gate longevity and anti-sag structural rigidity.",
                        Content = "When designing a luxury residential main entrance gate in Islamabad & Rawalpindi, structural durability and weather resistance are paramount. 14-gauge heavy MS sheet provides the optimum strength-to-weight ratio when reinforced with 16-gauge 2x2 inch hollow square box sections...",
                        ImageUrl = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
                        Author = "Engr. Asad Mughal",
                        Category = "Engineering & Design"
                    },
                    new BlogPost
                    {
                        Title = "The Complete Guide to Rust Prevention & Electrostatic Powder Coating",
                        Slug = "guide-to-rust-prevention-powder-coating",
                        Summary = "Why 7-tank chemical pre-treatment and electrostatic oven baked powder coating outperforms regular synthetic enamel paint.",
                        Content = "Outdoor metal structures face harsh temperature variations and seasonal monsoon humidity. Standard oil paints chip and peel within a year. In contrast, electrostatic powder coating bonds thermoset polymer particles to bare zinc-phosphated steel at 200°C...",
                        ImageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                        Author = "Engr. Asad Mughal",
                        Category = "Finishes & Protection"
                    }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.Testimonials.AnyAsync())
            {
                await context.Testimonials.AddRangeAsync(
                    new Testimonial
                    {
                        Name = "Dr. Farooq Khan",
                        City = "Sector F-6, Islamabad",
                        Comment = "Mughal Steel delivered and installed our 18ft laser cut gate and custom pivot door on time. The precision of CNC cutting and fitting was outstanding.",
                        Rating = 5,
                        Active = true
                    },
                    new Testimonial
                    {
                        Name = "Malik Zubair Ahmed",
                        City = "Bahria Town Phase 7, Rawalpindi",
                        Comment = "We hired Mughal Steel for our 1-Kanal Spanish villa's spiral staircase, main gate, and perimeter railings. Top tier quality and direct factory pricing.",
                        Rating = 5,
                        Active = true
                    }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.GalleryProjects.AnyAsync())
            {
                await context.GalleryProjects.AddRangeAsync(
                    new GalleryProject
                    {
                        Title = "Luxury Spanish Villa Main Gate & Boundary Grill",
                        Description = "Custom laser cut Islamic geometric 14G entrance system with motorized remote automation in Bahria Enclave Islamabad.",
                        Location = "Bahria Enclave, Islamabad",
                        Style = "Spanish Geometric",
                        CoverImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                        Tags = "Gate,Villa,Islamabad",
                        Featured = true
                    },
                    new GalleryProject
                    {
                        Title = "Corporate Head Office Glass & Steel Entrance",
                        Description = "10-foot oversized pivot steel door with satin stainless pull bars and insulated fluted glass panels.",
                        Location = "Blue Area, Islamabad",
                        Style = "Modern Minimalist",
                        CoverImage = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80",
                        Tags = "Pivot Door,Commercial,Blue Area",
                        Featured = true
                    }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
