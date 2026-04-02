using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoBackend.Dtos;
using TodoBackend.Models;

namespace TodoBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController : ControllerBase
{
    private readonly TodoDbContext _db;

    public UsersController(TodoDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NationalId) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest();
        }

        var exists = await _db.User.AnyAsync(x => x.NationalId == request.NationalId);
        if (exists)
        {
            return Conflict(new { message = "NationalId already exists." });
        }

        var saltBytes = RandomNumberGenerator.GetBytes(16);
        var salt = Convert.ToBase64String(saltBytes); // 16 bytes -> 24 chars base64

        var hashBytes = KeyDerivation.Pbkdf2(
            password: request.Password,
            salt: saltBytes,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100_000,
            numBytesRequested: 32);
        var hashedPassword = Convert.ToBase64String(hashBytes); // 32 bytes -> 44 chars base64

        var user = new User
        {
            NationalId = request.NationalId,
            Title = request.Title ?? string.Empty,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Salt = salt,
            HashedPassword = hashedPassword
        };

        _db.User.Add(user);
        await _db.SaveChangesAsync();

        return Created($"/api/users/{user.Id}", new
        {
            user.Id,
            user.NationalId,
            user.Title,
            user.FirstName,
            user.LastName
        });
    }
}

