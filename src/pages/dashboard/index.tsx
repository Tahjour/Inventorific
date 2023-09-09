// pages\items\index.js
import DashboardLayout from "@/components/layout/app/dashboard/dashboard-layout";
import PageAnimation from "@/components/ui/animations/pages/page-animation";
import AppBackground from "@/components/ui/pages/backgrounds/app-background";

export default function DashboardPage() {
  return (
    <PageAnimation>
      <AppBackground>
        <DashboardLayout />
      </AppBackground>
    </PageAnimation>
  );
}
