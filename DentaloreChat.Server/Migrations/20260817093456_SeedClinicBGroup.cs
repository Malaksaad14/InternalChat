using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedClinicBGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Conversations",
                columns: new[] { "Id", "ClinicId", "GroupName", "IsGroup" },
                values: new object[] { 102, 2, "Clinic B Group Chat", true });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Timestamp",
                value: new DateTime(2026, 8, 17, 9, 24, 55, 498, DateTimeKind.Utc).AddTicks(7176));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Timestamp",
                value: new DateTime(2026, 8, 17, 9, 29, 55, 498, DateTimeKind.Utc).AddTicks(7184));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 7,
                column: "Timestamp",
                value: new DateTime(2026, 8, 17, 9, 9, 55, 498, DateTimeKind.Utc).AddTicks(7186));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 8,
                column: "Timestamp",
                value: new DateTime(2026, 8, 17, 9, 14, 55, 498, DateTimeKind.Utc).AddTicks(7187));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 10,
                column: "Timestamp",
                value: new DateTime(2026, 8, 17, 9, 32, 55, 498, DateTimeKind.Utc).AddTicks(7189));

            migrationBuilder.InsertData(
                table: "ConversationMembers",
                columns: new[] { "ConversationId", "UserId" },
                values: new object[,]
                {
                    { 102, 3 },
                    { 102, 4 }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "ConversationId", "SenderId", "Timestamp" },
                values: new object[] { 201, "Welcome to Branch B group chat!", 102, 3, new DateTime(2026, 8, 17, 9, 24, 55, 498, DateTimeKind.Utc).AddTicks(7191) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 102, 3 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 102, 4 });

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 201);

            migrationBuilder.DeleteData(
                table: "Conversations",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Timestamp",
                value: new DateTime(2026, 8, 12, 8, 53, 54, 434, DateTimeKind.Utc).AddTicks(4204));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                column: "Timestamp",
                value: new DateTime(2026, 8, 12, 8, 58, 54, 434, DateTimeKind.Utc).AddTicks(4218));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 7,
                column: "Timestamp",
                value: new DateTime(2026, 8, 12, 8, 38, 54, 434, DateTimeKind.Utc).AddTicks(4220));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 8,
                column: "Timestamp",
                value: new DateTime(2026, 8, 12, 8, 43, 54, 434, DateTimeKind.Utc).AddTicks(4221));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 10,
                column: "Timestamp",
                value: new DateTime(2026, 8, 12, 9, 1, 54, 434, DateTimeKind.Utc).AddTicks(4223));
        }
    }
}
