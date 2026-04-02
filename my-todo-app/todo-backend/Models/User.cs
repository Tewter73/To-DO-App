using System;
using System.Collections.Generic;

namespace TodoBackend.Models;

// โมเดล User — แทนตาราง user ในฐานข้อมูล
// What: ข้อมูลผู้ใช้และความสัมพันธ์ one-to-many กับ Activity
// Why: Entity Framework ใช้ map กับคอลัมน์และ FK; รหัสผ่านเก็บเป็น salt + hash เท่านั้น
public partial class User
{
    public uint Id { get; set; }

    public string NationalId { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string HashedPassword { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public virtual ICollection<Activity> Activity { get; set; } = new List<Activity>();
}
