public class User
{
    public Guid? Id { get; set; } = Guid.NewGuid();
    public string? Name { get; set; }
    public Guid? ClinicId { get; set; }
    public Clinic? Clinic { get; set; }
}