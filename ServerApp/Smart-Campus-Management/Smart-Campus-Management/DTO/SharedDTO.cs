namespace Smart_Campus_Management.DTO
{
    public class SharedDTO
    {
    }
    public class ServiceResponse<T>{
        public bool Success { get; set; } = false;
        public string Message { get; set; }
        public T? data { get; set; }

    }
}
