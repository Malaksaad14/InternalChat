using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMessageReactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Emoji = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reactions_Messages_MessageId",
                        column: x => x.MessageId,
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1010101-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 13, 6, 42, 170, DateTimeKind.Utc).AddTicks(4423));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 12, 58, 42, 170, DateTimeKind.Utc).AddTicks(4397));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2010201-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 12, 58, 42, 170, DateTimeKind.Utc).AddTicks(4427));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 13, 3, 42, 170, DateTimeKind.Utc).AddTicks(4408));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 12, 43, 42, 170, DateTimeKind.Utc).AddTicks(4412));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 12, 48, 42, 170, DateTimeKind.Utc).AddTicks(4419));

            migrationBuilder.CreateIndex(
                name: "IX_Reactions_MessageId",
                table: "Reactions",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reactions_UserId",
                table: "Reactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reactions");

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1010101-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 34, 6, 190, DateTimeKind.Utc).AddTicks(9299));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b1111111-1111-1111-1111-111111111111"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 26, 6, 190, DateTimeKind.Utc).AddTicks(9267));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2010201-0000-0000-0000-000000000000"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 26, 6, 190, DateTimeKind.Utc).AddTicks(9303));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b2222222-2222-2222-2222-222222222222"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 31, 6, 190, DateTimeKind.Utc).AddTicks(9286));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b7777777-7777-7777-7777-777777777777"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 11, 6, 190, DateTimeKind.Utc).AddTicks(9291));

            migrationBuilder.UpdateData(
                table: "Messages",
                keyColumn: "Id",
                keyValue: new Guid("b8888888-8888-8888-8888-888888888888"),
                column: "Timestamp",
                value: new DateTime(2026, 8, 20, 9, 16, 6, 190, DateTimeKind.Utc).AddTicks(9295));
        }
    }
}
