namespace Smart_Campus_Management.Interface
{
    public interface IEmailService
    {
        Task<string> SendEmailAsync(string toEmail, string subject, string body);
    }
}
