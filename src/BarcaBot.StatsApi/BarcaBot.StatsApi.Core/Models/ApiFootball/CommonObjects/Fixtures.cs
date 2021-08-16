namespace BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects
{
    public record Fixtures(
        HATStatistics Played,
        HATStatistics Wins,
        HATStatistics Draws,
        HATStatistics Loses
    );
}