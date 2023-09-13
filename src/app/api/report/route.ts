import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const envSchema = z.object({
  CURRENT_GAME_PATCH: z.string(),
  NEXT_PUBLIC_REPORT_RATE_LIMIT: z.string(),
});

const env = envSchema.parse(process.env);

export async function POST(request: NextRequest) {
  const session = await getServerSession({
    req: request,
    ...authOptions,
  });

  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const timeRemaining = await getTimeLeft(user.email);

  if (timeRemaining > 0) {
    return NextResponse.json(
      {},
      {
        status: 429,
        statusText: "Too Many Requests",
        headers: { "retry-after": timeRemaining.toString() },
      },
    );
  }

  try {
    const body = await request.json();
    let { inputItem, outputItems, cost, value } = body;

    if (!inputItem || !outputItems || !cost || !value) {
      return NextResponse.json(
        { message: "Missing fields" },
        {
          status: 400,
        },
      );
    }

    const inputItemFromDB = await prisma.inputItem.findFirst({
      where: {
        itemId: inputItem.itemId,
        quantity: inputItem.quantity,
      },
    });

    if (!inputItemFromDB) {
      return NextResponse.json(
        { message: `Input item ${inputItem.itemId} not found` },
        {
          status: 404,
        },
      );
    }

    const report = {
      userEmail: user.email,
      cost,
      value,
      patch: env.CURRENT_GAME_PATCH,
      inputItemId: inputItemFromDB.id,
    } satisfies Prisma.ReportCreateManyInput;

    const createdReport = await prisma.report.create({ data: report });

    const validOutputItems = outputItems.map(
      (item: { itemId: string; quantity: number }) => {
        return {
          reportId: createdReport.id,
          itemId: item.itemId,
          quantity: item.quantity,
        };
      },
    ) as Prisma.OutputItemCreateManyInput | Prisma.OutputItemCreateManyInput[];

    await prisma.outputItem.createMany({
      data: validOutputItems,
    });

    const reportWithItems = await prisma.report.findUnique({
      where: { id: createdReport.id },
      include: { inputItem: true, outputItems: true },
    });

    return NextResponse.json({
      headers: { "content-type": "application/json" },
      body: reportWithItems,
    });
  } catch (e) {
    console.warn(JSON.stringify(e, null, 2));
    return NextResponse.json(
      {},
      {
        status: 500,
      },
    );
  }
}

async function getTimeLeft(userEmail: string): Promise<number> {
  if (process.env.NODE_ENV === "development") {
    return 0;
  }

  const rateLimitPeriod =
    parseFloat(env.NEXT_PUBLIC_REPORT_RATE_LIMIT) * 60 * 1000;

  const reports = await prisma.report.findMany({
    where: {
      userEmail,
      createdAt: {
        gte: new Date(Date.now() - rateLimitPeriod),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (reports.length == 0) {
    return 0;
  }

  const lastReport = reports[0];
  const timeSinceLastReport = Date.now() - lastReport.createdAt.getTime();
  return rateLimitPeriod - timeSinceLastReport;
}
