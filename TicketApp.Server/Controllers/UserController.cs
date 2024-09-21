using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

namespace TicketApp.Server.Controllers;

public class UserResponse
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string? Role { get; set; }
}

[ApiController]
[Route("api/[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public UserController(ApplicationDataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IEnumerable<User>> GetAllAgents()
    {
        return (await _userManager.GetUsersInRoleAsync("Admin")).Select(x => new User()
        {
            Id = x.Id,
            UserName = x.UserName,
            Email = x.Email
        });
    }
    
    [HttpGet]
    public async Task<IEnumerable<UserResponse>> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userResponses = new List<UserResponse>();

        foreach (var user in users)   
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            userResponses.Add(new UserResponse()
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = role
            });
        }

        return userResponses;
    }
    
    [HttpGet]
    public async Task<User?> GetUserInfo(string userId)
    {
        return await _dataContext.Users.FirstOrDefaultAsync(x => x.Id.ToString() == userId);
    }
    
    [HttpPost]
    public async Task<List<User?>> GetUsersInfo([FromBody] List<string> userIds)
    {
        List<User?> users = new List<User?>();
        foreach (string userId in userIds)
        {
            users.Add(await _dataContext.Users.FirstOrDefaultAsync(x => x.Id.ToString() == userId));
        }
        return users;
    }
}