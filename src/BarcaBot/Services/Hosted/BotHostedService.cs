﻿using System;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Discord;
using Discord.WebSocket;

using BarcaBot.Extensions;
using BarcaBot.DataModels.Core;

namespace BarcaBot.Services.Hosted
{
    public class BotHostedService : IBotService
    {
        private readonly IOptions<Settings> _settings;
        private readonly ILogger<BotHostedService> _logger;
        private readonly IHostApplicationLifetime _applicationLifetime;
        
        public DiscordSocketClient DiscordClient { get; private set; }
        
        public BotHostedService(
            IOptions<Settings> settings,
            ILogger<BotHostedService> logger,
            IHostApplicationLifetime applicationLifetime
            )
        {
            _settings = settings;
            _logger = logger;
            _applicationLifetime = applicationLifetime;
            
            DiscordClient = new DiscordSocketClient();
        }
        
        public void ExecuteHandlerAsynchronously<TReturn>(Func<DiscordSocketClient, Task<TReturn>> handler, Action<TReturn> callback)
        {
            if(DiscordClient.ConnectionState != ConnectionState.Connected)
            {
                _logger.LogWarning("A handler attempted to execute a handler while the bot was disconnected");
                
                return;
            }

            // explicitly fire & forget the handler to prevent blocking the gateway;
            _ = handler(DiscordClient).ContinueWith(cb => callback(cb.Result));
        }
        
        private Task BotDisconnected(Exception arg)
        {
            
            if(arg is GatewayReconnectException)
            {
                return Task.CompletedTask;
            }

            _logger.LogCritical(arg, "Discord disconnected with a non-resumable error");
            _applicationLifetime.StopApplication();
            
            return Task.CompletedTask;
        }
        
        private Task BotLoggedIn()
        {
            _logger.LogInformation("Bot has logged into Discord");
            
            return Task.CompletedTask;
        }
        
        private Task BotLog(LogMessage arg)
        {
            var message = $"{arg.Source}: {arg.Message}";
            
            if (arg.Exception is null)
            {
                _logger.Log(arg.Severity.ToLogLevel(), message);
            }
            else
            {
                _logger.Log(arg.Severity.ToLogLevel(), arg.Exception, message);
            }

            return Task.CompletedTask;
        }
        
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            DiscordClient = new DiscordSocketClient(new DiscordSocketConfig
            {
                ConnectionTimeout = 30000,
                DefaultRetryMode = RetryMode.AlwaysRetry,
                LogLevel = LogSeverity.Debug,
                UseSystemClock = true
            });

            DiscordClient.LoggedIn += BotLoggedIn;
            DiscordClient.Disconnected += BotDisconnected;
            DiscordClient.Log += BotLog;

            var token = _settings.Value.Discord.Token;
            
            await DiscordClient.LoginAsync(TokenType.Bot, token);
            await DiscordClient.StartAsync();
        }
        
        public async Task StopAsync(CancellationToken cancellationToken)
        {
            if (DiscordClient is null)
            {
                return;
            }

            await DiscordClient.SetStatusAsync(UserStatus.Offline);
            await DiscordClient.StopAsync();
        }
        
        public ValueTask DisposeAsync()
        {
            DiscordClient?.Dispose();

            return new ValueTask();
        }
    }
}