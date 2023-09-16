"use client";

import config from "@/../tailwind.config.js";
import { makeHueRotationSteps } from "@/lib/color";
import { font } from "@/styles/fonts";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const { colors } = config.theme;

function ScatterChart({
  chartData,
  options,
}: {
  chartData: ChartData<"scatter", { x: number; y: number }[], unknown>;
  options?: ChartOptions;
}) {
  Chart.defaults.font.family = font.style.fontFamily;
  Chart.defaults.font.size = 16;
  Chart.defaults.color = colors.text;

  chartData.datasets = chartData.datasets.map((dataset) => ({
    // backgroundColor: makeHueRotationSteps(
    //   dataset.data.length,
    //   colors.primary,
    //   100,
    // ),
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
    const _ = new Chart(ctx, {
      type: "scatter",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        ...options,
      },
    });
  }, [chartData, options]);

  return (
    <div className="flex-auto">
      <div className="relative h-[350px]">
        <canvas ref={charRef} id={uuidv4()}></canvas>
      </div>
    </div>
  );
}
export default ScatterChart;
