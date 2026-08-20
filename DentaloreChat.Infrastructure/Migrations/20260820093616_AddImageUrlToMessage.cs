using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1010101-0000-0000-0000-000000000000"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 34, 6, 190, DateTimeKind.Utc).AddTicks(9299) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 26, 6, 190, DateTimeKind.Utc).AddTicks(9267) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2010201-0000-0000-0000-000000000000"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 26, 6, 190, DateTimeKind.Utc).AddTicks(9303) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 31, 6, 190, DateTimeKind.Utc).AddTicks(9286) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 11, 6, 190, DateTimeKind.Utc).AddTicks(9291) });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                columns: new[] { "ImageUrl", "Timestamp" },
                values: new object[] { null, new DateTime(2026, 8, 20, 9, 16, 6, 190, DateTimeKind.Utc).AddTicks(9295) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Messages");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1010101-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 38, 6, 933, DateTimeKind.Utc).AddTicks(2166));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 30, 6, 933, DateTimeKind.Utc).AddTicks(2131));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2010201-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 30, 6, 933, DateTimeKind.Utc).AddTicks(2176));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 35, 6, 933, DateTimeKind.Utc).AddTicks(2148));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 15, 6, 933, DateTimeKind.Utc).AddTicks(2154));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 18, 15, 20, 6, 933, DateTimeKind.Utc).AddTicks(2160));
        }
    }
}
