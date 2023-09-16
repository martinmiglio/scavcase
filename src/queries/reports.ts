import prisma from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { cache } from "react";

export const revalidate = 60; // 1 minute

export const createReport = cache(
  async (report: Prisma.ReportCreateInput | Prisma.ReportCreateManyInput) => {
    return prisma.report.create({ data: report });
  },
);

export const getReportById = cache(
  async (id: string, include?: Prisma.ReportInclude) => {
    return prisma.report.findUnique({ where: { id: id }, include: include });
  },
);

export const getReportsByEmailAfterDate = cache(
  async (userEmail: string, date: Date, include?: Prisma.ReportInclude) => {
    return prisma.report.findMany({
      where: {
        userEmail,
        createdAt: {
          gte: date,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: include,
    });
  },
);

export const getAllReportsWithInputItems = cache(
  async (
    reportSelect?: Prisma.ReportSelect,
    inputItemSelect?: Prisma.InputItemSelect,
  ) => {
    const select = {
      ...reportSelect,
      inputItem: {
        select: inputItemSelect,
      },
    };

    return prisma.report.findMany({
      select,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
);
