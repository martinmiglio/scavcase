"use client";

import Button from "@/components/atomic/Button";
import Image from "@/components/atomic/Image";
import { useDebounce } from "@/components/hooks/debounce";
import { ItemsByNameQuery } from "@/queries/__generated__/graphql";
import { getItemsByName as getItemsByNameQuery } from "@/queries/items";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type APIItem = NonNullable<ItemsByNameQuery["items"][0]>;

export interface SelectedItem extends APIItem {
  quantity: number;
}

export default function ItemSearch({
  setSelectedItems: setSelectedFromProps,
}: {
  setSelectedItems?: (items: SelectedItem[]) => void;
}) {
  const [searchedItems, setSearchedItemsState] = useState<SelectedItem[]>([]);
  const [hasMoreSearchedItems, setHasMoreSearchedItems] =
    useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [search, debouncdedSearch, setSearch] = useDebounce("", 400);

  const pageLength = 10;

  const getItemsByName = async (
    name: string,
    limit: number,
    offset: number,
  ) => {
    if (name.length === 0) {
      return [];
    }

    const results = await getItemsByNameQuery(name, limit, offset);

    const apiItems = results.data.items.filter(
      (item: any) => item !== null,
    ) as APIItem[];

    const items: SelectedItem[] = apiItems.map((item) => ({
      ...item,
      quantity: 1,
      selected: false,
    }));

    return items;
  };

  useEffect(() => {
    if (debouncdedSearch.length === 0) {
      setSearchedItemsState([]);
      setHasMoreSearchedItems(false);
      return;
    }

    getItemsByName(debouncdedSearch, pageLength, 0).then((items) => {
      setHasMoreSearchedItems(items.length >= pageLength);
      setSearchedItemsState(items);
    });
  }, [debouncdedSearch]);

  const propegateSelectedItems = (items: SelectedItem[]) => {
    setSelectedItems(items);
    setSelectedFromProps?.(items);
  };

  const toggleSelect = (item: SelectedItem) => {
    if (!selectedItems.includes(item)) {
      propegateSelectedItems([...selectedItems, item]);
      setSearchedItemsState(searchedItems.filter((i) => i !== item));
    } else {
      propegateSelectedItems(selectedItems.filter((i) => i !== item));
      if (debouncdedSearch.length !== 0) {
        setSearchedItemsState([item, ...searchedItems]);
      }
    }
  };

  const renderRow = (item: SelectedItem) => (
    <Row
      item={item}
      key={uuidv4()}
      toggleSelect={toggleSelect}
      selected={
        selectedItems.find((selectedItem) => selectedItem.id === item.id) !==
        undefined
      }
      setQuantity={(quantity) => {
        item.quantity = quantity;
      }}
    />
  );

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
      <table
        className="table-auto border-collapse"
        suppressHydrationWarning={true}
      >
        <thead className="sticky bg-dark">
          <tr>
            <th className="w-[90px]"></th>
            <th>Name</th>
            <th className="w-[90px]">Select</th>
            <th className="w-[90px]">Quantity</th>
          </tr>
        </thead>
        <IniniteTableBody
          row={renderRow}
          loadMore={async (p) => {}}
          hasMore={false}
          items={selectedItems}
          hasHeader={false}
        />
        <IniniteTableBody
          row={renderRow}
          loadMore={(page) =>
            getItemsByName(search, pageLength, page * pageLength).then(
              (items) => {
                if (items.length < pageLength) {
                  setHasMoreSearchedItems(false);
                }
                setSearchedItemsState([...searchedItems, ...items]);
              },
            )
          }
          hasMore={hasMoreSearchedItems}
          items={searchedItems}
          hasHeader={selectedItems.length > 0}
        />
      </table>
    </div>
  );
}

function IniniteTableBody({
  row,
  items,
  loadMore,
  hasMore,
  hasHeader,
}: {
  row: (item: SelectedItem) => React.JSX.Element;
  items: SelectedItem[];
  loadMore: (page: number) => Promise<void>;
  hasMore: boolean;
  hasHeader: boolean;
}) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    setLoading(true);
    await loadMore(page);
    setLoading(false);
    setPage(page + 1);
  };

  return (
    <>
      <tbody>
        {hasHeader && (
          <tr className="sticky bg-dark">
            <th className="w-[90px]"></th>
            <th>Name</th>
            <th className="w-[90px]">Select</th>
            <th className="w-[90px]">Quantity</th>
          </tr>
        )}
        {items.map((item) => {
          if (!item) {
            return null;
          }
          return row(item);
        })}
        {hasMore && (
          <tr>
            <td></td>
            <td align="center">
              <Button onClick={handleLoadMore} disabled={loading}>
                Load more...
              </Button>
            </td>
          </tr>
        )}
      </tbody>
    </>
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
      <td>
        <Image
          src={item.iconLink ?? "https://via.placeholder.com/64"}
          alt={item.name ?? "Item"}
          height={64}
          width={64}
          className="mx-auto my-2 h-16 w-16 bg-foreground object-contain"
        />
      </td>
      <td>{item.name}</td>
      <td align="center" onClick={() => toggleSelect(item)}>
        <div className="relative flex w-7">
          <input
            type="checkbox"
            className="transition-100 peer h-7 w-7 shrink-0 cursor-pointer appearance-none border-2 border-primary transition-colors  checked:bg-primary"
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
      <td>
        <input
          type="number"
          className="w-full border-2 border-primary bg-dark p-2 disabled:cursor-not-allowed disabled:bg-background disabled:text-foreground"
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
