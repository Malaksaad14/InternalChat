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
        // Conversations
        modelBuilder.Entity<Conversation>().HasData(
            // Direct chat between Dr. Malak (1) and Dr. Ahmed (2)
            new Conversation { Id = 1, ClinicId = 1, IsGroup = false },
            // Direct chat between Dr. Malak (1) and Dr. Sara (3)
            new Conversation { Id = 2, ClinicId = 1, IsGroup = false },
            // Direct chat between Dr. Ahmed (2) and Dr. Sara (3)
            new Conversation { Id = 3, ClinicId = 1, IsGroup = false },
            // Group chat with all doctors
            new Conversation { Id = 101, ClinicId = 1, IsGroup = true, GroupName = "Group Chat" }
        );

        // Conversation Members
        modelBuilder.Entity<ConversationMember>().HasData(
            // Conversation 1: Malak and Ahmed
            new ConversationMember { ConversationId = 1, UserId = 1 },
            new ConversationMember { ConversationId = 1, UserId = 2 },
            // Conversation 2: Malak and Sara
            new ConversationMember { ConversationId = 2, UserId = 1 },
            new ConversationMember { ConversationId = 2, UserId = 3 },
            // Conversation 3: Ahmed and Sara
            new ConversationMember { ConversationId = 3, UserId = 2 },
            new ConversationMember { ConversationId = 3, UserId = 3 },
            // Conversation 101: Group chat with all users
            new ConversationMember { ConversationId = 101, UserId = 1 },
            new ConversationMember { ConversationId = 101, UserId = 2 },
            new ConversationMember { ConversationId = 101, UserId = 3 }
        );

        // Messages (from React hardcoded data)
        modelBuilder.Entity<Message>().HasData(
            // Conversation 1: Malak & Ahmed
            new Message { Id = 1, ConversationId = 1, SenderId = 1, Content = "Hello Dr. Ahmed, welcome to Dentalore!", Timestamp = DateTime.UtcNow.AddMinutes(-10) },
            new Message { Id = 2, ConversationId = 1, SenderId = 2, Content = "Hi Dr. Malak! Ready to discuss today's clinic schedule.", Timestamp = DateTime.UtcNow.AddMinutes(-5) },
            
            // Conversation 2: Malak & Sara
            new Message { Id = 3, ConversationId = 2, SenderId = 1, Content = "Hi Dr. Sara! How is Branch B operations today?", Timestamp = DateTime.UtcNow.AddMinutes(-12) },
            new Message { Id = 4, ConversationId = 2, SenderId = 3, Content = "Hello Dr. Malak! Everything is running smoothly at Branch B.", Timestamp = DateTime.UtcNow.AddMinutes(-7) },
            
            // Conversation 3: Ahmed & Sara
            new Message { Id = 5, ConversationId = 3, SenderId = 2, Content = "Hi Dr. Sara, checking in from Branch A.", Timestamp = DateTime.UtcNow.AddMinutes(-8) },
            new Message { Id = 6, ConversationId = 3, SenderId = 3, Content = "Hi Dr. Ahmed! Patient cases are updated.", Timestamp = DateTime.UtcNow.AddMinutes(-4) },
            
            // Conversation 101: Group Chat
            new Message { Id = 7, ConversationId = 101, SenderId = 1, Content = "Welcome doctors to our Dental Clinic Team Group Chat! 👋", Timestamp = DateTime.UtcNow.AddMinutes(-25) },
            new Message { Id = 8, ConversationId = 101, SenderId = 2, Content = "Great to have a shared channel for Branch A and Branch B!", Timestamp = DateTime.UtcNow.AddMinutes(-20) },
            new Message { Id = 9, ConversationId = 101, SenderId = 3, Content = "Dr. Sara joining from Branch B! Ready to collaborate.", Timestamp = DateTime.UtcNow.AddMinutes(-15) }
        );
    }
}