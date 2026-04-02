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

// TokensController — ออก JWT หลังตรวจสอบรหัสผ่าน (ล็อกอิน)
// What: รับเลขประจำตัวประชาชน + รหัสผ่าน คืน token และเวลาหมดอายุ
// Why: ฝั่งไคลเอนต์ใช้ token แนบ header เพื่อเรียก API ที่มี [Authorize] โดยไม่ส่งรหัสผ่านซ้ำ
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

        // ขั้นตอนตรวจรหัสผ่าน:
        // 1) แปลง salt และแฮชที่เก็บจาก Base64 — หากข้อมูลในฐานเสียหายหรือไม่ใช่ Base64 ที่ถูกต้อง ปฏิเสธ
        // 2) คำนวณแฮชจากรหัสผ่านที่ส่งมา ด้วยพารามิเตอร์เดียวกับตอนลงทะเบียน
        // 3) เปรียบเทียบด้วย FixedTimeEquals — ลดความเสี่ยง timing attack
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
        var nowUtc = DateTime.UtcNow;

        // หมายเหตุ: ใช้ `unique_name` สำหรับ user id เพื่อให้เข้ากับข้อกำหนด claim ใหม่
        var issuedAtUnixSeconds = new DateTimeOffset(nowUtc).ToUnixTimeSeconds();
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Id.ToString()),
            new Claim("role", "user"),
            new Claim(JwtRegisteredClaimNames.Iat, issuedAtUnixSeconds.ToString(), ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: nowUtc,
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

