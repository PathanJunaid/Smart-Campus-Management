using Microsoft.EntityFrameworkCore;
using Smart_Campus_Management.Interface;
using Smart_Campus_Management.Models;

namespace Smart_Campus_Management.Services
{
    public class LogServices : ILogServices
    {
        private readonly AppDbContext _context;

        public LogServices( AppDbContext context)
        {
            _context = context;
        }

        public async Task LogToDatabase(string action, string status, string details, string data)
        {
            var logEntry = new LogEntry
            {
                Action = action,
                Status = status,
                Details = details,
                Data = data ?? "{}",
                CreatedAt = DateTime.UtcNow
            };
            await _context.LogEntries.AddAsync(logEntry);
            await _context.SaveChangesAsync();
        }
    }
}
