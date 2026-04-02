using System;

namespace TodoBackend.Dtos;

// DTO สำหรับ POST /api/activities — รูปแบบข้อมูลเมื่อสร้างรายการใหม่
public sealed class ActivityCreateRequest
{
    public string Name { get; set; } = null!;
    public DateTime When { get; set; }
}

