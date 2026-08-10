using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<Clinic> Clinics { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationMember> ConversationMembers { get; set; }
    public DbSet<Message> Messages { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Composite primary key for the junction table
        modelBuilder.Entity<ConversationMember>()
            .HasKey(cm => new { cm.ConversationId, cm.UserId });

        // Seeding initial mock data as required for Day 1
        modelBuilder.Entity<Clinic>().HasData(
            new Clinic { Id = 1, Name = "Dental Clinic - Branch A" },
            new Clinic { Id = 2, Name = "Dental Clinic - Branch B" }
        );

        modelBuilder.Entity<User>().HasData(
            // Two users in Clinic A
            new User { Id = 1, Name = "Dr. Malak", ClinicId = 1 },
            new User { Id = 2, Name = "Dr. Ahmed", ClinicId = 1 },
            // One user in Clinic B (for testing clinic-level separation)
            new User { Id = 3, Name = "Dr. Sara", ClinicId = 2 }
        );
    }
}