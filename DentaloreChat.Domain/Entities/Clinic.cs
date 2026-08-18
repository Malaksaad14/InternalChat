namespace DentaloreChat.Domain.Entities;
public class Clinic
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    
    // Navigation property
    public ICollection<User>? Users { get; set; }
    
}