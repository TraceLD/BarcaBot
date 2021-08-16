namespace BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects
{
    /// <summary>
    /// Home, away, total statistics.
    /// </summary>
    /// <param name="Home">Home statistics</param>
    /// <param name="Away">Away statistics</param>
    /// <param name="Total">Total statistics</param>
    public record HATStatistics(
        double Home,
        double Away,
        double Total
    );
}