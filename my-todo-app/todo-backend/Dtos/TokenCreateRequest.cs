namespace TodoBackend.Dtos;

public sealed class TokenCreateRequest
{
    public string NationalId { get; set; } = null!;
    public string Password { get; set; } = null!;
}

