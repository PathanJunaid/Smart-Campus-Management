using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Smart_Campus_Management.Migrations
{
    /// <inheritdoc />
    public partial class FacultyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Faculty_Model_FacultyId",
                table: "Departments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Faculty_Model",
                table: "Faculty_Model");

            migrationBuilder.RenameTable(
                name: "Faculty_Model",
                newName: "Faculty");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Faculty",
                table: "Faculty",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Faculty_FacultyId",
                table: "Departments",
                column: "FacultyId",
                principalTable: "Faculty",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Departments_Faculty_FacultyId",
                table: "Departments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Faculty",
                table: "Faculty");

            migrationBuilder.RenameTable(
                name: "Faculty",
                newName: "Faculty_Model");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Faculty_Model",
                table: "Faculty_Model",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Departments_Faculty_Model_FacultyId",
                table: "Departments",
                column: "FacultyId",
                principalTable: "Faculty_Model",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
