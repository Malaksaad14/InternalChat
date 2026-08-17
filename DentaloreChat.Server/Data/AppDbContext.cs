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

        modelBuilder.Entity<ConversationMember>()
            .HasKey(cm => new { cm.ConversationId, cm.UserId });

        modelBuilder.Entity<Clinic>().HasData(
            new Clinic { Id = 1, Name = "Dental Clinic - Branch A" },
            new Clinic { Id = 2, Name = "Dental Clinic - Branch B" }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Dr. Hana", ClinicId = 1 },
            new User { Id = 2, Name = "Dr. Ahmed", ClinicId = 1 },
            new User { Id = 3, Name = "Dr. Sara", ClinicId = 2 },
            new User { Id = 4, Name = "Dr. Omar", ClinicId = 2 } // NEW: Dr. Omar in Clinic B
        );

        modelBuilder.Entity<Conversation>().HasData(
            new Conversation { Id = 1, ClinicId = 1, IsGroup = false },
            new Conversation { Id = 101, ClinicId = 1, IsGroup = true, GroupName = "Group Chat" },
            new Conversation { Id = 4, ClinicId = 2, IsGroup = false }, // NEW: Clinic B Conversation
            new Conversation { Id = 102, ClinicId = 2, IsGroup = true, GroupName = "Clinic B Group Chat" }
        );

        modelBuilder.Entity<ConversationMember>().HasData(
            new ConversationMember { ConversationId = 1, UserId = 1 },
            new ConversationMember { ConversationId = 1, UserId = 2 },
            new ConversationMember { ConversationId = 101, UserId = 1 },
            new ConversationMember { ConversationId = 101, UserId = 2 },
            
            // NEW: Assigning Sara and Omar to Conversation 4
            new ConversationMember { ConversationId = 4, UserId = 3 },
            new ConversationMember { ConversationId = 4, UserId = 4 },
            
            new ConversationMember { ConversationId = 102, UserId = 3 },
            new ConversationMember { ConversationId = 102, UserId = 4 }
        );

        modelBuilder.Entity<Message>().HasData(
            new Message { Id = 1, ConversationId = 1, SenderId = 1, Content = "Hello Dr. Ahmed, welcome to Dentalore!", Timestamp = DateTime.UtcNow.AddMinutes(-10) },
            new Message { Id = 2, ConversationId = 1, SenderId = 2, Content = "Hi Dr. Hana! Ready to discuss today's clinic schedule.", Timestamp = DateTime.UtcNow.AddMinutes(-5) },
            new Message { Id = 7, ConversationId = 101, SenderId = 1, Content = "Welcome doctors to our Branch A Team Group Chat! 👋", Timestamp = DateTime.UtcNow.AddMinutes(-25) },
            new Message { Id = 8, ConversationId = 101, SenderId = 2, Content = "Great to have a shared channel!", Timestamp = DateTime.UtcNow.AddMinutes(-20) },
            
            // NEW: Seed message for Branch B
            new Message { Id = 10, ConversationId = 4, SenderId = 4, Content = "Hi Dr. Sara, checking in from Branch B!", Timestamp = DateTime.UtcNow.AddMinutes(-2) },
            
            new Message { Id = 201, ConversationId = 102, SenderId = 3, Content = "Welcome to Branch B group chat!", Timestamp = DateTime.UtcNow.AddMinutes(-10) }
        );
    }
}