using System;

namespace TodoBackend.Dtos;

public sealed class ActivityCreateRequest
{
    public string Name { get; set; } = null!;
    public DateTime When { get; set; }
}

