using MyPortfolio.Application.Abstractions.Realtime;

namespace MyPortfolio.Infrastructure.Realtime;

public class ProfileViewService : IProfileViewService
{
    private int _count = 0;
    public int GetCount()
    {
        return _count;
    }

    public int Increment()
    {
        _count++;
        return _count;
    }
}
