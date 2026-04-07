namespace MyPortfolio.Application.Abstractions;

public interface IRealtimeNotifier
{
    Task SendViewCountAsync(int count);
}
