using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Smart_Campus_Management.Models;
using System;

namespace Smart_Campus_Management
{
   public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<OtpRecord> OtpRecords { get; set; }
        public DbSet<Department_Model> Departments { get; set; }
        public DbSet<Faculty_Model> Faculty { get; set; }
        public DbSet<Enrollment_Model> Enrollments { get; set; }
        public DbSet<EmailChangeLog> EmailChangeLogs { get; set; }
        public DbSet<ProfessorEnrollmentModal> ProfessorEnrollments { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd(); // Set 
            // Configure LogEntry
            modelBuilder.Entity<LogEntry>()
                .Property(l => l.CreatedAt)
                .ValueGeneratedOnAdd();
            modelBuilder.Entity<Department_Model>()
                .HasIndex(d => d.DepartmentName)
                .IsUnique();
            modelBuilder.Entity<OtpRecord>()
                .HasIndex(o => o.OTP)
                .IsUnique();
            // Department -> Many Enrollments
            modelBuilder.Entity<Enrollment_Model>()
                .HasOne(e => e.Departments)
                .WithMany(d => d.Enrollments)
                .HasForeignKey(e => e.DepartmentId);
        }
    }
}