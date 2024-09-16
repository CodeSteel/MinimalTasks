using Microsoft.AspNetCore.Identity;

namespace TicketApp.Server.Models;

public class User : IdentityUser<Guid>
{
    public ICollection<Ticket> OwnedTickets { get; set; } = new List<Ticket>();
    
    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();
}