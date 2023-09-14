import DoughnutChart from "@/components/charts/Doughnut";
import prisma from "@/lib/prismaClient";
import { getItemById } from "@/queries/items";
import { ChartData } from "chart.js";

export default async function InputItemChart() {
  try {
    const itemIds = await prisma.inputItem.findMany({
      select: {
        id: true,
        itemId: true,
        quantity: true,
      },
    });

    const itemCounts = await prisma.report.groupBy({
      by: ["inputItemId"],
      _count: {
        inputItemId: true,
      },
    });

    const dbItems = itemIds.map((item) => ({
      itemId: item.itemId,
      inputItemId: item.id,
      quantity: item.quantity,
      count: itemCounts.find((count) => count.inputItemId === item.id)?._count
        .inputItemId,
    }));

    // get item data from API
    const data = (
      await Promise.all(
        dbItems.map((item) =>
          getItemById(item.itemId).then((result) => ({
            ...item,
            name: result?.data.item?.name,
            shortName: result?.data.item?.shortName,
            iconLink: result?.data.item?.iconLink,
          })),
        ),
      )
    ).toSorted((a, b) => (a.count ?? 0) - (b.count ?? 0));

    const chartData: ChartData<"doughnut", number[], unknown> = {
      labels: data.map((item) => {
        if (item.quantity > 1) {
          return `${item.name} x${item.quantity}`;
        }
        return item.shortName;
      }),
      datasets: [
        {
          label: "Number of Items",
          data: data.map((item) => item.count ?? 0),
        },
      ],
    };

    return <DoughnutChart chartData={chartData} />;
  } catch (e) {
    console.log(e);
    return <pre>{JSON.stringify(e, null, 2)}</pre>;
  }
}
