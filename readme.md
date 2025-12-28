# Smart Campus Management System

A full-stack web application designed to streamline college and school operations. This project showcases modern web development practices and includes features for user management, course scheduling, and administration.

> **Note:** This project is currently in active development.

---

## ✨ Functionality

### Currently Implemented
-   **Role-Based Authentication**: Separate secure login and dashboards for **Admins**, **Faculty**, and **Students**.
-   **Admin Dashboard**: comprehensive overview of campus metrics.
-   **User Management**: Complete control to Add, Edit, and View Users (Students, Faculty, Admins).
-   **Faculty & Department Management**: Organize the campus structure with Faculties and their respective Departments.
-   **Enrollment**: Backend logic for enrolling users into courses/departments (UI in progress).

### Future Roadmap
-   **Real-Time Chat**: Direct communication platform for students and faculty.
-   **Assignment Submission**: Digital portal for assignment uploads and grading.
-   **Attendance System**: Automated and manual attendance tracking.
-   **File Storage Integration**: Cloud or local storage for user documents and media.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Styling**: Vanilla CSS (Custom Design System)
-   **Routing**: React Router DOM

### Backend
-   **Framework**: [ASP.NET Core Web API](https://dotnet.microsoft.com/) (.NET 8)
-   **Database**: SQL Server
-   **ORM**: Entity Framework Core
-   **Authentication**: JWT with HttpOnly Cookies

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   .NET SDK (8.0)
-   SQL Server (Local or Remote)
-   Git

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/PathanJunaid/Smart-Campus-Management.git
    cd Smart-Campus-Management
    ```

2.  **Backend Setup (`/ServerApp`)**
    ```bash
    # Navigate to the project directory
    cd ServerApp/Smart-Campus-Management/Smart-Campus-Management

    # Restore dependencies
    dotnet restore

    # Update the connection string in `appsettings.json`
    # Apply database migrations
    dotnet ef database update

    # Run the server
    dotnet run
    ```

3.  **Frontend Setup (`/ClientApp`)**
    ```bash
    # Navigate to the frontend folder
    cd ClientApp

    # Install dependencies
    npm install

    # Run the development server
    npm run dev
    ```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, create a feature branch, and open a pull request.

---

## 📄 License

This project is licensed under the MIT License.