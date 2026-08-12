using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMalakToHana : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                columns: new[] { "Content", "Timestamp" },
                values: new object[] { "Hi Dr. Hana! Ready to discuss today's clinic schedule.", new DateTime(2026, 8, 12, 8, 58, 54, 434, DateTimeKind.Utc).AddTicks(4218) });

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

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Dr. Hana");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 1,
                column: "Timestamp",
                value: new DateTime(2026, 8, 11, 21, 15, 21, 131, DateTimeKind.Utc).AddTicks(8303));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Content", "Timestamp" },
                values: new object[] { "Hi Dr. Malak! Ready to discuss today's clinic schedule.", new DateTime(2026, 8, 11, 21, 20, 21, 131, DateTimeKind.Utc).AddTicks(8311) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 7,
                column: "Timestamp",
                value: new DateTime(2026, 8, 11, 21, 0, 21, 131, DateTimeKind.Utc).AddTicks(8313));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 8,
                column: "Timestamp",
                value: new DateTime(2026, 8, 11, 21, 5, 21, 131, DateTimeKind.Utc).AddTicks(8314));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: 10,
                column: "Timestamp",
                value: new DateTime(2026, 8, 11, 21, 23, 21, 131, DateTimeKind.Utc).AddTicks(8316));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "Dr. Malak");
        }
    }
}
