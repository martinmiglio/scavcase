"use client";

import { gql } from "@/__generated__/gql";
import { GetItemValueQuery } from "@/__generated__/graphql";
import Image from "@/components/atomic/Image";
import { initializeApollo } from "@/lib/apolloClient";
import { ApolloQueryResult } from "@apollo/client";
import { useEffect, useState } from "react";

export interface InputItem {
  itemId: string;
  count: number;
  name?: string;
  value?: string;
  image?: string;
}

const inputItems: InputItem[] = [
  {
    // 2.5k roubles
    itemId: "5449016a4bdc2d6f028b456f",
    count: 2500,
  },
  {
    // 15k roubles
    itemId: "5449016a4bdc2d6f028b456f",
    count: 15000,
  },
  {
    // 95k roubles
    itemId: "5449016a4bdc2d6f028b456f",
    count: 95000,
  },
  {
    // moonshine
    itemId: "5d1b376e86f774252519444e",
    count: 1,
  },
  {
    // intelligence folder
    itemId: "5c12613b86f7743bbe2c3f76",
    count: 1,
  },
];

export default function InputSelector({
  setSelectedItem: setSelectedFromProps,
}: {
  setSelectedItem?: (item: InputItem) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<InputItem | null>(null);
  const [items, setItemsState] = useState<InputItem[]>(inputItems);

  const apolloClient = initializeApollo();

  const itemByNameQuery = gql(`
    query getItemValue($id: ID!) {
      item(id: $id) {
        id
        name
        shortName
        image512pxLink
        avg24hPrice
      }
    }
  `);

  useEffect(() => {
    const requests: Promise<ApolloQueryResult<GetItemValueQuery>>[] = [];
    // for every input item, make item request by name to get value and image
    inputItems.forEach((item) => {
      requests.push(
        apolloClient.query({
          query: itemByNameQuery,
          variables: {
            id: item.itemId,
          },
        }),
      );
    });

    // wait for all requests to finish
    Promise.all(requests).then((results) => {
      // each result is a single item
      const newItems = results.map((result) => {
        const { item } = result.data;
        return {
          id: item?.id ?? "",
          name: item?.shortName ?? "",
          value: item?.avg24hPrice === 0 ? 1 : item?.avg24hPrice ?? 1,
          image: item?.image512pxLink ?? "",
        };
      });

      // set items state, but multiply value by count
      setItemsState(
        newItems.map((item, index) => {
          return {
            itemId: item.id,
            name: item.name,
            image: item.image,
            count: inputItems[index].count,
            value: (item.value * inputItems[index].count).toString(),
          };
        }),
      );
    });
  }, [apolloClient, itemByNameQuery]);

  const setSelectedItemAndPropagate = (item: InputItem) => {
    setSelectedItem(item);
    setSelectedFromProps?.(item);
  };

  const labelStyle = (item: InputItem) =>
    `px-1 opacity-80 ${selectedItem === item ? "bg-dark" : "bg-background"}`;

  return (
    <div className="overscroll-bouncing overscroll-bouncing mb-2 flex min-w-full select-none  snap-x flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
      {items.map((item) => (
        <div
          key={item.itemId + item.count}
          className={`relative h-[100px] w-[100px] shrink-0 cursor-pointer snap-start border  bg-foreground hover:border-primary ${
            selectedItem === item ? "border-primary " : "border-text"
          }`}
          onClick={() => setSelectedItemAndPropagate(item)}
        >
          {item.image && (
            <Image
              src={item.image}
              alt={item.name ?? "Item"}
              height={128}
              width={128}
              className="h-[100px] w-[100px] object-contain"
            />
          )}
          <div className={`absolute right-0 top-0 z-10 ${labelStyle(item)}`}>
            {item.name}
          </div>
          <div className={`absolute bottom-0 right-0 z-10 ${labelStyle(item)}`}>
            {item.value} ₽
          </div>
        </div>
      ))}
    </div>
  );
}
