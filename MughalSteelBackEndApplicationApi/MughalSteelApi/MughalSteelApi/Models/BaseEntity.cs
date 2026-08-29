using System;
using System.ComponentModel.DataAnnotations;

namespace MughalSteelApi.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? EditedDate { get; set; }

        public bool Deleted { get; set; } = false;

        public DateTime? DeletedDate { get; set; }
    }
}
