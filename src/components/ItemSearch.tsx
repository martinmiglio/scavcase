"use client";

import { gql } from "@/__generated__/gql";
import { useDebounce } from "@/components/hooks/debounce";
import { initializeApollo } from "@/lib/apolloClient";
import { useEffect, useState } from "react";

export default function ItemSearch({
  setItems: setItemsFromProps,
}: {
  setItems?: (items: any) => void;
}) {
  const [items, setItemsState] = useState<
    ({
      __typename?: "Item";
      id: string;
      name?: string | null;
      shortName?: string | null;
      gridImageLink?: string | null;
    } | null)[]
  >([]);
  const [search, debouncdedSearch, setSearch] = useDebounce("", 250);

  const apolloClient = initializeApollo();

  const itemByNameQuery = gql(`
    query itemByNameQuery($name: String) {
      items(name: $name) {
        id
        name
        shortName
        gridImageLink
      }
    }
  `);

  useEffect(() => {
    const setItems = (items: any) => {
      setItemsFromProps?.(items);
      setItemsState(items);
    };

    if (debouncdedSearch.length === 0) {
      setItems([]);
      return;
    }

    apolloClient
      .query({
        query: itemByNameQuery,
        variables: {
          name: debouncdedSearch,
        },
      })
      .then((results) => {
        if (setItems) {
          setItems(results.data.items);
        }
      });
  }, [apolloClient, itemByNameQuery, debouncdedSearch, setItemsFromProps]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 bg-foreground border-primary rounded-md p-2 w-full"
        placeholder="Search for an item..."
      />
      {items?.map((item: any) => (
        <div key={item.id}>
          {item.name} {item.shortName}
        </div>
      ))}
    </div>
  );
}
