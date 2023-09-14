"use client";

import { gql } from "@/__generated__/gql";
import { GetItemValueQuery } from "@/__generated__/graphql";
import Image from "@/components/atomic/Image";
import { initializeApollo } from "@/lib/apolloClient";
import { ApolloQueryResult } from "@apollo/client";
import { useEffect, useState } from "react";

export interface InputItem {
  itemId: string;
  quantity: number;
  name?: string;
  value?: number;
  image?: string;
}

export default function InputSelector({
  setSelectedItem: setSelectedFromProps,
}: {
  setSelectedItem?: (item: InputItem) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<InputItem | null>(null);
  const [items, setItemsState] = useState<InputItem[]>([]);

  const apolloClient = initializeApollo();

  useEffect(() => {
    fetch("/api/report/inputs").then((res) =>
      res.json().then((inputItems) => {
        if (!inputItems) {
          return;
        }

        const requests: Promise<ApolloQueryResult<GetItemValueQuery>>[] = [];
        // for every input item, make item request by name to get value and image
        inputItems.forEach((item: { itemId: any }) => {
          requests.push(
            apolloClient.query({
              query: gql(`
                query getItemValue($id: ID!) {
                  item(id: $id) {
                    id
                    name
                    shortName
                    image512pxLink
                    avg24hPrice
                  }
                }
              `),
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
                quantity: inputItems[index].quantity,
                value: item.value * inputItems[index].quantity,
              };
            }),
          );
        });
      }),
    );
  }, [apolloClient]);

  const setSelectedItemAndPropagate = (item: InputItem) => {
    setSelectedItem(item);
    setSelectedFromProps?.(item);
  };

  const labelStyle = (item: InputItem) =>
    `px-1 opacity-80 ${selectedItem === item ? "bg-dark" : "bg-background"}`;

  return (
    <div className="overscroll-bouncing flex h-34 min-w-full select-none snap-x flex-nowrap gap-2 overflow-x-auto overflow-y-clip whitespace-nowrap">
      {items.map((item) => (
        <div
          key={item.itemId + item.quantity}
          className={`relative h-32 w-32 shrink-0 cursor-pointer snap-start border  bg-foreground hover:border-primary ${
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
              className="h-32 w-32 object-contain"
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
