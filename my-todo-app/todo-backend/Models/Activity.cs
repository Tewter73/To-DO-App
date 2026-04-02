using System;
using System.Collections.Generic;

namespace TodoBackend.Models;

// โมเดล Activity — แทนตาราง activity (รายการงาน/นัดหมายของผู้ใช้)
// What: ชื่อกิจกรรม เวลา และเจ้าของ (UserId)
// Why: แยกรายการต่อผู้ใช้ผ่าน FK ไปยัง User
public partial class Activity
{
    public uint Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime When { get; set; }

    public uint UserId { get; set; }

    public virtual User User { get; set; } = null!;
}
