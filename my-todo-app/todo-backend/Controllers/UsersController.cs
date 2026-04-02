using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoBackend.Dtos;
using TodoBackend.Models;

namespace TodoBackend.Controllers;

// UsersController — ลงทะเบียนผู้ใช้ใหม่ (ไม่ต้องมี JWT)
// What: รับข้อมูลส่วนตัวและรหัสผ่าน เก็บเฉพาะรหัสผ่านที่แฮชแล้วพร้อม salt
// Why: ไม่เก็บรหัสผ่าน plaintext; ใช้ PBKDF2 ให้สอดคล้องกับการตรวจสอบตอนล็อกอินใน TokensController
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
    [ProducesResponseType(typeof(UserRegisterResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ConflictErrorResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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
            return Conflict(new ConflictErrorResponse
            {
                Message = "NationalId already exists."
            });
        }

        // ขั้นตอนการเก็บรหัสผ่าน (ลงทะเบียน):
        // 1) สุ่ม salt ขนาด 16 ไบต์ — ทำให้แฮชของรหัสผ่านเดียวกันไม่ซ้ำกันระหว่างผู้ใช้
        // 2) PBKDF2 (HMAC-SHA256, 100,000 รอบ) สร้างแฮช 32 ไบต์ — ทนต่อการเดารหัสผ่านดีกว่าแฮชครั้งเดียว
        // 3) เก็บ salt และ hashedPassword เป็น Base64 ในฐานข้อมูล (ความยาวคงที่ตามที่สคีมากำหนด)
        var saltBytes = RandomNumberGenerator.GetBytes(16);
        var salt = Convert.ToBase64String(saltBytes);

        var hashBytes = KeyDerivation.Pbkdf2(
            password: request.Password,
            salt: saltBytes,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100_000,
            numBytesRequested: 32);
        var hashedPassword = Convert.ToBase64String(hashBytes);

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

        var body = new UserRegisterResponse
        {
            Id = user.Id,
            NationalId = user.NationalId,
            Title = user.Title,
            FirstName = user.FirstName,
            LastName = user.LastName
        };

        return Created($"/api/users/{user.Id}", body);
    }
}

