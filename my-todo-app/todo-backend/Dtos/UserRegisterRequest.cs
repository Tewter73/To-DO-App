namespace TodoBackend.Dtos;

// DTO สำหรับ POST /api/users/register — ข้อมูลลงทะเบียนผู้ใช้ (ไม่ส่งกลับรหัสผ่านใน response)
public sealed class UserRegisterRequest
{
    public string NationalId { get; set; } = null!;
    public string? Title { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Password { get; set; } = null!;
}

