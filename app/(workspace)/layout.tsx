import { PlatformDetails } from "@/components/platform-details";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceShell
      title="Release Control Center"
      subtitle="Plan, run, and analyze quality signals across your product lifecycle."
    >
      <PlatformDetails />
      {children}
    </WorkspaceShell>
  );
}
