import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { initializePrisma } from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
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
    return NextResponse.json({ body: "Unauthorized", status: 401 });
  }

  if (await checkRateLimit(user.email)) {
    return NextResponse.json({
      body: "You can only make one report every 6 hours",
      status: 403,
    });
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

  report = await prisma.report.create({ data: report });

  return NextResponse.json({
    headers: { "content-type": "application/json" },
    body: report,
  });
}

async function checkRateLimit(userEmail: string) {
  // check if user has made a post in the last 6hrs
  const onceEvery = 6 * 60 * 60 * 1000; // 6hrs in ms

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
