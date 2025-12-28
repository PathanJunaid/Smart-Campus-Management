using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Campus_Management.Migrations
{
    /// <inheritdoc />
    public partial class EnrollmentModalUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RollNo",
                table: "Enrollments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RollNo",
                table: "Enrollments");
        }
    }
}
