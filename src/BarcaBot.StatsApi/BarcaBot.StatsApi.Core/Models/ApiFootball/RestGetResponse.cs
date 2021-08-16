using System.Collections.Generic;
using BarcaBot.StatsApi.Core.Models.ApiFootball.CommonObjects;

namespace BarcaBot.StatsApi.Core.Models.ApiFootball
{
    public record RestGetResponse<TResponse>(
        string Get,
        Dictionary<string, string> Parameters,
        int Results,
        PagingInformation Paging,
        TResponse Response
    );
}