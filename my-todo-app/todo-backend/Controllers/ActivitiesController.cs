using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoBackend.Dtos;
using TodoBackend.Models;

namespace TodoBackend.Controllers;

// ActivitiesController — REST API สำหรับกิจกรรม/งาน (To-Do) ของผู้ใช้ที่ล็อกอินแล้ว
// What: CRUD รายการ activity ในฐานข้อมูล
// Why: แยกข้อมูลตาม userId จาก JWT — ผู้ใช้แต่ละคนเห็นเฉพาะรายการของตนเอง
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "user")] // ทุก endpoint ต้องเป็นผู้ใช้ที่ล็อกอินและมี role=user
public sealed class ActivitiesController : ControllerBase
{
    private readonly TodoDbContext _db;

    public ActivitiesController(TodoDbContext db)
    {
        _db = db;
    }

    // อ่านรหัสผู้ใช้จาก ClaimTypes.Name (ตั้งค่าไว้ตอนสร้าง JWT ใน TokensController)
    private uint GetUserId()
    {
        var id = Convert.ToInt32(User?.Identity?.Name);
        return (uint)id;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();

        // กรองเฉพาะแถวที่เป็นของผู้ใช้ปัจจุบัน เรียงตามเวลาที่กำหนด
        var activities = await _db.Activity
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.When)
            .ToListAsync();

        if (activities.Count == 0)
        {
            return NoContent();
        }

        return Ok(activities);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] uint id)
    {
        var userId = GetUserId();

        // คืนข้อมูลได้เฉพาะ activity ของผู้ใช้ปัจจุบันเท่านั้น
        var activity = await _db.Activity.SingleOrDefaultAsync(x => x.UserId == userId && x.Id == id);
        if (activity is null)
        {
            return NotFound();
        }

        return Ok(activity);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromBody] ActivityCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest();
        }

        var userId = GetUserId();

        var activity = new Activity
        {
            Name = request.Name,
            When = request.When,
            UserId = userId
        };

        _db.Activity.Add(activity);
        await _db.SaveChangesAsync();

        // Requirement อาจารย์: HTTP 200 OK พร้อม JSON { id } หลังสร้างสำเร็จ
        return Ok(new { id = activity.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] uint id, [FromBody] ActivityUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest();
        }

        var userId = GetUserId();

        // ต้องตรงทั้ง id รายการและ userId — กันผู้ใช้แก้รายการของคนอื่น
        var activity = await _db.Activity.SingleOrDefaultAsync(x => x.UserId == userId && x.Id == id);
        if (activity is null)
        {
            return NotFound();
        }

        activity.Name = request.Name;
        activity.When = request.When;
        await _db.SaveChangesAsync();

        return Ok(activity);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] uint id)
    {
        var userId = GetUserId();

        // เช่นเดียวกับการแก้ไข: ลบได้เฉพาะรายการของผู้ใช้ปัจจุบัน
        var activity = await _db.Activity.SingleOrDefaultAsync(x => x.UserId == userId && x.Id == id);
        if (activity is null)
        {
            return NotFound();
        }

        _db.Activity.Remove(activity);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

