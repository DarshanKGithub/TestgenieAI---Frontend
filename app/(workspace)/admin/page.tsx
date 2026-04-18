import { AdminUserManagement } from "@/components/admin-user-management";
import { RoadmapCard } from "@/components/roadmap-card";
import { Stack } from "@mui/material";

export default function AdminPage() {
  return (
    <Stack spacing={2.2}>
      <RoadmapCard />
      <AdminUserManagement />
    </Stack>
  );
}
