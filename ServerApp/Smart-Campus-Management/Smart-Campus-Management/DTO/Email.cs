namespace Smart_Campus_Management.DTO
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string SenderEmail { get; set; }
        public string AppPassword { get; set; }
        public string SenderName { get; set; }
    }
}
