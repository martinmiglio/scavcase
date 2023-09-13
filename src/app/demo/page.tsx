import { gql } from "@/__generated__/gql";
import { ItemByIdQuery } from "@/__generated__/graphql";
import DoughnutChart from "@/components/charts/Pie";
import { initializeApollo } from "@/lib/apolloClient";
import prisma from "@/lib/prismaClient";
import { ApolloQueryResult } from "@apollo/client";
import { ChartData } from "chart.js";

export default async function Page() {
  const itemCounts = await prisma.report.groupBy({
    by: ["inputItemId"],
    _count: {
      inputItemId: true,
    },
  });

  const itemIds = await prisma.inputItem.findMany({
    select: {
      id: true,
      itemId: true,
      quantity: true,
    },
  });

  const dbItems = itemIds.map((item) => ({
    itemId: item.itemId,
    inputItemId: item.id,
    quantity: item.quantity,
    count: itemCounts.find((count) => count.inputItemId === item.id)?._count
      .inputItemId,
  }));

  const apolloClient = initializeApollo();

  // use appollo client to fetch item data from the api given the inputItemId
  const apiItems: ApolloQueryResult<ItemByIdQuery>[] = await Promise.all(
    itemIds.map((item) =>
      apolloClient.query({
        query: gql(`
          query itemById($id: ID) {
            item(id: $id) {
              id
              name
              shortName
              iconLink
            }
          }
        `),
        variables: {
          id: item.itemId,
        },
      }),
    ),
  );

  // map apiItems to the data array
  const data = dbItems
    .map((item) => {
      const apiItem = apiItems.find(
        (apiItem) => apiItem.data.item?.id === item.itemId,
      );

      return {
        ...item,
        name: apiItem?.data.item?.name,
        shortName: apiItem?.data.item?.shortName,
        iconLink: apiItem?.data.item?.iconLink,
      };
    })
    .toSorted((a, b) => (a.count ?? 0) - (b.count ?? 0));

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
}
