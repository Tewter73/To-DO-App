namespace TodoBackend.Dtos;

// DTO สำหรับ POST /api/users/reset-password — ข้อมูลยืนยันตัวตนและรหัสผ่านใหม่
public sealed class ResetPasswordRequest
{
    public string NationalId { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}

