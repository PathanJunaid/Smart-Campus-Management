using Microsoft.Extensions.Options;
using Smart_Campus_Management.DTO;
using System.Net.Mail;
using System.Net;
using Smart_Campus_Management.Interface;
using System.Text.Json;

namespace Smart_Campus_Management.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task<string> SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
                {
                    Port = _emailSettings.Port,
                    Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.AppPassword),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false, // Set this to true for HTML emails
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                return "Email sent successfully.";
            }
            catch (Exception ex)
            {
                // Handle any exceptions, like failed email sending
                Console.WriteLine("Error sending email: " + ex.Message);
                return $"Error sending email: {ex.Message}";
            }
        }
    }


}
