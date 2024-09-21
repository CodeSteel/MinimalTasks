using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.Identity.Client;
using shortid;
using shortid.Configuration;

namespace TicketApp.Server.Models;

public enum TicketPriority
{
    Low,
    Medium,
    High
}

public enum TicketStatus
{
    Open,
    Closed
}

public class Ticket
{
    [Key]
    public string Id { get; init; } = ShortId.Generate(new GenerationOptions(false, false, 8));

    [MaxLength(80)] 
    public string? Subject { get; set; }
    
    public TicketStatus? Status { get; set; }
    
    public TicketPriority? Priority { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; } = null!;
    public Guid? OwnerId { get; set; } = null!;
    
    [ForeignKey("AssigneeId")]
    public User? Assignee { get; set; } = null!;
    public Guid? AssigneeId { get; set; } = null!;
    
    public IEnumerable<Message> Messages { get; set; } = new List<Message>();

    public Ticket()
    {
        Subject = string.Empty;
        Status = TicketStatus.Open;
        Priority = TicketPriority.Low;
        CreatedAt = DateTime.MinValue;
    }
    
    public Ticket(Ticket ticket)
    {
        Subject = ticket.Subject;
        Status = ticket.Status;
        Priority = ticket.Priority;
    }

    public void Update(Ticket ticket)
    {
        if (!string.IsNullOrEmpty(ticket.Subject))
        {
            Subject = ticket.Subject;
        }
        Status = ticket.Status;
        Priority = ticket.Priority;
        AssigneeId = ticket.Assignee?.Id;
    }
}