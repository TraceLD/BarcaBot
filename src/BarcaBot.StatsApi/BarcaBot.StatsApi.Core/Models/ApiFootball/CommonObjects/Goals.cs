namespace BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects
{
    public record Goals(
        GoalsStatistics For,
        GoalsStatistics Against
    );
}