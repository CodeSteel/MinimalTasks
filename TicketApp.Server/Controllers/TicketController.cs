using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

namespace TicketApp.Server.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class TicketController : ControllerBase
{
    private readonly ApplicationDataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public TicketController(ApplicationDataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateTicket(Ticket request)
    {
        User user = await _userManager.GetUserAsync(new ClaimsPrincipal(User.Identity));
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }

        Ticket createdTicket = new Ticket(request)
        {
            Owner = user,
            CreatedAt = DateTime.Now
        };

        _dataContext.Tickets.Add(createdTicket);
        await _dataContext.SaveChangesAsync();
        
        return Ok(); 
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AssignToTicket(Guid ticketId)
    {
        User user = await _userManager.GetUserAsync(new ClaimsPrincipal(User.Identity));
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }

        IList<string> userRoles = await _userManager.GetRolesAsync(user);
        if (!userRoles.Contains("Admin"))
        {
            return BadRequest("Not authorized.");
        }

        Ticket? queriedTicket = await _dataContext.Tickets.FindAsync(ticketId);
        if (queriedTicket == null)
        {
            return BadRequest("Ticket not found.");
        }

        _dataContext.Update(queriedTicket);
        queriedTicket.Assignee = user;
        await _dataContext.SaveChangesAsync();
        
        return Ok(); 
    }
    
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateTicket(Ticket request)
    {
        User user = await _userManager.GetUserAsync(new ClaimsPrincipal(User.Identity));
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }
        
        Ticket? queriedTicket = await _dataContext.Tickets.FindAsync(request.Id);
        if (queriedTicket == null)
        {
            return BadRequest("Ticket not found.");
        }

        if (user.Id != queriedTicket.AssigneeId && user.Id != queriedTicket.OwnerId)
        {
            return BadRequest("No relationship with ticket.");
        }

        _dataContext.Update(queriedTicket);
        queriedTicket.Update(request);
        await _dataContext.SaveChangesAsync();
        
        return Ok(); 
    }
}