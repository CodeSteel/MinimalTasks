﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;

namespace TicketApp.Server.Services;

public class ApplicationDataContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    private readonly IConfiguration _configuration;
    
    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<AppStat> AppStats { get; set; }
    
    public ApplicationDataContext(DbContextOptions<ApplicationDataContext> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlServer(_configuration.GetConnectionString("default"));
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>(ent =>
        {
            ent.HasKey(u => u.Id);
        });

        builder.Entity<Ticket>(ent =>
        {
            ent.HasKey(t => t.Id);
            ent.HasOne(t => t.Owner)
                .WithMany(u => u.OwnedTickets)
                .HasForeignKey(t => t.OwnerId);
            ent.HasOne(t => t.Assignee)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssigneeId);
            ent.HasMany(t => t.Messages)
                .WithOne(m => m.Ticket)
                .HasForeignKey(m => m.TicketId);
        });

        builder.Entity<Message>(ent =>
        {
            ent.HasOne(m => m.Ticket)
                .WithMany(t => t.Messages)
                .HasForeignKey(m => m.TicketId);
        });
        
        base.OnModelCreating(builder);
    }
}