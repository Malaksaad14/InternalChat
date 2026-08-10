public class User
{
    public int? Id { get; set; }
    public string? Name { get; set; }
    public int ClinicId { get; set; }
    public Clinic? Clinic { get; set; }
}