using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAllConversationsAndMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Conversations",
                columns: new[] { "Id", "ClinicId", "GroupName", "IsGroup" },
                values: new object[,]
                {
                    { 2, 1, null, false },
                    { 3, 1, null, false },
                    { 101, 1, "Group Chat", true }
                });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Timestamp",
                value: new DateTime(2026, 8, 11, 16, 51, 41, 512, DateTimeKind.Utc).AddTicks(4721));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Content", "Timestamp" },
                values: new object[] { "Hi Dr. Malak! Ready to discuss today's clinic schedule.", new DateTime(2026, 8, 11, 16, 56, 41, 512, DateTimeKind.Utc).AddTicks(4730) });

            migrationBuilder.InsertData(
                table: "ConversationMembers",
                columns: new[] { "ConversationId", "UserId" },
                values: new object[,]
                {
                    { 2, 1 },
                    { 2, 3 },
                    { 3, 2 },
                    { 3, 3 },
                    { 101, 1 },
                    { 101, 2 },
                    { 101, 3 }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "ConversationId", "SenderId", "Timestamp" },
                values: new object[,]
                {
                    { 3, "Hi Dr. Sara! How is Branch B operations today?", 2, 1, new DateTime(2026, 8, 11, 16, 49, 41, 512, DateTimeKind.Utc).AddTicks(4732) },
                    { 4, "Hello Dr. Malak! Everything is running smoothly at Branch B.", 2, 3, new DateTime(2026, 8, 11, 16, 54, 41, 512, DateTimeKind.Utc).AddTicks(4734) },
                    { 5, "Hi Dr. Sara, checking in from Branch A.", 3, 2, new DateTime(2026, 8, 11, 16, 53, 41, 512, DateTimeKind.Utc).AddTicks(4735) },
                    { 6, "Hi Dr. Ahmed! Patient cases are updated.", 3, 3, new DateTime(2026, 8, 11, 16, 57, 41, 512, DateTimeKind.Utc).AddTicks(4737) },
                    { 7, "Welcome doctors to our Dental Clinic Team Group Chat! 👋", 101, 1, new DateTime(2026, 8, 11, 16, 36, 41, 512, DateTimeKind.Utc).AddTicks(4739) },
                    { 8, "Great to have a shared channel for Branch A and Branch B!", 101, 2, new DateTime(2026, 8, 11, 16, 41, 41, 512, DateTimeKind.Utc).AddTicks(4740) },
                    { 9, "Dr. Sara joining from Branch B! Ready to collaborate.", 101, 3, new DateTime(2026, 8, 11, 16, 46, 41, 512, DateTimeKind.Utc).AddTicks(4742) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 2, 1 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 2, 3 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 3, 2 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 3, 3 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 101, 1 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 101, 2 });

            migrationBuilder.DeleteData(
                table: "ConversationMembers",
                keyColumns: new[] { "ConversationId", "UserId" },
                keyValues: new object[] { 101, 3 });

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Conversations",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Conversations",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Conversations",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Timestamp",
                value: new DateTime(2026, 8, 10, 12, 37, 14, 203, DateTimeKind.Utc).AddTicks(9382));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Content", "Timestamp" },
                values: new object[] { "Hi Dr. Malak! Ready to test the chat POC.", new DateTime(2026, 8, 10, 12, 42, 14, 203, DateTimeKind.Utc).AddTicks(9388) });
        }
    }
}
