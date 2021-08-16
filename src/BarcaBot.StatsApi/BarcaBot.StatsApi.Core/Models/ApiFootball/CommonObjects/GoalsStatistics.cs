namespace BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects
{
    public record GoalsStatistics(
        HATStatistics Total,
        HATAverageStatistics Average
    );
}