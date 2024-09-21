using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

namespace TicketApp.Server.Controllers;

public class CreateTicketRequest
{
    public string Subject { get; set; }
    public string Message { get; set; }
    public TicketPriority Priority { get; set; }
}

public class SendMessageRequest
{
    public string Message { get; set; }
    public string TicketId { get; set; }
}

[ApiController]
[Route("api/[controller]/[action]")]
public class TicketController : ControllerBase
{
    private readonly ApplicationDataContext _dataContext;
    private readonly UserManager<User> _userManager;
    private readonly AppStatsService _appStatsService;

    public TicketController(ApplicationDataContext dataContext, UserManager<User> userManager, AppStatsService appStatsService)
    {
        _appStatsService = appStatsService;
        _dataContext = dataContext;
        _userManager = userManager;
    }
    
    [HttpPut]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicketRequest request)
    {
        User user = await _userManager.GetUserAsync(new ClaimsPrincipal(User.Identity));
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }

        Ticket createdTicket = new Ticket()
        {
            Owner = user,
            CreatedAt = DateTime.Now,
            Subject = request.Subject,
            Priority = request.Priority
        };

        Message newMessage = new Message()
        {
            Owner = user,
            Body = request.Message,
            TicketId = createdTicket.Id,
        };

        await _dataContext.Tickets.AddAsync(createdTicket);
        await _dataContext.Messages.AddAsync(newMessage);
        await _dataContext.SaveChangesAsync();
        
        await _appStatsService.AddToStat(AppStatType.TicketsOpened, 1);
        
        return Ok(); 
    }
    
    [HttpPost]
    public async Task<IActionResult> UpdateTicket([FromBody] Ticket request)
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

        bool isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (user.Id != queriedTicket.OwnerId && !isAdmin)
        {
            return BadRequest("No relationship with ticket.");
        }

        TicketStatus? prevStatus = queriedTicket.Status;
        
        _dataContext.Update(queriedTicket);
        if (isAdmin)
        {
            queriedTicket.Update(request);
        }
        else
        {
            queriedTicket.Priority = request.Priority;
        }
        await _dataContext.SaveChangesAsync();

        if (prevStatus == TicketStatus.Open && request.Status == TicketStatus.Closed)
        {
            await _appStatsService.AddToStat(
                queriedTicket.CreatedAt < DateTime.Now.AddDays(-1)
                    ? AppStatType.TicketsClosedLate
                    : AppStatType.TicketsClosed, 1);
        }
        
        return Ok(); 
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        User? user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }
        
        Ticket? queriedTicket = await _dataContext.Tickets.FindAsync(request.TicketId);
        if (queriedTicket == null)
        {
            return BadRequest("Ticket not found.");
        }

        bool isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (user.Id != queriedTicket.OwnerId && !isAdmin)
        {
            return BadRequest("No relationship with ticket.");
        }

        Message newMessage = new Message()
        {
            Owner = user,
            TicketId = request.TicketId,
            Body = request.Message
        };
        
        await _dataContext.Messages.AddAsync(newMessage);
        await _dataContext.SaveChangesAsync();
        
        await _appStatsService.AddToStat(AppStatType.ChatsSent, 1);

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteTicket([FromBody] string ticketId)
    {
        User? user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return BadRequest("Not authorized.");
        }
        
        Ticket? queriedTicket = await _dataContext.Tickets.FindAsync(ticketId);
        if (queriedTicket == null)
        {
            return BadRequest("Ticket not found.");
        }

        bool isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (user.Id != queriedTicket.AssigneeId && !isAdmin)
        {
            return BadRequest("No relationship with ticket.");
        }

        _dataContext.Tickets.Remove(queriedTicket);
        await _dataContext.SaveChangesAsync();

        return Ok();
    }
    
    #region Getters
    
    [HttpGet]
    public async Task<Ticket?> GetTicketData(string ticketId)
    {
        Ticket ticket = await _dataContext.Tickets
            .Include(x => x.Messages)
            .Select(ticket => new Ticket
            {
                Id = ticket.Id,
                Subject = ticket.Subject,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedAt = ticket.CreatedAt,
                Messages = ticket.Messages.Select(x => new Message()
                {
                    Id = x.Id,
                    Owner = x.Owner,
                    Body = x.Body,
                    CreatedAt = x.CreatedAt
                }),
                Owner = new User()
                {
                    Id = ticket.OwnerId ?? Guid.Empty,
                    UserName = ticket.Owner.UserName.Replace("_", " "),
                    Email = ticket.Owner.Email,
                },
                Assignee = ticket.Assignee == null
                    ? null
                    : new User()
                    {
                        Id = ticket.AssigneeId ?? Guid.Empty,
                        UserName = ticket.Assignee.UserName.Replace("_", " "),
                        Email = ticket.Assignee.Email
                    },
            })
            .FirstOrDefaultAsync(x => x.Id == ticketId);

        if (ticket != null)
        {
            List<Message> messages = ticket.Messages.ToList();
            messages.Sort((a, b) => a.CreatedAt.CompareTo(b.CreatedAt));
            ticket.Messages = messages;
        }

        return ticket;
    }
    
    [HttpGet]
    public IEnumerable<Ticket> GetAllTickets()
    {
        List<Ticket> tickets = _dataContext.Tickets
        .Select(ticket => new Ticket
        {
            Id = ticket.Id,
            Subject = ticket.Subject,
            Status = ticket.Status,
            Priority = ticket.Priority,
            CreatedAt = ticket.CreatedAt,
            Owner = new User()
            {
                Id = ticket.OwnerId ?? Guid.Empty, UserName = ticket.Owner.UserName.Replace("_", " "),
                Email = ticket.Owner.Email
            },
            Assignee = ticket.Assignee == null
                ? null
                : new User()
                {
                    Id = ticket.AssigneeId ?? Guid.Empty, UserName = ticket.Assignee.UserName.Replace("_", " "),
                    Email = ticket.Assignee.Email
                },
            Messages = new []{ ticket.Messages.Select(x => new Message()
            {
                CreatedAt = x.CreatedAt,
                Owner = new User()
                {
                    Id = x.Owner.Id
                }
            }).OrderBy(x => x.CreatedAt).Last() }
        }).ToList();
    
        tickets.Sort((a,b) => b.CreatedAt.CompareTo(a.CreatedAt));
        return tickets;
    }
    
    [HttpGet]
    public IEnumerable<Ticket> GetMyTickets()
    {
        return _dataContext.Set<Ticket>()
            .Select(ticket => new Ticket
            {
                Id = ticket.Id,
                Subject = ticket.Subject,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedAt = ticket.CreatedAt,
                Owner = new User()
                {
                    Id = ticket.OwnerId ?? Guid.Empty, UserName = ticket.Owner.UserName.Replace("_", " "),
                    Email = ticket.Owner.Email
                },
                Assignee = ticket.Assignee == null
                    ? null
                    : new User()
                    {
                        Id = ticket.AssigneeId ?? Guid.Empty, UserName = ticket.Assignee.UserName.Replace("_", " "),
                        Email = ticket.Assignee.Email
                    },
                Messages = new []{ ticket.Messages.Select(x => new Message()
                {
                    CreatedAt = x.CreatedAt,
                    Owner = new User()
                    {
                        Id = x.Owner.Id
                    }
                }).OrderBy(x => x.CreatedAt).Last() }
            }).Where(x => x.Owner.Id.ToString() == User.FindFirstValue(ClaimTypes.NameIdentifier));
    }
    
    #endregion
}