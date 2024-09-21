using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;

namespace TicketApp.Server.Services;

public class TicketHub : Hub
{
    private readonly ApplicationDataContext _dataContext;
    private ILogger<TicketHub> _logger;
    
    public TicketHub(ApplicationDataContext dataContext, ILogger<TicketHub> logger)
    {
        _logger = logger;
        _dataContext = dataContext;
    }
    
    public async Task Send(string ticketId, string message)
    {
        User? user = await _dataContext.Users
            .FirstOrDefaultAsync(x => x.Email == Context.User.Identity.Name);
        // if (user != null)
        // {
        // }
        await Clients.All.SendAsync("ReceiveMessage", user.UserName, user.Id, message, ticketId);
    }

    public async Task Test()
    {
        _logger.LogInformation("ASDASDASD");
        await Clients.All.SendAsync("Test");
    }
}