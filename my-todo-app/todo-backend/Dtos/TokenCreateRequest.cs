namespace TodoBackend.Dtos;

// DTO สำหรับ POST /api/tokens — ข้อมูลล็อกอินเพื่อขอ JWT
public sealed class TokenCreateRequest
{
    public string NationalId { get; set; } = null!;
    public string Password { get; set; } = null!;
}

