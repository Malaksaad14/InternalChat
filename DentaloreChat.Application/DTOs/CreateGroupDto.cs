namespace DentaloreChat.Application.DTOs;
public class CreateGroupDto
{
    public string GroupName { get; set; } = string.Empty;
    public Guid ClinicId { get; set; } = Guid.NewGuid();
    public List<Guid> MemberIds { get; set; } = new();
}
