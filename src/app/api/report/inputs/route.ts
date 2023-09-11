import prisma from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const inputItems = await prisma.inputItem.findMany();
    return NextResponse.json(inputItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {},
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
}
