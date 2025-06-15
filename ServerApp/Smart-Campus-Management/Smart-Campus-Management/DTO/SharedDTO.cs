namespace Smart_Campus_Management.DTO
{
    public class SharedDTO
    {
    }
    public class ServiceResponse<T>{
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? data { get; set; }

    }
}
