import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient;

function createPrismaClient() {
  return new PrismaClient();
}

export function initializePrisma() {
  const _prismaClient = prismaClient ?? createPrismaClient();

  // For SSG and SSR always create a new Prisma Client
  if (typeof window === "undefined") {
    return createPrismaClient();
  }

  // Create the Prisma Client once in the client
  if (!prismaClient) {
    prismaClient = _prismaClient;
  }

  return _prismaClient;
}
