import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { initializePrisma } from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const prisma = initializePrisma();

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

  const body = await request.json();
  const { input_item_id, returned_item_ids, cost, value, patch } = body;

  let report = Prisma.validator<Prisma.ReportCreateManyInput>()({
    userEmail: user.email,
    input_item_id,
    returned_item_ids,
    cost,
    value,
    patch,
  });

  try {
    report = await prisma.report.create({ data: report });
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {},
        {
          status: 400,
          statusText: "Bad Request",
        },
      );
    }

    console.error(e);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }

  return NextResponse.json({
    headers: { "content-type": "application/json" },
    body: report,
  });
}

async function checkRateLimit(userEmail: string) {
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
