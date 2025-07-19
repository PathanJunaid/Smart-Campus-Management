# Smart Campus Management System

A full-stack web application designed to streamline college and school operations. This project showcases modern web development practices and includes features for user management, course scheduling, attendance, assignments, real-time chat, and analytics.

**Note:** This project is currently in active development.

---

## ✨ Features

-   **Role-Based Access Control**: Separate dashboards and permissions for Admins, Faculty, and Students using JWT authentication.
-   **Course & Attendance Management**: Faculty can create courses and track student attendance.
-   **Assignment Submissions**: Seamless file uploads for assignments and submissions.
-   **Real-Time Chat**: Direct student-faculty communication powered by SignalR.
-   **Admin Dashboard**: Visualize campus analytics like attendance and user activity.
-   **Notifications**: Automated email and push notifications for important events.

---

## 🛠️ Tech Stack

-   **Frontend**: Angular 17+, Angular Material, Tailwind CSS, RxJS
-   **Backend**: ASP.NET Core 8 Web API, Entity Framework Core, SignalR
-   **Database**: SQL Server
-   **File Storage**: Azure Blob Storage
-   **Authentication**: JWT (JSON Web Tokens)
-   **DevOps**: GitHub Actions for CI/CD

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   .NET SDK (8.0)
-   SQL Server (for local development)
-   Git

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/PathanJunaid/Smart-Campus-Management.git](https://github.com/PathanJunaid/Smart-Campus-Management.git)
    cd Smart-Campus-Management
    ```

2.  **Backend Setup (`/ServerApp`)**
    ```bash
    # Navigate to the backend folder
    cd ServerApp

    # Install dependencies
    dotnet restore

    # Update the database connection string in appsettings.json
    # Then, apply migrations to set up the database
    dotnet ef database update

    # Run the backend server
    dotnet run
    ```

3.  **Frontend Setup (`/ClientApp`)**
    ```bash
    # Navigate to the frontend folder
    cd ClientApp

    # Install dependencies
    npm install

    # Update the backend API URL in src/environments/environment.ts
    # Then, run the frontend application
    ng serve
    ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a feature branch, and open a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

For questions or feedback, please reach out via email or open an issue on GitHub.