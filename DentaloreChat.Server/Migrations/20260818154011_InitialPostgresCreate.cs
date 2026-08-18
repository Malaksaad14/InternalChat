using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DentaloreChat.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgresCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clinics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clinics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsGroup = table.Column<bool>(type: "boolean", nullable: false),
                    GroupName = table.Column<string>(type: "text", nullable: true),
                    ClinicId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    ClinicId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Clinics_ClinicId",
                        column: x => x.ClinicId,
                        principalTable: "Clinics",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConversationMembers",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationMembers", x => new { x.ConversationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Clinics",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "Dental Clinic - Branch A" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Dental Clinic - Branch B" }
                });

            migrationBuilder.InsertData(
                table: "Conversations",
                columns: new[] { "Id", "ClinicId", "GroupName", "IsGroup" },
                values: new object[,]
                {
                    { new Guid("c1010101-1111-1111-1111-111111111111"), new Guid("11111111-1111-1111-1111-111111111111"), "Group Chat", true },
                    { new Guid("c1020202-2222-2222-2222-222222222222"), new Guid("22222222-2222-2222-2222-222222222222"), "Clinic B Group Chat", true },
                    { new Guid("c1111111-1111-1111-1111-111111111111"), new Guid("11111111-1111-1111-1111-111111111111"), null, false },
                    { new Guid("c4444444-4444-4444-4444-444444444444"), new Guid("22222222-2222-2222-2222-222222222222"), null, false }
                });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "Content", "ConversationId", "SenderId", "Timestamp" },
                values: new object[,]
                {
                    { new Guid("b1010101-0000-0000-0000-000000000000"), "Hi Dr. Sara, checking in from Branch B!", new Guid("c4444444-4444-4444-4444-444444444444"), new Guid("a4444444-4444-4444-4444-444444444444"), new DateTime(2026, 8, 18, 15, 38, 6, 933, DateTimeKind.Utc).AddTicks(2166) },
                    { new Guid("b1111111-1111-1111-1111-111111111111"), "Hello Dr. Ahmed, welcome to Dentalore!", new Guid("c1111111-1111-1111-1111-111111111111"), new Guid("a1111111-1111-1111-1111-111111111111"), new DateTime(2026, 8, 18, 15, 30, 6, 933, DateTimeKind.Utc).AddTicks(2131) },
                    { new Guid("b2010201-0000-0000-0000-000000000000"), "Welcome to Branch B group chat!", new Guid("c1020202-2222-2222-2222-222222222222"), new Guid("a3333333-3333-3333-3333-333333333333"), new DateTime(2026, 8, 18, 15, 30, 6, 933, DateTimeKind.Utc).AddTicks(2176) },
                    { new Guid("b2222222-2222-2222-2222-222222222222"), "Hi Dr. Hana! Ready to discuss today's clinic schedule.", new Guid("c1111111-1111-1111-1111-111111111111"), new Guid("a2222222-2222-2222-2222-222222222222"), new DateTime(2026, 8, 18, 15, 35, 6, 933, DateTimeKind.Utc).AddTicks(2148) },
                    { new Guid("b7777777-7777-7777-7777-777777777777"), "Welcome doctors to our Branch A Team Group Chat! 👋", new Guid("c1010101-1111-1111-1111-111111111111"), new Guid("a1111111-1111-1111-1111-111111111111"), new DateTime(2026, 8, 18, 15, 15, 6, 933, DateTimeKind.Utc).AddTicks(2154) },
                    { new Guid("b8888888-8888-8888-8888-888888888888"), "Great to have a shared channel!", new Guid("c1010101-1111-1111-1111-111111111111"), new Guid("a2222222-2222-2222-2222-222222222222"), new DateTime(2026, 8, 18, 15, 20, 6, 933, DateTimeKind.Utc).AddTicks(2160) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "ClinicId", "Name" },
                values: new object[,]
                {
                    { new Guid("a1111111-1111-1111-1111-111111111111"), new Guid("11111111-1111-1111-1111-111111111111"), "Dr. Hana" },
                    { new Guid("a2222222-2222-2222-2222-222222222222"), new Guid("11111111-1111-1111-1111-111111111111"), "Dr. Ahmed" },
                    { new Guid("a3333333-3333-3333-3333-333333333333"), new Guid("22222222-2222-2222-2222-222222222222"), "Dr. Sara" },
                    { new Guid("a4444444-4444-4444-4444-444444444444"), new Guid("22222222-2222-2222-2222-222222222222"), "Dr. Omar" }
                });

            migrationBuilder.InsertData(
                table: "ConversationMembers",
                columns: new[] { "ConversationId", "UserId" },
                values: new object[,]
                {
                    { new Guid("c1010101-1111-1111-1111-111111111111"), new Guid("a1111111-1111-1111-1111-111111111111") },
                    { new Guid("c1010101-1111-1111-1111-111111111111"), new Guid("a2222222-2222-2222-2222-222222222222") },
                    { new Guid("c1020202-2222-2222-2222-222222222222"), new Guid("a3333333-3333-3333-3333-333333333333") },
                    { new Guid("c1020202-2222-2222-2222-222222222222"), new Guid("a4444444-4444-4444-4444-444444444444") },
                    { new Guid("c1111111-1111-1111-1111-111111111111"), new Guid("a1111111-1111-1111-1111-111111111111") },
                    { new Guid("c1111111-1111-1111-1111-111111111111"), new Guid("a2222222-2222-2222-2222-222222222222") },
                    { new Guid("c4444444-4444-4444-4444-444444444444"), new Guid("a3333333-3333-3333-3333-333333333333") },
                    { new Guid("c4444444-4444-4444-4444-444444444444"), new Guid("a4444444-4444-4444-4444-444444444444") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMembers_UserId",
                table: "ConversationMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ClinicId",
                table: "Users",
                column: "ClinicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConversationMembers");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropTable(
                name: "Clinics");
        }
    }
}
