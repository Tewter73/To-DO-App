using System;

namespace TodoBackend.Dtos;

// DTO สำหรับ PUT /api/activities/{id} — รูปแบบข้อมูลที่ไคลเอนต์ส่งเมื่อแก้ไขรายการ
public sealed class ActivityUpdateRequest
{
    public string Name { get; set; } = null!;
    public DateTime When { get; set; }
}

