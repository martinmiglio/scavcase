"use client";

import { gql } from "@/__generated__/gql";
import { Item } from "@/__generated__/graphql";
import Button from "@/components/atomic/Button";
import Image from "@/components/atomic/Image";
import { useDebounce } from "@/components/hooks/debounce";
import { initializeApollo } from "@/lib/apolloClient";
import { useEffect, useState } from "react";

export default function ItemSearch({
  setSelectedItems: setSelectedFromProps,
}: {
  setSelectedItems?: (items: Item[]) => void;
}) {
  const [items, setItemsState] = useState<(Item | null)[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [search, debouncdedSearch, setSearch] = useDebounce("", 250);

  const apolloClient = initializeApollo();

  const itemsByNameQuery = gql(`
    query itemsByNameQuery($name: String) {
      items(name: $name) {
        name
        shortName
        image512pxLink
        avg24hPrice
      }
    }
  `);

  useEffect(() => {
    const updateItemList = (items: (Item | null)[]) => {
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
        updateItemList(results.data.items as (Item | null)[]);
      });
  }, [apolloClient, itemsByNameQuery, debouncdedSearch, selectedItems]);

  const propegateSelection = (items: Item[]) => {
    setSelectedFromProps?.(items);
    setSelectedItems(items);
  };

  const toggleSelect = (item: Item) => {
    if (selectedItems.includes(item)) {
      propegateSelection(selectedItems.filter((i) => i !== item));
    } else {
      propegateSelection([...selectedItems, item]);
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
                key={item.id}
                toggleSelect={toggleSelect}
                selectedItems={selectedItems}
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
  selectedItems,
  toggleSelect,
}: {
  item: Item;
  selectedItems: Item[];
  toggleSelect: (item: Item) => void;
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
      <td align="center" className="border-y-4 border-dark">
        <input
          type="checkbox"
          className="h-5 w-5 appearance-none border-2 border-primary checked:bg-text"
          checked={selectedItems.includes(item)}
          onChange={() => toggleSelect(item)}
        />
      </td>
    </tr>
  );
}
