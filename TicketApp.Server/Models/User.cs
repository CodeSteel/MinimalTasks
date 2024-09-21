using Microsoft.AspNetCore.Identity;

namespace TicketApp.Server.Models;

public class User : IdentityUser<Guid>
{
    public ICollection<Ticket>? OwnedTickets { get; set; } = null;
 
    public ICollection<Ticket>? AssignedTickets { get; set; } = null;
    
    public bool Admin { get; set; }
}