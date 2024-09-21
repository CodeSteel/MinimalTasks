using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketApp.Server.Models;

public class Message
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    public User Owner { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [MaxLength(20000)]
    public string Body { get; set; }

    [ForeignKey("TicketId")]
    public Ticket Ticket { get; set; } = null!;
    public string TicketId { get; set; }
}