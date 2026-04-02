using System;

namespace TodoBackend.Dtos;

public sealed class ActivityUpdateRequest
{
    public string Name { get; set; } = null!;
    public DateTime When { get; set; }
}

