using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace TodoBackend.Models;

// TodoDbContext — DbContext ของ Entity Framework สำหรับ MySQL/MariaDB
// What: กำหนด DbSet, ชนิดคอลัมน์, ดัชนี unique บน NationalId, และ FK จาก activity → user
// Why: ให้การสืบค้นและบันทึกข้อมูลสอดคล้องกับสคีมาฐานข้อมูลจริง (รวม collation ภาษาไทย)
// หมายเหตุ: เมื่อลงทะเบียนใน Program.cs ด้วย AddDbContext การเชื่อมต่อจาก appsettings จะถูกใช้แทน OnConfiguring ด้านล่าง
public partial class TodoDbContext : DbContext
{
    public TodoDbContext()
    {
    }

    public TodoDbContext(DbContextOptions<TodoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Activity> Activity { get; set; }

    public virtual DbSet<User> User { get; set; }

    // ค่าเริ่มต้นจาก scaffolding — ในแอปจริงใช้ connection จาก Program.cs; ส่วนนี้เหลือสำหรับเครื่องมือที่รัน DbContext โดยไม่ผ่าน DI
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=todo_db;user=root;password=12345678*", Microsoft.EntityFrameworkCore.ServerVersion.Parse("12.2.2-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ตั้ง collation/charset ให้สอดคล้องกับฐานข้อมูล — รองรับการเรียงและเปรียบเทียบข้อความภาษาไทย
        modelBuilder
            .UseCollation("utf8mb4_thai_520_w2")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("activity");

            entity.HasIndex(e => e.UserId, "FK_activity_user");

            entity.Property(e => e.Id).HasColumnType("int(10) unsigned");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.UserId).HasColumnType("int(10) unsigned");
            entity.Property(e => e.When).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.Activity)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_activity_user");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.NationalId, "NationalId").IsUnique();

            entity.Property(e => e.Id).HasColumnType("int(10) unsigned");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.HashedPassword)
                .HasMaxLength(44)
                .IsFixedLength();
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.NationalId)
                .HasMaxLength(13)
                .IsFixedLength();
            entity.Property(e => e.Salt)
                .HasMaxLength(24)
                .IsFixedLength();
            entity.Property(e => e.Title).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
