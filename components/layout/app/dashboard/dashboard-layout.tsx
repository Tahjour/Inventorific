// components\layout\app\app-layout.js
import AppNavigation from "../../navigation/app/app-navigation";
import styles from "./dashboard-layout.module.css";

export default function DashboardLayout() {
  return (
    <section className={styles.dashboardLayoutBox}>
      <AppNavigation />
      <div className={styles.dashboardLayout}>
        Temp
      </div>
    </section>
  );
}
