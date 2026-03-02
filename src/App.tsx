import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import AgentsPage from "@/app/agents/page";
import AutomationsPage from "@/app/automations/page";
import HomePage from "@/app/home/page";
import InboxPage from "@/app/inbox/page";

export function App() {
  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
        </Routes>
      </AppShell>
      <Toaster />
    </>
  );
}
