using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using BarcaBot.StatsApi.Core.Models.ApiFootball;
using BarcaBot.StatsApi.Core.Models.ApiFootball.Responses;
using Microsoft.Extensions.Logging;

namespace BarcaBot.StatsApi.Infrastructure.Services
{
    public interface IApiFootballService
    {
        Task<TeamStatisticsResponse> GetTeamStatistics(int leagueId, int teamId);
    }
    
    public class ApiFootballService : IApiFootballService
    {
        private readonly ILogger<ApiFootballService> _logger;
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonOptions;
        private readonly ApiFootballSettings _apiSettings;

        public ApiFootballService(ILogger<ApiFootballService> logger, HttpClient httpClient, ApiFootballSettings apiSettings)
        {
            httpClient.BaseAddress = new Uri("https://api-football-v1.p.rapidapi.com/v3/");
            httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");
            httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", apiSettings.Token);

            _logger = logger;
            _httpClient = httpClient;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            _apiSettings = apiSettings;
        }

        public async Task<TeamStatisticsResponse> GetTeamStatistics(int leagueId, int teamId)
        {
            var response = await _httpClient.GetAsync($"teams/statistics?league={leagueId}&team={teamId}&season={_apiSettings.Season}");
            
            response.EnsureSuccessStatusCode();
            
            var responseContent = await response.Content.ReadAsStreamAsync();
            var deserializedContent = await JsonSerializer.DeserializeAsync<RestGetResponse<TeamStatisticsResponse>>(responseContent, _jsonOptions);

            if (deserializedContent is null)
            {
                throw new JsonException("Raw response was null");
            }
            
            return deserializedContent.Response;
        }
    }
}