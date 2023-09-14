"use client";

import Button from "@/components/atomic/Button";
import InputSelector, { InputItem } from "@/components/report/InputSelector";
import { SelectedItem } from "@/components/report/ItemSearch";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ItemSearch = dynamic(() => import("@/components/report/ItemSearch"), {
  ssr: false,
});

export default function ReportInput() {
  const session = useSession();
  const [inputItem, setInputItem] = useState<InputItem | null>(null);
  const [outputItems, setOutputItems] = useState<SelectedItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timeout = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  const waitThenResetRateLimit = async (duration: number) => {
    console.log(`Waiting ${duration}ms`);
    // wait for rate limit and set isRateLimited to false
    await new Promise((resolve) => setTimeout(resolve, duration));
    setIsRateLimited(false);
  };

  const onSubmit = async () => {
    if (!inputItem) {
      return;
    }

    setSubmitting(true);

    const newReport = {
      inputItem: {
        itemId: inputItem?.itemId,
        quantity: inputItem?.quantity,
      },
      outputItems: outputItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity ?? 1,
      })),
      cost: inputItem?.value,
      value: outputItems.reduce(
        (acc, item) => acc + (item.avg24hPrice ?? 0) * (item.quantity ?? 1),
        0,
      ),
      patch: process.env.NEXT_PUBLIC_GAME_PATCH,
    };

    const res = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify(newReport),
    });
    setSubmitting(false);

    if (res.ok) {
      console.log("Report submitted");
    } else if (res.status === 429) {
      console.warn("Report not submitted, rate limited");
      setIsRateLimited(true);
      const duration = parseInt(res.headers.get("retry-after") ?? "0") * 1000;
      waitThenResetRateLimit(duration);
      return;
    } else if (res.status === 401) {
      console.warn("Report not submitted, not logged in");
      return;
    } else {
      console.error(
        `Report not submitted, error ${res.status}: ${res.statusText}`,
      );
      return;
    }

    setSubmitted(true);
  };

  const getButtonText = (): string => {
    if (submitting) {
      return "Submitting...";
    } else if (submitted) {
      return "Submitted!";
    } else if (isRateLimited) {
      return `Wait ${Math.ceil(
        parseFloat(process.env.NEXT_PUBLIC_REPORT_RATE_LIMIT ?? "0"),
      )}m between reports`;
    } else if (session.status !== "authenticated") {
      return "Login to submit";
    } else {
      return "Submit";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center justify-between">
        <h2 className="text-2xl">Report a scav case</h2>
        <Button
          onClick={onSubmit}
          className="disabled:cursor-not-allowed"
          disabled={
            !inputItem ||
            outputItems.length === 0 ||
            submitting ||
            submitted ||
            isRateLimited
          }
          data-umami-event="Submit report button"
        >
          {getButtonText()}
        </Button>
      </span>
      <InputSelector setSelectedItem={setInputItem} />
      <ItemSearch setSelectedItems={setOutputItems} />
    </div>
  );
}
