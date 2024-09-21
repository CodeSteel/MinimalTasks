using System.ComponentModel.DataAnnotations;

namespace TicketApp.Server.Models;

public enum AppStatType
{
    TicketsOpened,
    TicketsClosed,
    TicketsClosedLate,
    ChatsSent,
    UsersRegistered
}

public class AppStat
{
    [Key] 
    public AppStatType AppStatType { get; init; }
    
    public int Value { get; set; }
}