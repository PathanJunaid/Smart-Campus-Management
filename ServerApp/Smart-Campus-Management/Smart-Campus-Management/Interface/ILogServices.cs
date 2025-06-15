namespace Smart_Campus_Management.Interface
{
    public interface ILogServices
    {
       Task LogToDatabase(string action, string status, string details, string data);
    }
}
