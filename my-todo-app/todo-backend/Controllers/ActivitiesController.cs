using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoBackend.Dtos;
using TodoBackend.Models;

namespace TodoBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ActivitiesController : ControllerBase
{
    private readonly TodoDbContext _db;

    public ActivitiesController(TodoDbContext db)
    {
        _db = db;
    }

    private uint GetUserId()
    {
        var id = Convert.ToInt32(User?.Identity?.Name);
        return (uint)id;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();

        var activities = await _db.Activity
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.When)
            .ToListAsync();

        return Ok(activities);
    }

    [HttpPost]
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

        return Created($"/api/activities/{activity.Id}", activity);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] uint id, [FromBody] ActivityUpdateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest();
        }

        var userId = GetUserId();

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

