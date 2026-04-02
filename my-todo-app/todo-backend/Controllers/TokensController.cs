using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoBackend.Dtos;
using TodoBackend.Models;

namespace TodoBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TokensController : ControllerBase
{
    private readonly TodoDbContext _db;
    private readonly IConfiguration _config;

    public TokensController(TodoDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> CreateToken([FromBody] TokenCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NationalId) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest();
        }

        var user = await _db.User.SingleOrDefaultAsync(x => x.NationalId == request.NationalId);
        if (user is null)
        {
            return Unauthorized();
        }

        byte[] saltBytes;
        try
        {
            saltBytes = Convert.FromBase64String(user.Salt);
        }
        catch
        {
            return Unauthorized();
        }

        var computedHashBytes = KeyDerivation.Pbkdf2(
            password: request.Password,
            salt: saltBytes,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100_000,
            numBytesRequested: 32);

        byte[] storedHashBytes;
        try
        {
            storedHashBytes = Convert.FromBase64String(user.HashedPassword);
        }
        catch
        {
            return Unauthorized();
        }

        if (storedHashBytes.Length != computedHashBytes.Length ||
            !CryptographicOperations.FixedTimeEquals(storedHashBytes, computedHashBytes))
        {
            return Unauthorized();
        }

        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Missing configuration: Jwt:Key");
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var expires = DateTime.UtcNow.AddHours(3);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new
        {
            token = tokenString,
            expiresAtUtc = expires
        });
    }
}

