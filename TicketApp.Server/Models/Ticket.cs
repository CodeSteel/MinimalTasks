using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketApp.Server.Models;

public enum TicketPriority
{
    Low,
    Medium,
    High
}

public enum TicketStatus
{
    Queued,
    Assigned,
    InProgress,
    UAT,
    PendingRelease,
    Deployed
}

public class Ticket
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(30)] 
    public string Title { get; set; }
    
    [MaxLength(3500)]
    public string Description { get; set; }
    
    public TicketStatus Status { get; set; }
    
    public TicketPriority Priority { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; } = null!;
    public Guid? OwnerId { get; set; }
    
    [ForeignKey("AssigneeId")]
    public User? Assignee { get; set; } = null!;
    public Guid? AssigneeId { get; set; }

    public Ticket()
    {
        Title = string.Empty;
        Description = string.Empty;
        Status = TicketStatus.Queued;
        Priority = TicketPriority.Low;
        CreatedAt = DateTime.MinValue;
    }
    
    public Ticket(Ticket ticket)
    {
        Title = ticket.Title;
        Description = ticket.Description;
        Status = ticket.Status;
        Priority = ticket.Priority;
    }

    public void Update(Ticket ticket)
    {
        Title = ticket.Title;
        Description = ticket.Description;
        Status = ticket.Status;
        Priority = ticket.Priority;
        Owner = ticket.Owner;
        Assignee = ticket.Assignee;
    }
}