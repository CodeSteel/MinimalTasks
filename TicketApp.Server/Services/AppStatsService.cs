using TicketApp.Server.Models;

namespace TicketApp.Server.Services;

public class AppStatsService
{
    private readonly ApplicationDataContext _dataContext;

    public AppStatsService(ApplicationDataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    public async Task AddToStat(AppStatType type, int amount)
    {
        AppStat? stat = await _dataContext.AppStats.FindAsync(type);
        if (stat != null)
        {
            _dataContext.AppStats.Update(stat);
            stat.Value += amount;
        }
        else
        {
            stat = new AppStat()
                { AppStatType = type, Value = amount };
            await _dataContext.AppStats.AddAsync(stat);
        }

        await _dataContext.SaveChangesAsync();
    }
}