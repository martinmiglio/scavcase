"use client";

import { gql } from "@/__generated__/gql";
import Button from "@/components/atomic/Button";
import Image from "@/components/atomic/Image";
import { useDebounce } from "@/components/hooks/debounce";
import { initializeApollo } from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface SelectedItem {
  id: string;
  quantity?: number;
  name?: string | null;
  shortName?: string | null;
  image512pxLink?: string | null;
  avg24hPrice?: number | null;
}

export default function ItemSearch({
  setSelectedItems: setSelectedFromProps,
}: {
  setSelectedItems?: (items: SelectedItem[]) => void;
}) {
  const [items, setItemsState] = useState<SelectedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [search, debouncdedSearch, setSearch] = useDebounce("", 250);

  const apolloClient = initializeApollo();

  const itemsByNameQuery = gql(`
    query itemsByNameQuery($name: String) {
      items(name: $name) {
        id
        name
        shortName
        image512pxLink
        avg24hPrice
      }
    }
  `);

  useEffect(() => {
    const updateItemList = (items: SelectedItem[]) => {
      const sortedItems = [
        ...selectedItems,
        ...items.filter((item) => item && !selectedItems.includes(item)),
      ];
      setItemsState(sortedItems);
    };

    if (debouncdedSearch.length === 0) {
      updateItemList([]);
      return;
    }

    apolloClient
      .query({
        query: itemsByNameQuery,
        variables: {
          name: debouncdedSearch,
        },
      })
      .then((results) => {
        const items = results.data.items.filter(
          (item) => item !== null,
        ) as SelectedItem[];
        updateItemList(items);
      });
  }, [apolloClient, itemsByNameQuery, debouncdedSearch, selectedItems]);

  const toggleSelect = (item: SelectedItem) => {
    if (selectedItems.includes(item)) {
      const updatedItemList = selectedItems.filter((i) => i !== item);
      setSelectedFromProps?.(updatedItemList);
      setSelectedItems(updatedItemList);
    } else {
      const updatedItemList = [...selectedItems, item];
      setSelectedFromProps?.(updatedItemList);
      setSelectedItems(updatedItemList);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="flex w-full gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-primary bg-background p-2"
          placeholder="Search for an item..."
        />
        <Button
          onClick={() => {
            setSelectedItems([]);
          }}
        >
          Clear
        </Button>
      </span>
      <table className="table-auto">
        <thead className="sticky bg-dark">
          <tr>
            <th className="w-[90px]"></th>
            <th>Name</th>
            <th className="w-[90px]">Select</th>
            <th className="w-[90px]">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => {
            if (!item) {
              return null;
            }
            return (
              <Row
                item={item}
                key={uuidv4()}
                toggleSelect={toggleSelect}
                selected={selectedItems.includes(item)}
                quantity={item.quantity}
                setQuantity={(quantity) => {
                  const updatedItemList = selectedItems.map((i) => {
                    if (i === item) {
                      return {
                        ...i,
                        quantity,
                      };
                    }
                    return i;
                  });
                  setSelectedFromProps?.(updatedItemList);
                  setSelectedItems(updatedItemList);
                }}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  item,
  selected,
  toggleSelect,
  quantity,
  setQuantity,
}: {
  item: SelectedItem;
  selected: boolean;
  toggleSelect: (item: SelectedItem) => void;
  quantity?: number;
  setQuantity: (quantity: number) => void;
}) {
  return (
    <tr className="border-collapse">
      <td className="border-y-4 border-dark">
        <Image
          src={item.image512pxLink ?? "https://via.placeholder.com/512"}
          alt={item.name ?? "Item"}
          height={128}
          width={128}
          className="mx-auto my-2 h-[70px] w-[70px] border border-text bg-foreground object-contain"
        />
      </td>
      <td className="border-y-4 border-dark">{item.name}</td>
      <td
        align="center"
        className="border-y-4 border-dark"
        onClick={() => toggleSelect(item)}
      >
        <div className="relative flex w-7">
          <input
            type="checkbox"
            className="transition-100 peer h-7 w-7 shrink-0 appearance-none border-2 border-primary transition-colors checked:bg-primary"
            checked={selected}
            onChange={() => {}} // noop
          />
          <svg
            className="transition-100 pointer-events-none absolute left-[0.125rem] top-[0.125rem] z-20 h-6 w-6 fill-none stroke-none transition-colors peer-checked:!fill-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 448 512"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
          </svg>
        </div>
      </td>
      <td className="border-y-4 border-dark">
        <input
          type="number"
          className="w-full border-2 border-primary bg-background p-2 disabled:text-foreground"
          disabled={!selected}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          value={quantity ?? 1}
        />
      </td>
    </tr>
  );
}
