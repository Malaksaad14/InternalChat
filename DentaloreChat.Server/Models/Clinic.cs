public class Clinic
{
    public int Id { get; set; }
    public string? Name { get; set; }
    
    // Navigation property
    public ICollection<User>? Users { get; set; }
    
}