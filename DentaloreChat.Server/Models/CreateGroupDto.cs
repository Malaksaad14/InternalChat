public class CreateGroupDto
{
    public string GroupName { get; set; } = string.Empty;
    public int ClinicId { get; set; }
    public List<int> MemberIds { get; set; } = new();
}
