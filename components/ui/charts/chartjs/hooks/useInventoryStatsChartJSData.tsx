import { useUserInfoContext } from "@/context/user-context";
import { ChartData, ChartOptions } from "chart.js/auto";
import { UserInventoryStat } from "../../../../../lib/types/stats";
import { UserOperationNamesList } from "../../../../../lib/types/user";

export const useInventoryStatsChartJSData = () => {
  const { getUserInventoryStats, getTotalForEachUserOperationList, getUserOperations } =
    useUserInfoContext();
  const inventoryStats = getUserInventoryStats();
  const lineChartTitles = {
    itemsDataTitle: "Last 50 Changes In Total Items",
    priceDataTitle: "Last 50 Changes In Total Value",
    amountDataTitle: "Last 50 Changes In Total Amount",
  };

  const lineChartTotalPriceData =
    inventoryStats && createLineChartData(inventoryStats.total_items_price_history || [], "Price");
  const lineChartTotalItemsData =
    inventoryStats && createLineChartData(inventoryStats.total_items_history || [], "Items");
  const lineChartTotalAmountData =
    inventoryStats && createLineChartData(inventoryStats.total_items_amount_history || [], "Stock");
  const lineChartTotalPriceDataOptions = createLineChartOptions(lineChartTitles.priceDataTitle);
  const lineChartTotalItemsDataOptions = createLineChartOptions(lineChartTitles.itemsDataTitle);
  const lineChartTotalAmountDataOptions = createLineChartOptions(lineChartTitles.amountDataTitle);

  function createLineChartData(
    userInventoryStat: UserInventoryStat[],
    labelName: string
  ): ChartData<"line"> {
    return {
      labels: userInventoryStat
        ? userInventoryStat.map((stat) => `${stat.date}\n${stat.time}`)
        : [],

      datasets: [
        {
          label: labelName,
          data: userInventoryStat.map((stat) => parseFloat(stat.value.toFixed(2))),
          backgroundColor: "hsl(180, 100%, 30%)",
          borderColor: "hsl(180, 100%, 50%)",
          pointHoverRadius: 10,
          tension: 0.2,
        },
      ],
    };
  }

  function createLineChartOptions(lineChartTitle: string): ChartOptions<"line"> {
    return {
      scales: {
        x: {
          grid: {
            color: "hsl(180, 100%, 20%)",
            lineWidth: 0.5,
          },
          ticks: {
            callback: (value) => {
              return value;
            },
          },
        },
        y: {
          grid: {
            color: "hsl(180, 100%, 20%)",
            lineWidth: 0.5,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: lineChartTitle,
          color: "hsl(0, 0%, 100%)",
        },
        legend: {
          labels: {
            color: "hsl(0, 0%, 100%)",
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    };
  }

  const pieChartUserOperationsData: ChartData<"pie"> = {
    labels: UserOperationNamesList.map((userOperationName) =>
      userOperationName.split("_").join(" ")
    ),
    datasets: [
      {
        label: "amount",
        data: getTotalForEachUserOperationList(),
        backgroundColor: ["hsl(180, 100%, 30%)", "hsl(200, 100%, 30%)", "hsl(220, 100%, 30%)"],
        hoverOffset: 15,
        borderColor: ["hsl(120, 100%, 0%)", "hsl(60, 100%, 0%)", "hsl(0, 100%, 0%)"],
      },
    ],
  };

  const pieChartUserOperationsOptions: ChartOptions<"pie"> = {
    layout: {
      padding: {
        bottom: 10,
      },
    },
    plugins: {
      title: {
        display: true,
        text: `User Operations ${
          getUserOperations()[0] ? "Since " + getUserOperations()[0].date : ""
        }`,
        color: "hsl(0, 0%, 100%)",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            const labels = [];
            if (context.parsed !== null && typeof context.parsed === "number") {
              const totalOperationAmount = context.dataset.data.reduce((sum, operationAmount) => {
                if (typeof sum === "number" && typeof operationAmount === "number") {
                  return sum + operationAmount;
                }
                return 0;
              }, 0);
              const value = context.parsed;
              const percentage =
                typeof totalOperationAmount === "number" && totalOperationAmount !== 0
                  ? (value / totalOperationAmount) * 100
                  : 0;
              labels.push(label + value); // Add value line
              labels.push(percentage.toFixed(2) + "%"); // Add percentage line
            }
            return labels;
          },
        },
      },
      legend: {
        labels: {
          color: "hsl(0, 0%, 100%)", // Set the color of the label text
        },
      },
    },
  };

  return {
    lineChartTotalPriceData,
    lineChartTotalItemsData,
    lineChartTotalAmountData,
    lineChartTotalPriceDataOptions,
    lineChartTotalItemsDataOptions,
    lineChartTotalAmountDataOptions,
    pieChartUserOperationsData,
    pieChartUserOperationsOptions,
  };
};
