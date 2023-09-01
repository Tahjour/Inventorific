// pages\items\index.js
import AppLayout from "@/components/layout/app/app-bars/app-layout";
import InventoryBackground from "@/components/ui/pages/dashboard/inventory-background";

export default function DashboardPage() {
  return (
    <InventoryBackground>
      <AppLayout />
    </InventoryBackground>
  );
}
