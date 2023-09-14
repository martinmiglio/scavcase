"use client";

import config from "@/../tailwind.config.js";
import { makeHueRotationSteps } from "@/lib/color";
import { font } from "@/styles/fonts";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const { colors } = config.theme;

function DoughnutChart({
  chartData,
  options,
}: {
  chartData: ChartData<"doughnut", number[], unknown>;
  options?: ChartOptions;
}) {
  Chart.defaults.font.family = font.style.fontFamily;
  Chart.defaults.font.size = 16;
  Chart.defaults.color = colors.text;

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
    const _ = new Chart(ctx, { type: "doughnut", data: chartData, options });
  }, [chartData, options]);

  return (
    <div className="mx-auto my-auto flex h-1/4 w-1/2">
      <div className="my-auto h-fit w-full">
        <canvas ref={charRef} id={uuidv4()}></canvas>
      </div>
    </div>
  );
}
export default DoughnutChart;
