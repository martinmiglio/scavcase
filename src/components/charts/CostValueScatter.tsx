import ScatterChart from "./Scatter";
import config from "@/../tailwind.config.js";
import { makeHueRotationSteps } from "@/lib/color";
import { getItemsByIds } from "@/queries/apiItems";
import { getAllReportsWithInputItems } from "@/queries/reports";
import { ChartData, ChartOptions } from "chart.js";

const { colors } = config.theme;

export default async function CostValueScatter() {
  try {
    const reports = await getAllReportsWithInputItems(
      {
        id: true,
        value: true,
        cost: true,
      },
      {
        id: true,
        itemId: true,
        quantity: true,
      },
    );

    const inputItemsSet = new Set(
      reports.map((report) => report.inputItem.itemId),
    );

    const queryRes = await getItemsByIds(Array.from(inputItemsSet));

    const data = reports.map(
      (
        report,
      ): typeof report & {
        inputItem: (typeof queryRes.data.items)[0];
      } => {
        report.inputItem = {
          ...queryRes.data.items.find(
            (item) => item?.id === report.inputItem.itemId,
          ),
          ...report.inputItem,
        };
        return report;
      },
    );

    const chartData: ChartData<"scatter", { x: number; y: number }[], unknown> =
      {
        labels: data.map((report) => {
          if (report.inputItem.quantity > 1) {
            return `${report.inputItem.name} x ${report.inputItem.quantity}`;
          }
          return report.inputItem.shortName ?? "";
        }),
        datasets: [
          {
            label: "₽",
            data: data.map((report) => ({
              x: report.cost,
              y: report.value,
            })),
            backgroundColor: makeHueRotationSteps(
              inputItemsSet.size,
              colors.primary,
              100,
            ),
          },
        ],
      };

    const chartOptions: ChartOptions = {
      scales: {
        y: {
          title: {
            display: true,
            text: "Value",
            font: {
              size: 24,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Cost",
            font: {
              size: 24,
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Cost of Scav Case vs Value of Items Returned",
          font: {
            size: 24,
          },
        },
        legend: {
          display: false,
        },
      },
    };

    return <ScatterChart chartData={chartData} options={chartOptions} />;
  } catch (e) {
    console.error(e);
    return <pre>{JSON.stringify(e, null, 2)}</pre>;
  }
}
