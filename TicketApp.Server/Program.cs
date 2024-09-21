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
builder.Services.AddSignalR();
builder.Services.AddTransient<AppStatsService>();
builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDataContext>()
    .AddApiEndpoints();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
}).AddCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddDbContext<ApplicationDataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("default")));

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 5;
    options.SignIn.RequireConfirmedEmail = false;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


if (app.Environment.IsDevelopment())
{
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // allow any origin
        .AllowCredentials()); 
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.MapGroup("api").MapCustomIdentityApi<User>();
app.MapControllers();
app.MapHub<TicketHub>("/ticket-hub");

app.MapPost("/api/ping", async (ClaimsPrincipal user, UserManager<User> userManager) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var username = user.FindFirstValue(ClaimTypes.Name)?.Replace("_", " ");
    var hasAuth = email != null && !string.IsNullOrEmpty(email);

    var userModel = await userManager.GetUserAsync(user);
    IList<string>? roles = null;
    if (userModel != null)
    {
        roles = await userManager.GetRolesAsync(userModel);
    }

    string? role = roles?.FirstOrDefault();
    return Results.Json(new { id, email, username, hasAuth, role });
});

app.MapPost("/api/logout", async (SignInManager<User> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
});

app.MapPost("/api/set-to-admin", async (ClaimsPrincipal user, UserManager<User> userManager, ApplicationDataContext dataContext) =>
{
    if (!user.Identity?.IsAuthenticated ?? false) return Results.BadRequest();

    var userModel = await userManager.GetUserAsync(user);
    if (userModel == null) return Results.BadRequest();
    
    dataContext.Users.Update(userModel);
    userModel.Admin = true;
    await dataContext.SaveChangesAsync();
    
    await userManager.AddToRoleAsync(userModel, "Admin");
    return Results.Ok();
});

app.MapPost("/api/set-to-user", async (ClaimsPrincipal user, ApplicationDataContext dataContext, UserManager<User> userManager) =>
{
    if (!user.Identity?.IsAuthenticated ?? false) return Results.BadRequest();

    var userModel =
        await dataContext.Users.FirstOrDefaultAsync(x => x.Email == user.FindFirstValue(ClaimTypes.Email));
    if (userModel == null) return Results.BadRequest();

    dataContext.Users.Update(userModel);
    userModel.Admin = false;
    await dataContext.SaveChangesAsync();
    
    await userManager.RemoveFromRoleAsync(userModel, "Admin");
    return Results.Ok();
});

app.MapFallbackToFile("/index.html");
app.Run();
