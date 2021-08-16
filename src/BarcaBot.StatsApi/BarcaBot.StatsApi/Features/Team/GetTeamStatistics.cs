using System.Threading;
using System.Threading.Tasks;
using BarcaBot.StatsApi.Core.Helpers;
using BarcaBot.StatsApi.Core.Models.ApiFootball.Responses;
using BarcaBot.StatsApi.Infrastructure.Services;
using MediatR;

namespace BarcaBot.StatsApi.Features.Team
{
    public class GetTeamStatistics
    {
        public record Query : IRequest<TeamStatisticsResponse>;

        public record Handler(IApiFootballService ApiFootballService) : IRequestHandler<Query, TeamStatisticsResponse>
        {
            public async Task<TeamStatisticsResponse> Handle(Query request, CancellationToken cancellationToken) =>
                await ApiFootballService.GetTeamStatistics(ApiFootballIds.LaLigaId, ApiFootballIds.FcBarcelonaId);
        }
    }
}