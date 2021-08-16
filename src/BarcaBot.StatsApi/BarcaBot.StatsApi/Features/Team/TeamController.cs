using System.Threading.Tasks;
using BarcaBot.StatsApi.Core.Models.ApiFootball.Responses;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BarcaBot.StatsApi.Features.Team
{
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ILogger<TeamController> _logger;
        private readonly IMediator _mediator;

        public TeamController(ILogger<TeamController> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        [HttpGet("api/team")]
        public async Task<ActionResult<TeamStatisticsResponse>> GetTeamStatistics()
        {
            var response = await _mediator.Send(new GetTeamStatistics.Query());
            return Ok(response);
        }
    }
}