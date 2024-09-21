using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

namespace TicketApp.Server.Controllers;

public class DashboardStatsResponse
{
    public int TotalTickets { get; set; }
    public int TicketsUnassigned { get; set; }
    public int TicketsOpen { get; set; }
    public int MyTickets { get; set; }
    public int UserChats { get; set; }
    public int AdminChats { get; set; }
}

[ApiController]
[Route("api/[controller]/[action]")]
public class StatsController : ControllerBase
{
    private readonly AppStatsService _appStatsService;
    private readonly ApplicationDataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public StatsController(AppStatsService appStatsService, ApplicationDataContext dataContext, UserManager<User> userManager)
    {
        _userManager = userManager;
        _dataContext = dataContext;
        _appStatsService = appStatsService;
    }
    
    [HttpGet]
    public IEnumerable<AppStat> GetAppStats()
    {
        return _dataContext.AppStats;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetDashboardStats()
    {
        if (!(User.Identity?.IsAuthenticated ?? false)) return BadRequest();

        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return BadRequest();
        
        DashboardStatsResponse statsResponse = new DashboardStatsResponse();

        statsResponse.TotalTickets = await _dataContext.Tickets.CountAsync();
        statsResponse.TicketsUnassigned = await _dataContext.Tickets.Where(x => x.Assignee == null).CountAsync();
        statsResponse.TicketsOpen = await _dataContext.Tickets.Where(x => x.Status == TicketStatus.Open).CountAsync();
        statsResponse.MyTickets = await _dataContext.Tickets.Where(x => x.AssigneeId.ToString() == userId).CountAsync();
        statsResponse.AdminChats = await _dataContext.Messages.Include(x => x.Owner).Where(x => x.Owner.Admin).CountAsync();
        statsResponse.UserChats = await _dataContext.Messages.Include(x => x.Owner).Where(x => !x.Owner.Admin).CountAsync();

        return Ok(statsResponse);
    }
}