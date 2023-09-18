import { useInventoryStatsChartJSData } from "@/components/ui/charts/chartjs/hooks/useInventoryStatsChartJSData";
import MainLoader from "@/components/ui/loading/main-loader";
import { useUserInfoContext } from "@/context/user-context";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js/auto";
import { AnimatePresence } from "framer-motion";
import { Line, Pie } from "react-chartjs-2";
import { BsBoxes, BsCashCoin } from "react-icons/bs";
import { MdOutlineInventory2 } from "react-icons/md";
import AppNavigation from "../../navigation/app/app-navigation";

ChartJS.register(ArcElement, Legend, Tooltip);

export default function DashboardSection() {
  const { getUserItems, getTotalUserItemsPrice, getTotalUserItemsAmount, serverLoadWasTried } =
    useUserInfoContext();
  const chartJSData = useInventoryStatsChartJSData();
  return (
    <section className="dashboardSectionBox">
      <AnimatePresence mode="wait">
        {!serverLoadWasTried && <MainLoader message={"Loading dashboard..."} />}
      </AnimatePresence>
      <AppNavigation />
      <div className="dashboardLayoutBox">
        <div className="dashboardInfoCardBox">
          <div className="dashboardInfoCard">
            <MdOutlineInventory2 size={30} />
            <h3>Total Items</h3>
            <p>{getUserItems().length}</p>
          </div>
          <div className="dashboardInfoCard">
            <BsCashCoin size={30} />
            <h3>Total Value</h3>
            <p>${getTotalUserItemsPrice().toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="dashboardInfoCard">
            <BsBoxes size={30} />
            <h3>Total Stock</h3>
            <p>{getTotalUserItemsAmount()}</p>
          </div>
        </div>
        <div className="dashboardChartsBox">
          <div className="dashboardChartBox dashboardPieChartBox">
            <Pie
              data={chartJSData.pieChartUserOperationsData}
              options={chartJSData.pieChartUserOperationsOptions}
            ></Pie>
          </div>
          <div className="dashboardChartBox">
            <Line
              data={chartJSData.lineChartTotalPriceData}
              options={chartJSData.lineChartTotalPriceDataOptions}
            ></Line>
          </div>
        </div>
        <div className="dashboardChartsBox">
          <div className="dashboardChartBox">
            <Line
              data={chartJSData.lineChartTotalAmountData}
              options={chartJSData.lineChartTotalAmountDataOptions}
            ></Line>
          </div>
          <div className="dashboardChartBox">
            <Line
              data={chartJSData.lineChartTotalItemsData}
              options={chartJSData.lineChartTotalItemsDataOptions}
            ></Line>
          </div>
        </div>
      </div>
    </section>
  );
}
