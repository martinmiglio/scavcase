import prisma from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export const revalidate = 60 * 60; // 1 hour

export const getAllInputItems = cache(
  async (select?: Prisma.InputItemSelect) => {
    return prisma.inputItem.findMany({
      select,
    });
  },
);

export const getAllInputItemsWithReports = cache(
  async (
    inputItemSelect?: Prisma.InputItemSelect,
    reportSelect?: Prisma.ReportSelect,
  ) => {
    const select = {
      ...inputItemSelect,
      Report: {
        select: reportSelect,
      },
    };

    return prisma.inputItem.findMany({
      select,
    });
  },
);

export const getInputItemByItemIdAndQuanity = cache(
  async (itemId: string, quantity: number) => {
    return prisma.inputItem.findFirst({
      where: {
        itemId: itemId,
        quantity: quantity,
      },
    });
  },
);

export const createOutputItems = cache(
  async (
    outputItems:
      | Prisma.OutputItemCreateManyInput
      | Prisma.OutputItemCreateManyInput[],
  ) => {
    return prisma.outputItem.createMany({ data: outputItems });
  },
);
