"use client";

import Image from "@/components/atomic/Image";
import { ItemByIdQuery } from "@/queries/__generated__/graphql";
import { getItemsByIds } from "@/queries/apiItems";
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

  const getInputItems = async () => {
    const res = await fetch("/api/report/inputs");
    const inputItems = await res.json();

    if (!inputItems) {
      return;
    }

    const queryRes = await getItemsByIds(
      inputItems.map((item: { itemId: string }) => item.itemId),
    );

    const { items } = queryRes.data;

    const nonNullItems = items.filter((item) => item !== null) as NonNullable<
      ItemByIdQuery["item"]
    >[];

    setItemsState(
      inputItems.map((item: { itemId: string; quantity: number }) => {
        const apiItem = nonNullItems.find(
          (apiItem: { id: string }) => item.itemId === apiItem.id,
        );

        const quantity = item?.quantity ?? 1;
        const value =
          (apiItem?.avg24hPrice === 0 ? 1 : apiItem?.avg24hPrice ?? 1) *
          quantity;

        return {
          itemId: item?.itemId ?? "",
          name: apiItem?.shortName ?? "",
          image: apiItem?.image512pxLink ?? "",
          value: value,
          quantity: quantity,
        } as InputItem;
      }),
    );
  };

  useEffect(() => {
    getInputItems();
  }, []);

  const setSelectedItemAndPropagate = (item: InputItem) => {
    setSelectedItem(item);
    setSelectedFromProps?.(item);
  };

  const labelStyle = (item: InputItem) =>
    `px-1 opacity-80 ${selectedItem === item ? "bg-dark" : "bg-background"}`;

  return (
    <div className="overscroll-bouncing h-34 flex min-w-full select-none snap-x flex-nowrap gap-2 overflow-x-auto overflow-y-clip whitespace-nowrap">
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
