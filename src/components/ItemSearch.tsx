"use client";

import { gql } from "@/__generated__/gql";
import { ItemsByNameQueryQuery } from "@/__generated__/graphql";
import Button from "@/components/atomic/Button";
import Image from "@/components/atomic/Image";
import { useDebounce } from "@/components/hooks/debounce";
import { initializeApollo } from "@/lib/apolloClient";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type APIItem = NonNullable<ItemsByNameQueryQuery["items"][0]>;

export interface SelectedItem extends APIItem {
  quantity: number;
}

export default function ItemSearch({
  setSelectedItems: setSelectedFromProps,
}: {
  setSelectedItems?: (items: SelectedItem[]) => void;
}) {
  const [searchedItems, setSearchedItemsState] = useState<SelectedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [search, debouncdedSearch, setSearch] = useDebounce("", 250);

  const apolloClient = initializeApollo();

  useEffect(() => {
    if (debouncdedSearch.length === 0) {
      setSearchedItemsState([]);
      return;
    }

    apolloClient
      .query({
        query: gql(`
          query itemsByNameQuery($name: String) {
            items(name: $name) {
              id
              name
              shortName
              image512pxLink
              avg24hPrice
            }
          }
        `),
        variables: {
          name: debouncdedSearch,
        },
      })
      .then((results) => {
        const apiItems = results.data.items.filter(
          (item) => item !== null,
        ) as APIItem[];

        const items: SelectedItem[] = apiItems.map((item) => ({
          ...item,
          quantity: 1,
        }));

        setSearchedItemsState(items);
      });
  }, [apolloClient, debouncdedSearch, selectedItems]);

  const propegateSelectedItems = (items: SelectedItem[]) => {
    setSelectedItems(items);
    setSelectedFromProps?.(items);
  };

  const toggleSelect = (item: SelectedItem) => {
    if (!selectedItems.includes(item)) {
      propegateSelectedItems([...selectedItems, item]);
    } else {
      propegateSelectedItems(selectedItems.filter((i) => i !== item));
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
      <table className="table-auto border-collapse">
        <thead className="sticky bg-dark">
          <tr>
            <th className="w-[90px]"></th>
            <th>Name</th>
            <th className="w-[90px]">Select</th>
            <th className="w-[90px]">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item) => {
            if (!item) {
              return null;
            }
            return (
              <Row
                item={item}
                key={uuidv4()}
                toggleSelect={toggleSelect}
                selected={selectedItems.includes(item)}
                setQuantity={(quantity) => {
                  item.quantity = quantity;
                }}
              />
            );
          })}
        </tbody>
        <tbody>
          <tr
            className={`sticky bg-dark ${
              selectedItems.length > 0 ? "visible" : "hidden"
            }`}
          >
            <th className="w-[90px]"></th>
            <th>Name</th>
            <th className="w-[90px]">Select</th>
            <th className="w-[90px]">Quantity</th>
          </tr>
          {searchedItems.map((item) => {
            if (!item) {
              return null;
            }
            return (
              <Row
                item={item}
                key={item.id}
                toggleSelect={toggleSelect}
                selected={selectedItems.includes(item)}
                setQuantity={(quantity) => {
                  item.quantity = quantity;
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
  setQuantity: setQuantityFromProps,
}: {
  item: SelectedItem;
  selected: boolean;
  toggleSelect: (item: SelectedItem) => void;
  setQuantity: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(item.quantity);

  const propegateQuantity = (quantity: number) => {
    setQuantityFromProps(quantity);
    setQuantity(quantity);
  };

  return (
    <tr>
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
          onChange={(e) =>
            propegateQuantity(Math.max(parseInt(e.target.value), 1))
          }
          value={quantity}
        />
      </td>
    </tr>
  );
}
