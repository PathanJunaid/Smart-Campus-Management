using Microsoft.OpenApi.Models;
using Smart_Campus_Management.Services;
using System.Text.Json.Serialization;
using Smart_Campus_Management.Models;
using Smart_Campus_Management.DTO;
using Microsoft.AspNetCore.Identity;
using Smart_Campus_Management.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Smart_Campus_Management;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

var builder = WebApplication.CreateBuilder(args);

// Enable console logging (shows up in EB logs)
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

Console.WriteLine("=== Smart-Campus-Management starting ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");

// EPPlus license
ExcelPackage.License.SetNonCommercialPersonal("Junaid Khan");

// Retrieve JWT settings from configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
Console.WriteLine($"Jwt section found: {jwtSettings.Exists()}");

// Validate JWTSECRET early and log if missing
var jwtSecret = jwtSettings["JWTSECRET"];
if (string.IsNullOrWhiteSpace(jwtSecret))
{
    Console.WriteLine("ERROR: Jwt:JWTSECRET is missing or empty in configuration.");
    throw new InvalidOperationException("JWTSECRET is missing in configuration");
}
else
{
    Console.WriteLine("Jwt:JWTSECRET is present (value hidden for security).");
}

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<EmailService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://localhost:5173",
                "http://localhost:5000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// Add Authentication with JWT Bearer
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = builder.Environment.IsProduction(); // Only require HTTPS in production
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["ValidIssuer"],
            ValidAudience = jwtSettings["ValidAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// Register Controllers and Services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Db Services 
builder.Services.AddScoped<IUserServices, UserServices>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<ILogServices, LogServices>();
builder.Services.AddScoped<IDepartmentServices, DepartmentServices>();
builder.Services.AddScoped<IFacultyServices, FacultyServices>();
builder.Services.AddScoped<IEnrollmentServices, EnrollmentServices>();

// Add Swagger with Bearer Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Basic Auth API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {your_token}'",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database Configuration
string connectionString;

if (builder.Environment.IsDevelopment())
{
    Console.WriteLine("Using Development connection string (DefaultConnection).");
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        Console.WriteLine("ERROR: DefaultConnection missing in appsettings.Development.json");
        throw new InvalidOperationException(
            "Local DB connection string 'DefaultConnection' missing in appsettings.Development.json");
    }
}
else
{
    Console.WriteLine("Using Production connection string (DefaultConnection).");
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        Console.WriteLine("ERROR: DefaultConnection missing in Production configuration.");
        Console.WriteLine("TIP: On Elastic Beanstalk, set env var ConnectionStrings__DefaultConnection.");
        throw new InvalidOperationException(
            "Environment variable 'DefaultConnection' is missing in Production.");
    }
}

Console.WriteLine("Connection string found (value hidden for security).");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline
Console.WriteLine("Configuring HTTP request pipeline...");

// Swagger: keep enabled always if you prefer
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Basic Auth API V1");
    c.RoutePrefix = "swagger"; // Access Swagger at /swagger
});

app.UseHttpsRedirection();

// Apply CORS policy before Authentication/Authorization
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

Console.WriteLine("=== Smart-Campus-Management app is starting to run ===");
app.Run();
