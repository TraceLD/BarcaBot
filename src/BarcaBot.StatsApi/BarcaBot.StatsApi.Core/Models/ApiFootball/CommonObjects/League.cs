namespace BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects
{
    public record League(
        int Id,
        string Name,
        string Country,
        string Logo,
        string Flag,
        int Season
    );
}