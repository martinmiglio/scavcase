"use client";

import InputSelector, { InputItem } from "@/components/InputSelector";
import ItemSearch, { ReturnItem } from "@/components/ItemSearch";
import Button from "@/components/atomic/Button";
import { useState } from "react";

export default function ReportInput() {
  const [inputItem, setInputItem] = useState<InputItem | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!inputItem) {
      return;
    }

    setSubmitting(true);

    const newReport = {
      input_item_id: inputItem?.itemId,
      returned_item_ids: returnItems.map((item) => item.id),
      cost: inputItem?.value,
      value: returnItems.reduce(
        (acc, item) => acc + (item.avg24hPrice ?? 0),
        0,
      ),
      patch: process.env.NEXT_PUBLIC_GAME_PATCH,
    };

    const res = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify(newReport),
    });

    if (res.ok) {
      console.info("Report submitted successfully");
    } else if (res.status === 403) {
      console.warn("Report not submitted, rate limited");
    } else if (res.status === 401) {
      console.warn("Report not submitted, not logged in");
    } else {
      console.error(
        `Report not submitted, error ${res.status}: ${res.statusText}`,
      );
    }

    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center justify-between">
        <h2 className="text-2xl">Report a scav case</h2>
        <Button
          onClick={onSubmit}
          disabled={!inputItem || returnItems.length === 0 || submitting}
        >
          Submit
        </Button>
      </span>
      <InputSelector setSelectedItem={setInputItem} />
      <ItemSearch setSelectedItems={setReturnItems} />
    </div>
  );
}
