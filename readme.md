Smart Campus Management System
A full-stack web application designed to streamline college and school operations, including user management, course scheduling, attendance tracking, assignment submissions, real-time chat, and analytics. Built with Angular (frontend) and ASP.NET Core (backend), deployed on Azure with CI/CD pipelines, this project showcases modern web development practices and real-world functionality.
Features

Role-Based User Management: Separate dashboards for Students, Faculty, and Admins with JWT authentication.
Course & Attendance Management: Faculty can create courses and track attendance; students can view their records.
Assignment Uploads & Submissions: File uploads for assignments and submissions using Azure Blob Storage.
Real-Time Chat: Student-Faculty communication powered by SignalR, with announcement broadcasts.
Timetable & Event Calendar: Manage course schedules and events.
Admin Dashboard with Analytics: Visualize attendance, grades, and user activity with Chart.js.
Notifications: Email and push notifications for assignments and messages.
Admin Controls: Manage users, departments, and roles.

Tech Stack

Frontend: Angular 17+, Angular Material, Tailwind CSS, RxJS, Chart.js
Backend: ASP.NET Core 8 Web API, Entity Framework Core, SignalR, JWT Authentication
Database: SQL Server (Azure SQL)
Storage: Azure Blob Storage for file uploads
DevOps: Azure App Service, GitHub Actions for CI/CD, Docker (optional)
Other: SMTP (SendGrid) for email notifications

Prerequisites

Node.js (v18+)
.NET SDK (8.0)
Azure Account (for Blob Storage, SQL, App Service)
SQL Server (local for development, Azure SQL for production)
Git
Visual Studio Code or Visual Studio 2022 (recommended)

Setup Instructions
1. Clone the Repository
git clone https://github.com/Smart-Campus-Management.git
cd SmartCampus

2. Backend Setup (ServerApp)

Navigate to the backend folder:cd ServerApp


Install .NET dependencies:dotnet restore


Configure the database:
Update the connection string in appsettings.json for local SQL Server or Azure SQL.
Run migrations to create the database:dotnet ef database update




Configure Azure Blob Storage and SMTP:
Add Blob Storage connection string and SendGrid API key in appsettings.json.


Run the backend:dotnet run

The API will be available at https://localhost:5001.

3. Frontend Setup (ClientApp)

Navigate to the frontend folder:cd ClientApp


Install Node dependencies:npm install


Configure environment variables:
Update src/environments/environment.ts with the backend API URL (e.g., https://localhost:5001).


Run the frontend:ng serve

The app will be available at http://localhost:4200.

4. Database Setup

Ensure SQL Server is running.
Use the provided SQL Scripts/ folder to create tables manually (optional if using EF Core migrations).
Seed initial data (e.g., roles, admin user) via the backend API or SQL scripts.

Deployment
The application is deployed on Azure using Azure App Service for both frontend and backend, with Azure SQL for the database and Azure Blob Storage for file uploads.
CI/CD Pipeline

GitHub Actions is used for CI/CD.
Workflow files are located in .github/workflows/.
Steps:
Build and test the Angular app (ng build --prod).
Build and publish the .NET app (dotnet publish).
Deploy to Azure App Service.



Deployment Steps

Create an Azure App Service for frontend and backend.
Set up an Azure SQL database and update the connection string.
Configure environment variables in Azure (JWT secret, Blob Storage keys, SMTP settings).
Push changes to the GitHub repository to trigger the CI/CD pipeline.
Access the deployed app via the Azure-provided URL.

API Documentation

The backend API is documented using Swagger.
Access it at https://<your-api-url>/swagger when the backend is running.
Key endpoints:
POST /api/auth/register: Register a new user.
POST /api/auth/login: Authenticate and receive a JWT token.
GET /api/courses: List all courses (role-based access).
POST /api/assignments/{id}/upload: Upload assignment files.



Project Structure
SmartCampus/
├── ClientApp/              # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── environments/
│   └── package.json
├── ServerApp/              # ASP.NET Core backend
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── SignalR/
│   └── appsettings.json
├── SQL Scripts/            # SQL scripts for database setup
└── README.md

Testing

Backend: Unit tests for services using xUnit (ServerApp.Tests/).
Frontend: Unit tests for components/services using Jasmine/Karma (ClientApp/src/app/tests/).
End-to-End: Cypress tests for critical user flows (ClientApp/cypress/).
Run tests:# Backend
cd ServerApp
dotnet test

# Frontend
cd ClientApp
ng test
ng e2e



Screenshots
Later
Demo
Later
Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License.
Contact
For questions or feedback, reach out to <me.zunaidkhan@gmail.com> or open an issue on GitHub.
