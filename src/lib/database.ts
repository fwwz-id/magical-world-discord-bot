import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  log: [
    {
      level: "query",
      emit: "event",
    },
  ],
});

prisma.$on("query", ({ query, params, duration, timestamp }) => {
  console.log(
    `\x1b[33m[QUERY]\x1b[0m: ${query}, \x1b[33m[PARAMS]\x1b[0m: ${params}, \x1b[35m[DURATION]\x1b[0m: ${duration}ms, \x1b[35m[TIMESTAMP]\x1b[0m: ${timestamp}`
  );
});

prisma.$extends(withAccelerate());

type OmitPrismaClient = Omit<
  PrismaClient,
  | symbol
  | "$connect"
  | "$disconnect"
  | "$executeRaw"
  | "$executeRawUnsafe"
  | "$extends"
  | "$on"
  | "$queryRaw"
  | "$queryRawUnsafe"
  | "$transaction"
  | "$use"
>;

// Define the models object type
type Models = {
  -readonly [ModelName in keyof OmitPrismaClient]: OmitPrismaClient[ModelName];
};

let models = {} as Models;

// Dynamically generate model objects
Object.keys(prisma).forEach((modelName) => {
  const key = modelName as keyof OmitPrismaClient;

  if (key.startsWith("$")) return;

  models = Object.assign(models, { [key]: prisma[key] });
});

export { models };

export default prisma;
