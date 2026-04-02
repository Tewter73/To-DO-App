namespace TodoBackend.Dtos;

public sealed class UserRegisterResponse
{
    public uint Id { get; set; }

    public string NationalId { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
}
