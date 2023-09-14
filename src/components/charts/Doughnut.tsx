"use client";

import config from "@/../tailwind.config.js";
import { makeHueRotationSteps } from "@/lib/color";
import Chart, { ChartData } from "chart.js/auto";
import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const { colors } = config.theme;

function DoughnutChart({
  chartData,
}: {
  chartData: ChartData<"doughnut", number[], unknown>;
}) {
  chartData.datasets = chartData.datasets.map((dataset) => ({
    backgroundColor: makeHueRotationSteps(
      dataset.data.length,
      colors.primary,
      100,
    ),
    ...dataset,
  }));

  const charRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!charRef) {
      return;
    }
    const ctx = charRef.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    const _ = new Chart(ctx, { type: "doughnut", data: chartData });
  }, [chartData]);

  return (
    <div className="mx-auto my-auto flex h-1/4 w-1/2">
      <div className="my-auto h-fit w-full">
        <canvas ref={charRef} id={uuidv4()}></canvas>
      </div>
    </div>
  );
}
export default DoughnutChart;
