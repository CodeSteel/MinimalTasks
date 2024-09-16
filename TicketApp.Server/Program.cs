using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketApp.Server.Models;
using TicketApp.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).AddCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddDbContext<ApplicationDataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("default")));

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDataContext>()
    .AddApiEndpoints();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 5;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.MapGroup("api").MapCustomIdentityApi<User>();
app.MapControllers();

app.MapPost("/api/ping", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    var username = user.FindFirstValue(ClaimTypes.Name)?.Replace("_", " ");
    var hasAuth = email != null && !string.IsNullOrEmpty(email);
    return Results.Json(new { email, username, hasAuth });
});

app.MapPost("/api/logout", async (SignInManager<User> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
});

app.MapFallbackToFile("/index.html");
app.Run();
