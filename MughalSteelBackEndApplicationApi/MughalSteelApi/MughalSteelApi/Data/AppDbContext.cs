using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MughalSteelApi.Models;

namespace MughalSteelApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Finish> Finishes { get; set; }
        public DbSet<GlassOption> GlassOptions { get; set; }
        public DbSet<HardwareOption> HardwareOptions { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<CustomDesign> CustomDesigns { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<WebsiteSettings> WebsiteSettings { get; set; }
        public DbSet<PortfolioProject> PortfolioProjects { get; set; }
        public DbSet<GalleryProject> GalleryProjects { get; set; }
        public DbSet<MediaFile> MediaFiles { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<ShippingZone> ShippingZones { get; set; }
        public DbSet<TaxSetting> TaxSettings { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<BackupLog> BackupLogs { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity.CreatedDate == default)
                    {
                        entry.Entity.CreatedDate = DateTime.UtcNow;
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    if (entry.Entity.Deleted && entry.Entity.DeletedDate == null)
                    {
                        entry.Entity.DeletedDate = DateTime.UtcNow;
                    }
                    entry.Entity.EditedDate = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Performance Indexes
            modelBuilder.Entity<Product>().HasIndex(p => p.SKU);
            modelBuilder.Entity<Product>().HasIndex(p => p.Slug);
            modelBuilder.Entity<Order>().HasIndex(o => o.OrderNumber);
            modelBuilder.Entity<Order>().HasIndex(o => o.Email);
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Quote>().HasIndex(q => q.Status);
            modelBuilder.Entity<Quote>().HasIndex(q => q.CreatedDate);
            modelBuilder.Entity<BlogPost>().HasIndex(b => b.Slug);
            modelBuilder.Entity<PortfolioProject>().HasIndex(p => p.Slug);
            modelBuilder.Entity<PortfolioProject>().HasIndex(p => p.Category);
            modelBuilder.Entity<Notification>().HasIndex(n => n.IsRead);

            // Recursive category relationships
            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Soft-delete query filters for BaseEntity types
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Role>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Address>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Category>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Product>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<ProductImage>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Finish>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<GlassOption>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<HardwareOption>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Order>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<OrderItem>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Quote>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<CustomDesign>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Review>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<BlogPost>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Testimonial>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<ContactMessage>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<WebsiteSettings>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<PortfolioProject>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<GalleryProject>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<MediaFile>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<ActivityLog>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<ShippingZone>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<TaxSetting>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<Notification>().HasQueryFilter(e => !e.Deleted);
            modelBuilder.Entity<BackupLog>().HasQueryFilter(e => !e.Deleted);
        }
    }
}
