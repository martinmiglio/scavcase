import DoughnutChart from "@/components/charts/Doughnut";
import prisma from "@/lib/prismaClient";
import { getItemsByIds } from "@/queries/items";
import { ChartData, ChartOptions } from "chart.js";

export default async function InputItemChart() {
  try {
    const inputItems = await prisma.inputItem.findMany({
      select: {
        id: true,
        itemId: true,
        quantity: true,
        Report: {
          select: {
            id: true,
          },
        },
      },
    });

    const queryRes = await getItemsByIds(inputItems.map((item) => item.itemId));

    const data = inputItems
      .map((item) => ({
        ...queryRes.data.items.find((info) => info?.id === item.itemId),
        ...item,
      }))
      .sort((a, b) => a.Report.length - b.Report.length);

    const chartData: ChartData<"doughnut", number[], unknown> = {
      labels: data.map((item) => {
        if (item.quantity > 1) {
          return `${item.name} x ${item.quantity}`;
        }
        return item.shortName;
      }),
      datasets: [
        {
          label: "Number of Reports",
          data: data.map((item) => item.Report.length),
        },
      ],
    };

    const chartOptions: ChartOptions = {
      plugins: {
        title: {
          display: true,
          text: "Number of Reports per Input Item",
          font: {
            size: 24,
          },
        },
        legend: {
          position: "bottom",
        },
      },
    };

    return <DoughnutChart chartData={chartData} options={chartOptions} />;
  } catch (e) {
    console.log(e);
    return <pre>{JSON.stringify(e, null, 2)}</pre>;
  }
}
