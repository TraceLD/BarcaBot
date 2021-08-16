using System.Text.Json.Serialization;
using BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects;

namespace BarcaBot.StatsApi.Core.Models.ApiFootball.Responses
{
    public record TeamStatisticsResponse(
        League League,
        Team Team,
        string? Form,
        Fixtures Fixtures,
        Goals Goals
    )
    {
        [JsonPropertyName("clean_sheet")] public HATStatistics CleanSheets { get; set; } = null!;
        [JsonPropertyName("failed_to_score")] public HATStatistics FailedToScore { get; set; } = null!;
    }
}