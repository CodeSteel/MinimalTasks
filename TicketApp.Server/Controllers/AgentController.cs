using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

namespace TicketApp.Server.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class AgentController : ControllerBase
{
    private readonly ApplicationDataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public AgentController(ApplicationDataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
    }

    [HttpGet]
    [Authorize]
    public async Task<IEnumerable<User>> GetAllAgents()
    {
        return await _userManager.GetUsersInRoleAsync("Agent");
    }
}