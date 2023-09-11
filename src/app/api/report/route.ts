import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession({
    req: request,
    ...authOptions,
  });

  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (await checkRateLimit(user.email)) {
    return NextResponse.json(
      {},
      {
        status: 429,
        statusText: "Too Many Requests",
      },
    );
  }
  try {
    const body = await request.json();
    let { inputItem, outputItems, cost, value, patch } = body;

    if (!inputItem || !outputItems || !cost || !value || !patch) {
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
      patch,
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

async function checkRateLimit(userEmail: string) {
  if (process.env.NODE_ENV === "development") {
    return false;
  }

  // check if user has made a post in last x ms
  const onceEvery = 30 * 60 * 1000; // 30m in ms

  const reports = await prisma.report.findMany({
    where: {
      userEmail,
      createdAt: {
        gte: new Date(Date.now() - onceEvery),
      },
    },
  });

  return reports.length > 0;
}
