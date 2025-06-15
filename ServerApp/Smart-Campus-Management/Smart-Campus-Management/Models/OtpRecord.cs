using System.ComponentModel.DataAnnotations;

namespace Smart_Campus_Management.Models
{
    public class OtpRecord
    {
        [Key] 
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public int OTP { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
